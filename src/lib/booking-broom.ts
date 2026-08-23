import type { BookingPayload } from "./validations";
import { services } from "./content/services";
import { DEFAULT_PRICING_CONFIG, type PricingConfig } from "./pricing";
import { readEnv } from "./env";

/**
 * Booking Broom public API client.
 * POSTs { site_slug, api_key, customer_name, ... } to /api/bookings.
 */
export type BookingBroomResult = {
  ok: boolean;
  id?: string;
  message?: string;
};

function getConfig() {
  const apiKey = readEnv("BOOKING_BROOM_API_KEY") || "";
  const explicitMode = readEnv("BOOKING_BROOM_MODE");
  const isProduction = process.env.NODE_ENV === "production";
  /**
   * Mock has to be asked for. Inferring it from a missing key silently dropped
   * real bookings in production while still showing the customer a success page.
   * Local development without a key still mocks, so nothing breaks there.
   */
  const mode: "mock" | "live" =
    explicitMode === "mock" || (!isProduction && !apiKey && explicitMode !== "live")
      ? "mock"
      : "live";

  return {
    mode,
    baseUrl: (
      readEnv("BOOKING_BROOM_BASE_URL") ||
      readEnv("BOOKING_BROOM_URL") ||
      "https://app.bookingbroom.com"
    ).replace(/\/$/, ""),
    path: readEnv("BOOKING_BROOM_BOOKINGS_PATH") || "/api/bookings",
    apiKey,
    siteSlug: "windermere",
  };
}

function hasAnyValue(record: Record<string, string | undefined> | undefined) {
  return Boolean(record && Object.values(record).some(Boolean));
}

function toBookingBroomBody(
  payload: BookingPayload,
  config: ReturnType<typeof getConfig>,
  pricing: PricingConfig,
) {
  const serviceName =
    services.find((s) => s.slug === payload.quote.service)?.name ??
    payload.quote.service;

  const addressParts = [
    payload.address.line1,
    payload.address.line2,
    `${payload.address.city}, ${payload.address.state} ${payload.address.zip}`,
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
    notes: payload.notes?.trim() || undefined,
    intent: payload.intent === "quote" ? "quote" : "book",
    // Already in Booking Broom's wire shape, captured by readAttribution().
    attribution: hasAnyValue(payload.attribution) ? payload.attribution : undefined,
    property: {
      bedrooms: payload.quote.bedrooms,
      bathrooms: payload.quote.bathrooms,
      size_label: pricing.sqftMultipliers.find(
        (band) => band.key === payload.quote.sqftBand,
      )?.label,
      home_type: payload.quote.propertyType,
    },
    quote: {
      estimate: payload.estimateCents / 100,
      currency: "USD",
      frequency: payload.quote.frequency,
      add_ons: payload.quote.addons.map((id) => {
        const addon = pricing.addonCents.find((a) => a.key === id);
        return {
          label: addon?.label ?? id,
          price: addon ? addon.cents / 100 : undefined,
        };
      }),
      payment_terms: "Due after cleaning is complete",
    },
  };
}

export async function createBooking(
  payload: BookingBroomPayload,
): Promise<BookingBroomResult> {
  const config = await getConfig();
  const idempotencyKey =
    `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const wirePayload: Record<string, unknown> = {
    ...payload,
    idempotency_key: idempotencyKey,
  };

  async function fallback(lastError: string): Promise<BookingBroomResult> {
    const { captureFailedBookingForward } = await import("@/lib/booking-outbox");
    const captured = await captureFailedBookingForward({
      payload: wirePayload,
      idempotencyKey,
      lastError,
    });
    if (captured.captured) {
      return {
        ok: true,
        degraded: true,
        fallback: captured.via,
        message: "Request received. We will confirm shortly.",
      };
    }
    return {
      ok: false,
      message: "Unable to submit booking. Please try again or call us.",
      error: captured.error || lastError,
    };
  }

  if (!config.apiKey) {
    console.error("[booking-broom] BOOKING_BROOM_API_KEY is not set");
    return fallback("Booking is not configured");
  }

  try {
    const res = await fetch(`${config.baseUrl}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        site_slug: config.siteSlug,
        api_key: config.apiKey,
        ...wirePayload,
      }),
    });

    if (!res.ok) {
      const responseText = await res.text().catch(() => "");
      let upstream = responseText.slice(0, 300);
      try {
        const parsed = JSON.parse(responseText) as { error?: string };
        if (parsed.error) upstream = parsed.error;
      } catch {
        // Keep raw body snippet.
      }
      console.error("[booking-broom] error", res.status, upstream);
      return fallback(upstream || `HTTP ${res.status}`);
    }

    const data = (await res.json().catch(() => ({}))) as {
      id?: string;
      booking_id?: string;
      message?: string;
    };

    return {
      ok: true,
      id: data.id || data.booking_id,
      message: data.message || "Booking received.",
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[booking-broom] forward error:", message);
    return fallback(message);
  }
}
