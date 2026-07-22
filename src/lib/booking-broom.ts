import type { BookingPayload } from "./validations";
import { services } from "./content/services";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Booking Broom public API client.
 * POSTs { site_slug, api_key, customer_name, ... } to /api/bookings.
 */
export type BookingBroomResult = {
  ok: boolean;
  id?: string;
  message?: string;
};

function readEnv(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess) return fromProcess;

  try {
    const { env } = getCloudflareContext();
    const fromWorker = env[name as keyof typeof env];
    if (typeof fromWorker === "string") return fromWorker;
  } catch {
    // Not running inside the Cloudflare worker (e.g. next dev).
  }

  return undefined;
}

function getConfig() {
  const apiKey = readEnv("BOOKING_BROOM_API_KEY") || "";
  const explicitMode = readEnv("BOOKING_BROOM_MODE");
  const mode =
    explicitMode === "mock" || explicitMode === "live"
      ? explicitMode
      : apiKey
        ? "live"
        : "mock";

  return {
    mode: mode as "mock" | "live",
    baseUrl: (
      readEnv("BOOKING_BROOM_BASE_URL") ||
      readEnv("BOOKING_BROOM_URL") ||
      "https://bookings.kedrik.com"
    ).replace(/\/$/, ""),
    path: readEnv("BOOKING_BROOM_BOOKINGS_PATH") || "/api/bookings",
    apiKey,
    siteSlug: readEnv("BOOKING_BROOM_SITE_SLUG") || "windermere",
  };
}

function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function toBookingBroomBody(payload: BookingPayload, config: ReturnType<typeof getConfig>) {
  const serviceName =
    services.find((s) => s.slug === payload.quote.service)?.name ??
    payload.quote.service;

  const addressParts = [
    payload.address.line1,
    payload.address.line2,
    `${payload.address.city}, ${payload.address.state} ${payload.address.zip}`,
  ].filter(Boolean);

  const noteParts = [
    `Estimate ${formatUsdFromCents(payload.estimateCents)}`,
    `Frequency: ${payload.quote.frequency}`,
    payload.quote.addons.length
      ? `Add-ons: ${payload.quote.addons.join(", ")}`
      : null,
    payload.notes?.trim() || null,
  ].filter(Boolean);

  return {
    site_slug: config.siteSlug,
    api_key: config.apiKey,
    customer_name: payload.customer.name,
    email: payload.customer.email,
    phone: payload.customer.phone,
    address: addressParts.join(", "),
    service_type: serviceName,
    preferred_date: payload.schedule.preferredDate,
    preferred_time: payload.schedule.timeWindow,
    notes: noteParts.join(" · "),
  };
}

export async function createBooking(
  payload: BookingPayload,
): Promise<BookingBroomResult> {
  const config = getConfig();
  const body = toBookingBroomBody(payload, config);

  if (config.mode === "mock") {
    console.info("[booking-broom:mock]", JSON.stringify(body, null, 2));
    return {
      ok: true,
      id: `mock_${Date.now()}`,
      message: "Booking received (mock mode).",
    };
  }

  if (!config.apiKey) {
    console.error("[booking-broom] BOOKING_BROOM_API_KEY is not set");
    return {
      ok: false,
      message: "Booking is not configured. Please call us.",
    };
  }

  const url = `${config.baseUrl}${config.path.startsWith("/") ? config.path : `/${config.path}`}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[booking-broom] error", res.status, text);
    return {
      ok: false,
      message: "Unable to submit booking. Please try again or call us.",
    };
  }

  const data = (await res.json().catch(() => ({}))) as {
    id?: string;
    booking_id?: string;
    bookingId?: string;
    message?: string;
  };

  return {
    ok: true,
    id: data.id || data.booking_id || data.bookingId,
    message: data.message || "Booking received.",
  };
}
