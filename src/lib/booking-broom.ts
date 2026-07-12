import type { BookingPayload } from "./validations";

/**
 * Booking Broom HTTP client.
 * Adjust BOOKING_BROOM_* env vars when the live API contract is provided.
 *
 * Expected outbound body (v1 assumption — map in createBooking if needed):
 * {
 *   source: "windermere-cleaning",
 *   service, estimateCents, inputs,
 *   customer, schedule, address, notes?, attribution?
 * }
 */
export type BookingBroomResult = {
  ok: boolean;
  id?: string;
  message?: string;
};

function getConfig() {
  return {
    mode: (process.env.BOOKING_BROOM_MODE || "mock") as "mock" | "live",
    baseUrl: (
      process.env.BOOKING_BROOM_BASE_URL || "https://bookings.kedrik.com"
    ).replace(/\/$/, ""),
    path: process.env.BOOKING_BROOM_BOOKINGS_PATH || "/api/bookings",
    apiKey: process.env.BOOKING_BROOM_API_KEY || "",
  };
}

export async function createBooking(
  payload: BookingPayload,
): Promise<BookingBroomResult> {
  const config = getConfig();

  const body = {
    source: "windermere-cleaning",
    service: payload.quote.service,
    estimateCents: payload.estimateCents,
    inputs: payload.quote,
    customer: payload.customer,
    schedule: payload.schedule,
    address: payload.address,
    notes: payload.notes,
    attribution: payload.attribution,
  };

  if (config.mode === "mock") {
    console.info("[booking-broom:mock]", JSON.stringify(body, null, 2));
    return {
      ok: true,
      id: `mock_${Date.now()}`,
      message: "Booking received (mock mode).",
    };
  }

  const url = `${config.baseUrl}${config.path.startsWith("/") ? config.path : `/${config.path}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
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
    bookingId?: string;
    message?: string;
  };

  return {
    ok: true,
    id: data.id || data.bookingId,
    message: data.message || "Booking received.",
  };
}
