import type { ServiceSlug } from "./content/services";

export type PropertyType = "house" | "apartment" | "townhome";
export type Frequency = "one-time" | "weekly" | "bi-weekly" | "monthly";
export type SqftBand = "under-1500" | "1500-2500" | "2500-4000" | "4000-plus";
export type AddonId = "oven" | "fridge" | "windows" | "laundry" | "cabinets";

export type QuoteInputs = {
  service: ServiceSlug;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  sqftBand: SqftBand;
  frequency: Frequency;
  addons: AddonId[];
};

/**
 * Every number this site charges, in cents. Booking Broom is the source of
 * truth; the values in `DEFAULT_PRICING_CONFIG` are what shipped and are used
 * whenever the dashboard cannot be reached, so a quote is never blocked on it.
 */
export type PricingConfig = {
  kind: "service-base-mult";
  serviceBaseCents: { key: string; value: number }[];
  propertyMultipliers: { key: string; label: string; multiplier: number }[];
  sqftMultipliers: { key: string; label: string; multiplier: number }[];
  frequencyMultipliers: { key: string; label: string; multiplier: number }[];
  addonCents: { key: string; label: string; cents: number }[];
  bedroomCents: number;
  bathroomCents: number;
  /** Services where the frequency multiplier applies. */
  frequencyServices: string[];
};

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  kind: "service-base-mult",
  serviceBaseCents: [
    { key: "house-cleaning", value: 18000 },
    { key: "apartment-cleaning", value: 14000 },
    { key: "move-out-move-in-cleaning", value: 28000 },
    { key: "post-construction-cleaning", value: 35000 },
    { key: "deep-cleaning", value: 26000 },
    { key: "event-cleaning", value: 22000 },
  ],
  /** Ordered as the calculator presents them. */
  propertyMultipliers: [
    { key: "house", label: "House", multiplier: 1.1 },
    { key: "apartment", label: "Apartment", multiplier: 0.9 },
    { key: "townhome", label: "Townhome", multiplier: 1 },
  ],
  sqftMultipliers: [
    { key: "under-1500", label: "Under 1,500 sq ft", multiplier: 0.9 },
    { key: "1500-2500", label: "1,500 – 2,500 sq ft", multiplier: 1 },
    { key: "2500-4000", label: "2,500 – 4,000 sq ft", multiplier: 1.25 },
    { key: "4000-plus", label: "4,000+ sq ft", multiplier: 1.55 },
  ],
  frequencyMultipliers: [
    { key: "one-time", label: "One-time", multiplier: 1 },
    { key: "weekly", label: "Weekly", multiplier: 0.85 },
    { key: "bi-weekly", label: "Bi-weekly", multiplier: 0.9 },
    { key: "monthly", label: "Monthly", multiplier: 0.95 },
  ],
  addonCents: [
    { key: "oven", label: "Inside oven", cents: 4500 },
    { key: "fridge", label: "Inside refrigerator", cents: 4500 },
    { key: "windows", label: "Interior windows", cents: 7500 },
    { key: "laundry", label: "Laundry (1 load)", cents: 3500 },
    { key: "cabinets", label: "Inside cabinets", cents: 5500 },
  ],
  bedroomCents: 2500,
  bathroomCents: 3000,
  frequencyServices: ["house-cleaning", "apartment-cleaning"],
};

const SQFT_BAND_IDS: SqftBand[] = [
  "under-1500",
  "1500-2500",
  "2500-4000",
  "4000-plus",
];

const ADDON_IDS: AddonId[] = [
  "oven",
  "fridge",
  "windows",
  "laundry",
  "cabinets",
];

/**
 * Guards against a remote config that parses as JSON but is missing the bands or
 * add-ons the calculator iterates over, which would otherwise price a job at $0
 * or render an empty picker.
 */
export function isUsablePricingConfig(value: unknown): value is PricingConfig {
  if (!value || typeof value !== "object") return false;
  const config = value as Partial<PricingConfig>;
  if (config.kind !== "service-base-mult") return false;
  if (typeof config.bedroomCents !== "number") return false;
  if (typeof config.bathroomCents !== "number") return false;
  if (!Array.isArray(config.frequencyServices)) return false;

  if (
    !Array.isArray(config.sqftMultipliers) ||
    !SQFT_BAND_IDS.every((id) => config.sqftMultipliers!.some((m) => m.key === id))
  ) {
    return false;
  }

  if (
    !Array.isArray(config.addonCents) ||
    !ADDON_IDS.every((id) => config.addonCents!.some((a) => a.key === id))
  ) {
    return false;
  }

  return (
    Array.isArray(config.serviceBaseCents) &&
    config.serviceBaseCents.length > 0 &&
    Array.isArray(config.propertyMultipliers) &&
    config.propertyMultipliers.length > 0 &&
    Array.isArray(config.frequencyMultipliers) &&
    config.frequencyMultipliers.length > 0
  );
}

function multiplier(
  rows: { key: string; multiplier: number }[],
  key: string
): number {
  return rows.find((row) => row.key === key)?.multiplier ?? 1;
}

/** Frequencies that apply to maintenance-style services */
export function frequencyAllowed(
  service: ServiceSlug,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): boolean {
  return config.frequencyServices.includes(service);
}

export function calculateQuoteCents(
  inputs: QuoteInputs,
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): number {
  const base =
    config.serviceBaseCents.find((row) => row.key === inputs.service)?.value ?? 0;
  const rooms =
    Math.max(0, inputs.bedrooms) * config.bedroomCents +
    Math.max(0, inputs.bathrooms) * config.bathroomCents;

  let subtotal =
    (base + rooms) *
    multiplier(config.propertyMultipliers, inputs.propertyType) *
    multiplier(config.sqftMultipliers, inputs.sqftBand);

  if (frequencyAllowed(inputs.service, config)) {
    subtotal *= multiplier(config.frequencyMultipliers, inputs.frequency);
  }

  const addonsTotal = inputs.addons.reduce(
    (sum, id) =>
      sum + (config.addonCents.find((addon) => addon.key === id)?.cents ?? 0),
    0
  );

  return Math.round(subtotal + addonsTotal);
}

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function addonOptions(
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): { id: AddonId; label: string; priceLabel: string }[] {
  return config.addonCents.map((addon) => ({
    id: addon.key as AddonId,
    label: addon.label,
    priceLabel: `+${formatUsdFromCents(addon.cents)}`,
  }));
}

export function sqftOptions(
  config: PricingConfig = DEFAULT_PRICING_CONFIG
): { id: SqftBand; label: string }[] {
  return config.sqftMultipliers.map((band) => ({
    id: band.key as SqftBand,
    label: band.label,
  }));
}
