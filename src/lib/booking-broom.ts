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
      "https://bookings.kedrik.com"
    ).replace(/\/$/, ""),
    path: readEnv("BOOKING_BROOM_BOOKINGS_PATH") || "/api/bookings",
    apiKey,
    siteSlug: readEnv("BOOKING_BROOM_SITE_SLUG") || "windermere",
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
  payload: BookingPayload,
  pricing: PricingConfig = DEFAULT_PRICING_CONFIG,
): Promise<BookingBroomResult> {
  const config = getConfig();
  const body = toBookingBroomBody(payload, config, pricing);

  if (config.mode === "mock") {
    console.warn("[booking-broom:mock] booking NOT sent upstream");
    console.info("[booking-broom:mock]", JSON.stringify(body, null, 2));
    return {
      ok: true,
      id: `mock_${Date.now()}`,
      message: "Booking received (mock mode).",
    };
  }

  if (!config.apiKey) {
    console.error(
      "[booking-broom] BOOKING_BROOM_API_KEY is not set — booking was NOT saved",
    );
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
