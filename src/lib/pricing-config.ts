import { readEnv } from "./env";
import {
  DEFAULT_PRICING_CONFIG,
  isUsablePricingConfig,
  type PricingConfig,
} from "./pricing";

/**
 * Fetches this site's prices from Booking Broom.
 *
 * Server-only: it carries the API key. Any failure — dashboard down, bad
 * credentials, unrecognised shape — falls back to the prices compiled into
 * `DEFAULT_PRICING_CONFIG`, because showing a stale price is far better than
 * showing no price or a wrong one.
 */

/** Seconds a fetched config is reused before Next revalidates it. */
const REVALIDATE_SECONDS = 300;

export async function getPricingConfig(): Promise<PricingConfig> {
  const baseUrl = (
    readEnv("BOOKING_BROOM_BASE_URL") ||
    readEnv("BOOKING_BROOM_URL") ||
    "https://app.bookingbroom.com"
  ).replace(/\/$/, "");
  const apiKey = readEnv("BOOKING_BROOM_API_KEY");
  if (!baseUrl || !apiKey) return DEFAULT_PRICING_CONFIG;

  try {
    const res = await fetch(`${baseUrl}/api/pricing`, {
      headers: {
        "X-Site-Slug": readEnv("BOOKING_BROOM_SITE_SLUG") || "windermere",
        "X-Api-Key": apiKey,
      },
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) return DEFAULT_PRICING_CONFIG;

    const body = (await res.json()) as { config?: unknown };
    return isUsablePricingConfig(body.config)
      ? body.config
      : DEFAULT_PRICING_CONFIG;
  } catch {
    return DEFAULT_PRICING_CONFIG;
  }
}
