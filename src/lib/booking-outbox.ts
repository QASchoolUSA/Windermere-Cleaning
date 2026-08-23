/**
 * Durable booking/quote outbox (Cloudflare KV) + Telegram last-resort escalate.
 *
 * Flow: BB fail → KV put → soft success → cron retries BB → after max attempts/age → Telegram.
 */

/** Minimal KV surface so this module typechecks without @cloudflare/workers-types. */
type KvBinding = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(options: {
    prefix?: string;
    limit?: number;
  }): Promise<{ keys: Array<{ name: string }> }>;
};

export const OUTBOX_KEY_PREFIX = "outbox:";
/** Cron every 5 minutes × 12 attempts ≈ 1 hour before Telegram. */
export const OUTBOX_MAX_ATTEMPTS = 12;
/** Hard age cap even if attempts are low (ms). */
export const OUTBOX_MAX_AGE_MS = 6 * 60 * 60 * 1000;
export const OUTBOX_LIST_LIMIT = 100;

export type BookingOutboxRecord = {
  id: string;
  idempotencyKey: string;
  createdAt: string;
  attempts: number;
  lastAttemptAt?: string;
  lastError?: string;
  escalatedToTelegramAt?: string;
  /** BB wire body without api_key (credentials come from env at retry). */
  payload: Record<string, unknown>;
};

export type OutboxEnv = {
  BOOKING_OUTBOX?: KvBinding;
  BOOKING_BROOM_URL?: string;
  BOOKING_BROOM_API_KEY?: string;
  BOOKING_BROOM_SITE_SLUG?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
};

function outboxKey(id: string): string {
  return `${OUTBOX_KEY_PREFIX}${id}`;
}

export function createOutboxId(): string {
  return `ob_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function enqueueBookingOutbox(
  env: OutboxEnv,
  args: {
    payload: Record<string, unknown>;
    idempotencyKey?: string;
    lastError?: string;
  },
): Promise<{ queued: true; id: string } | { queued: false; error: string }> {
  const kv = env.BOOKING_OUTBOX;
  if (!kv) {
    return { queued: false, error: "BOOKING_OUTBOX KV binding missing" };
  }

  const id = createOutboxId();
  const idempotencyKey =
    (typeof args.idempotencyKey === "string" && args.idempotencyKey.trim()) ||
    id;

  const record: BookingOutboxRecord = {
    id,
    idempotencyKey,
    createdAt: new Date().toISOString(),
    attempts: 0,
    lastError: args.lastError,
    payload: {
      ...args.payload,
      idempotency_key:
        (args.payload.idempotency_key as string | undefined) || idempotencyKey,
    },
  };

  try {
    await kv.put(outboxKey(id), JSON.stringify(record));
    return { queued: true, id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "KV put failed";
    console.error("[booking-outbox] enqueue failed:", message);
    return { queued: false, error: message };
  }
}

function formatTelegramLead(
  record: BookingOutboxRecord,
  siteSlug: string,
  reason: string,
): string {
  const p = record.payload;
  const lines = [
    "⚠️ Booking Broom fallback — lead needs manual entry",
    `Site: ${siteSlug}`,
    `Reason: ${reason}`,
    `Outbox id: ${record.id}`,
    `Idempotency: ${record.idempotencyKey}`,
    `Attempts: ${record.attempts}`,
    `Created: ${record.createdAt}`,
    "",
    `Intent: ${String(p.intent ?? "—")}`,
    `Name: ${String(p.customer_name ?? "—")}`,
    `Email: ${String(p.email ?? "—")}`,
    `Phone: ${String(p.phone ?? "—")}`,
    `Address: ${String(p.address ?? "—")}`,
    `Service: ${String(p.service_type ?? "—")}`,
    `Preferred: ${String(p.preferred_date ?? "—")} ${String(p.preferred_time ?? "")}`.trim(),
    `Notes: ${String(p.notes ?? "—")}`,
  ];

  if (p.quote && typeof p.quote === "object") {
    const quote = p.quote as Record<string, unknown>;
    lines.push(
      `Quote estimate: ${String(quote.estimate ?? "—")} ${String(quote.currency ?? "USD")}`,
      `Frequency: ${String(quote.frequency ?? "—")}`,
    );
  }

  if (record.lastError) {
    lines.push("", `Last BB error: ${record.lastError}`);
  }

  const text = lines.join("\n");
  return text.length > 4000 ? `${text.slice(0, 3990)}…` : text;
}

export async function sendLeadToTelegram(
  env: OutboxEnv,
  record: BookingOutboxRecord,
  reason: string,
): Promise<{ sent: true } | { sent: false; error: string }> {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return { sent: false, error: "TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set" };
  }

  const siteSlug =
    env.BOOKING_BROOM_SITE_SLUG ||
    String(record.payload.site_slug ?? "unknown");

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: formatTelegramLead(record, siteSlug, reason),
          disable_web_page_preview: true,
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      const error = `Telegram HTTP ${response.status}: ${body.slice(0, 200)}`;
      console.error("[booking-outbox]", error);
      return { sent: false, error };
    }

    return { sent: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Telegram send failed";
    console.error("[booking-outbox] telegram error:", message);
    return { sent: false, error: message };
  }
}

async function forwardPayloadToBookingBroom(
  env: OutboxEnv,
  payload: Record<string, unknown>,
  idempotencyKey: string,
): Promise<{ ok: true; id?: string } | { ok: false; error: string }> {
  const baseUrl = (env.BOOKING_BROOM_URL || "https://app.bookingbroom.com").replace(/\/$/, "");
  const apiKey = env.BOOKING_BROOM_API_KEY;
  const siteSlug = env.BOOKING_BROOM_SITE_SLUG || "windermere";

  if (!baseUrl || !apiKey) {
    return { ok: false, error: "BOOKING_BROOM_API_KEY not set" };
  }

  try {
    const response = await fetch(`${baseUrl}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        ...payload,
        site_slug: siteSlug,
        api_key: apiKey,
        idempotency_key: idempotencyKey,
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: data.error ?? `HTTP ${response.status}` };
    }

    const data = (await response.json()) as { id?: string };
    return { ok: true, id: data.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: message };
  }
}

function shouldEscalate(record: BookingOutboxRecord, now: number): boolean {
  if (record.attempts >= OUTBOX_MAX_ATTEMPTS) return true;
  const created = Date.parse(record.createdAt);
  if (Number.isFinite(created) && now - created >= OUTBOX_MAX_AGE_MS) return true;
  return false;
}

/**
 * Cron entry: retry outbox → BB; escalate exhausted items to Telegram once.
 */
export async function processBookingOutbox(env: OutboxEnv): Promise<{
  processed: number;
  delivered: number;
  escalated: number;
  failed: number;
}> {
  const kv = env.BOOKING_OUTBOX;
  const summary = { processed: 0, delivered: 0, escalated: 0, failed: 0 };
  if (!kv) {
    console.warn("[booking-outbox] skip cron — BOOKING_OUTBOX missing");
    return summary;
  }

  const listed = await kv.list({ prefix: OUTBOX_KEY_PREFIX, limit: OUTBOX_LIST_LIMIT });
  const now = Date.now();

  for (const key of listed.keys) {
    summary.processed += 1;
    const raw = await kv.get(key.name);
    if (!raw) continue;

    let record: BookingOutboxRecord;
    try {
      record = JSON.parse(raw) as BookingOutboxRecord;
    } catch {
      await kv.delete(key.name);
      continue;
    }

    if (record.escalatedToTelegramAt) {
      await kv.delete(key.name);
      continue;
    }

    const result = await forwardPayloadToBookingBroom(
      env,
      record.payload,
      record.idempotencyKey,
    );

    if (result.ok) {
      await kv.delete(key.name);
      summary.delivered += 1;
      continue;
    }

    record.attempts += 1;
    record.lastAttemptAt = new Date(now).toISOString();
    record.lastError = result.error;

    if (shouldEscalate(record, now)) {
      const tg = await sendLeadToTelegram(
        env,
        record,
        `Retries exhausted (${record.attempts} attempts): ${result.error}`,
      );
      if (tg.sent) {
        summary.escalated += 1;
        await kv.delete(key.name);
      } else {
        record.escalatedToTelegramAt = undefined;
        record.lastError = `${result.error}; telegram: ${tg.error}`;
        await kv.put(key.name, JSON.stringify(record));
        summary.failed += 1;
      }
      continue;
    }

    await kv.put(key.name, JSON.stringify(record));
    summary.failed += 1;
  }

  console.info("[booking-outbox] cron", summary);
  return summary;
}

/** Resolve Cloudflare env in OpenNext request handlers (null in plain `next dev`). */
export async function getBookingOutboxEnv(): Promise<OutboxEnv> {
  const fromProcess: OutboxEnv = {
    BOOKING_BROOM_URL: process.env.BOOKING_BROOM_URL,
    BOOKING_BROOM_API_KEY: process.env.BOOKING_BROOM_API_KEY,
    BOOKING_BROOM_SITE_SLUG: process.env.BOOKING_BROOM_SITE_SLUG,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
  };

  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = getCloudflareContext();
    const cf = env as OutboxEnv;
    return {
      BOOKING_OUTBOX: cf.BOOKING_OUTBOX,
      BOOKING_BROOM_URL: cf.BOOKING_BROOM_URL ?? fromProcess.BOOKING_BROOM_URL,
      BOOKING_BROOM_API_KEY:
        cf.BOOKING_BROOM_API_KEY ?? fromProcess.BOOKING_BROOM_API_KEY,
      BOOKING_BROOM_SITE_SLUG:
        cf.BOOKING_BROOM_SITE_SLUG ?? fromProcess.BOOKING_BROOM_SITE_SLUG,
      TELEGRAM_BOT_TOKEN: cf.TELEGRAM_BOT_TOKEN ?? fromProcess.TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID: cf.TELEGRAM_CHAT_ID ?? fromProcess.TELEGRAM_CHAT_ID,
    };
  } catch {
    return fromProcess;
  }
}

/**
 * After a failed BB forward: queue to KV, or Telegram immediately if KV unavailable.
 * Returns true when the lead was captured by a fallback.
 */
export async function captureFailedBookingForward(args: {
  payload: Record<string, unknown>;
  idempotencyKey?: string;
  lastError?: string;
}): Promise<{ captured: boolean; via?: "kv" | "telegram"; error?: string }> {
  const env = await getBookingOutboxEnv();
  const queued = await enqueueBookingOutbox(env, args);
  if (queued.queued) {
    return { captured: true, via: "kv" };
  }

  const record: BookingOutboxRecord = {
    id: createOutboxId(),
    idempotencyKey: args.idempotencyKey || createOutboxId(),
    createdAt: new Date().toISOString(),
    attempts: 0,
    lastError: args.lastError ?? queued.error,
    payload: args.payload,
  };

  const tg = await sendLeadToTelegram(
    env,
    record,
    `BB failed and KV unavailable (${queued.error}): ${args.lastError ?? "unknown"}`,
  );
  if (tg.sent) {
    return { captured: true, via: "telegram" };
  }

  return {
    captured: false,
    error: `KV: ${queued.error}; Telegram: ${tg.error}`,
  };
}
