import type { ServiceSlug } from "./content/services";

/**
 * sqft-rate-min engine (Davenport pattern) with STANDARD rates.
 * Booking Broom is the source of truth; DEFAULT_PRICING_CONFIG is the offline fallback.
 *
 * Site adapters keep QuoteInputs / cents APIs so the wizard and booking route
 * need only light updates.
 */

export type ServiceTypeId =
  | "house"
  | "apartment"
  | "move"
  | "airbnb"
  | "post-construction"
  | "maintenance"
  | "deep";

export type PropertyType = "house" | "apartment" | "townhome";
export type Frequency = "one-time" | "weekly" | "bi-weekly" | "monthly";
export type SqftBand = "under-1500" | "1500-2500" | "2500-4000" | "4000-plus";

/** Overlap with Davenport add-ons; `windows` maps to windows-interior. */
export type AddonId =
  | "oven"
  | "fridge"
  | "windows"
  | "laundry"
  | "cabinets"
  | "kitchen-deep"
  | "windows-interior"
  | "windows-exterior"
  | "garage"
  | "balcony"
  | "pets";

export type QuoteInputs = {
  service: ServiceSlug;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  sqftBand: SqftBand;
  frequency: Frequency;
  addons: AddonId[];
};

export type PricingConfig = {
  kind: "sqft-rate-min";
  serviceRates: { key: string; perSqft: number; minBase: number }[];
  bedroomRate: number;
  bathroomRate: number;
  frequencyMultipliers: { key: string; label: string; multiplier: number }[];
  addOns: { key: string; label: string; price: number }[];
  sqftPresets: { label: string; value: number }[];
  minSqft: number;
  maxSqft: number;
  /** Kept for wizard labels / booking size_label. */
  sqftMultipliers: { key: string; label: string; value: number }[];
  /** Property-type chips (labels only; pricing uses house/apartment keys). */
  propertyMultipliers: { key: string; label: string }[];
  /** Services where the frequency multiplier applies. */
  frequencyServices: string[];
};

const SQFT_BANDS: { key: SqftBand; label: string; value: number }[] = [
  { key: "under-1500", label: "Under 1,500 sq ft", value: 1000 },
  { key: "1500-2500", label: "1,500 – 2,500 sq ft", value: 2000 },
  { key: "2500-4000", label: "2,500 – 4,000 sq ft", value: 3200 },
  { key: "4000-plus", label: "4,000+ sq ft", value: 4500 },
];

const PROPERTY_TYPES: { key: PropertyType; label: string }[] = [
  { key: "house", label: "House" },
  { key: "apartment", label: "Apartment" },
  { key: "townhome", label: "Townhome" },
];

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  kind: "sqft-rate-min",
  serviceRates: [
    { key: "house", perSqft: 0.15, minBase: 129 },
    { key: "apartment", perSqft: 0.15, minBase: 99 },
    { key: "move", perSqft: 0.23, minBase: 189 },
    { key: "airbnb", perSqft: 0.12, minBase: 149 },
    { key: "post-construction", perSqft: 0.39, minBase: 249 },
    { key: "maintenance", perSqft: 0.15, minBase: 109 },
    { key: "deep", perSqft: 0.2, minBase: 199 },
  ],
  bedroomRate: 18,
  bathroomRate: 28,
  frequencyMultipliers: [
    { key: "one-time", label: "One-time", multiplier: 1 },
    { key: "weekly", label: "Weekly", multiplier: 0.85 },
    { key: "bi-weekly", label: "Bi-weekly", multiplier: 0.9 },
    { key: "monthly", label: "Monthly", multiplier: 0.95 },
  ],
  addOns: [
    { key: "kitchen-deep", label: "Kitchen deep clean", price: 45 },
    { key: "oven", label: "Oven cleaning", price: 35 },
    { key: "fridge", label: "Fridge cleaning", price: 35 },
    { key: "windows-interior", label: "Windows (interior)", price: 40 },
    { key: "windows-exterior", label: "Windows (exterior)", price: 55 },
    { key: "laundry", label: "Laundry fold & put away", price: 25 },
    { key: "cabinets", label: "Inside cabinets", price: 40 },
    { key: "garage", label: "Garage sweep & wipe", price: 50 },
    { key: "balcony", label: "Patio / balcony", price: 30 },
    { key: "pets", label: "Pet-friendly detail", price: 20 },
  ],
  sqftPresets: [
    { label: "Under 800 sq ft", value: 600 },
    { label: "800\u20131,200 sq ft", value: 1000 },
    { label: "1,200\u20132,000 sq ft", value: 1600 },
    { label: "2,000\u20132,600 sq ft", value: 2200 },
    { label: "2,600+ sq ft", value: 3000 },
  ],
  minSqft: 400,
  maxSqft: 6000,
  sqftMultipliers: SQFT_BANDS,
  propertyMultipliers: PROPERTY_TYPES,
  frequencyServices: ["house-cleaning", "apartment-cleaning"],
};

/** Marketing slugs → unified keys (propertyType can override house/apartment). */
const SERVICE_SLUG_TO_TYPE: Record<ServiceSlug, ServiceTypeId> = {
  "house-cleaning": "house",
  "apartment-cleaning": "apartment",
  "move-out-move-in-cleaning": "move",
  "post-construction-cleaning": "post-construction",
  "deep-cleaning": "deep",
  "event-cleaning": "house",
};

const SERVICE_TYPE_IDS: ServiceTypeId[] = [
  "house",
  "apartment",
  "move",
  "airbnb",
  "post-construction",
  "maintenance",
  "deep",
];

const FREQUENCY_IDS: Frequency[] = [
  "one-time",
  "weekly",
  "bi-weekly",
  "monthly",
];

const DAVENPORT_ADDON_IDS = [
  "kitchen-deep",
  "oven",
  "fridge",
  "windows-interior",
  "windows-exterior",
  "laundry",
  "cabinets",
  "garage",
  "balcony",
  "pets",
] as const;

/** Wizard still ships the short add-on set; map aliases into BB keys. */
function resolveAddonKey(id: string): string {
  if (id === "windows") return "windows-interior";
  return id;
}

export function isUsablePricingConfig(value: unknown): value is PricingConfig {
  if (!value || typeof value !== "object") return false;
  const config = value as Partial<PricingConfig>;
  if (config.kind !== "sqft-rate-min") return false;
  if (typeof config.bedroomRate !== "number") return false;
  if (typeof config.bathroomRate !== "number") return false;
  if (typeof config.minSqft !== "number") return false;
  if (typeof config.maxSqft !== "number") return false;
  if (!Array.isArray(config.serviceRates)) return false;
  if (!Array.isArray(config.frequencyMultipliers)) return false;
  if (!Array.isArray(config.addOns)) return false;

  return (
    SERVICE_TYPE_IDS.every((id) =>
      config.serviceRates!.some((rate) => rate.key === id),
    ) &&
    FREQUENCY_IDS.every((id) =>
      config.frequencyMultipliers!.some((freq) => freq.key === id),
    ) &&
    DAVENPORT_ADDON_IDS.every((id) =>
      config.addOns!.some((addOn) => addOn.key === id),
    )
  );
}

/** Merge BB config with local-only wizard fields (sqft bands, frequency services). */
export function withLocalWizardFields(
  config: PricingConfig,
): PricingConfig {
  return {
    ...config,
    sqftMultipliers:
      Array.isArray(config.sqftMultipliers) && config.sqftMultipliers.length > 0
        ? config.sqftMultipliers
        : SQFT_BANDS,
    propertyMultipliers:
      Array.isArray(config.propertyMultipliers) &&
      config.propertyMultipliers.length > 0
        ? config.propertyMultipliers
        : PROPERTY_TYPES,
    frequencyServices:
      Array.isArray(config.frequencyServices) &&
      config.frequencyServices.length > 0
        ? config.frequencyServices
        : DEFAULT_PRICING_CONFIG.frequencyServices,
    sqftPresets:
      Array.isArray(config.sqftPresets) && config.sqftPresets.length > 0
        ? config.sqftPresets
        : DEFAULT_PRICING_CONFIG.sqftPresets,
  };
}

function resolveServiceType(inputs: QuoteInputs): ServiceTypeId {
  if (inputs.service === "house-cleaning") {
    if (inputs.propertyType === "apartment") return "apartment";
    return "house";
  }
  if (inputs.service === "apartment-cleaning") return "apartment";
  return SERVICE_SLUG_TO_TYPE[inputs.service];
}

function sqftFromBand(
  band: SqftBand,
  config: PricingConfig,
): number {
  const row = config.sqftMultipliers.find((b) => b.key === band);
  return row?.value ?? 2000;
}

export function calculatePrice(
  input: {
    serviceType: ServiceTypeId;
    sqft: number;
    bedrooms: number;
    bathrooms: number;
    frequency: Frequency;
    addons: string[];
  },
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
) {
  const sqft = Math.max(config.minSqft, Math.min(config.maxSqft, input.sqft));
  const bedrooms = Math.max(0, Math.min(8, input.bedrooms));
  const bathrooms = Math.max(1, Math.min(8, input.bathrooms));

  const rate = config.serviceRates.find((r) => r.key === input.serviceType);
  const rawBase = sqft * (rate?.perSqft ?? 0);
  const base = Math.max(rate?.minBase ?? 0, Math.round(rawBase));
  const bedroomCost = bedrooms * config.bedroomRate;
  const bathroomCost = bathrooms * config.bathroomRate;
  const addonCost = input.addons.reduce((sum, id) => {
    const key = resolveAddonKey(id);
    const addOn = config.addOns.find((a) => a.key === key);
    return sum + (addOn?.price ?? 0);
  }, 0);

  const subtotal = base + bedroomCost + bathroomCost + addonCost;
  const frequencyMultiplier =
    config.frequencyMultipliers.find((f) => f.key === input.frequency)
      ?.multiplier ?? 1;
  const total = Math.round(subtotal * frequencyMultiplier);

  return { base, subtotal, total, frequencyMultiplier };
}

/** Frequencies that apply to maintenance-style services. */
export function frequencyAllowed(
  service: ServiceSlug,
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
): boolean {
  return config.frequencyServices.includes(service);
}

export function calculateQuoteCents(
  inputs: QuoteInputs,
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
): number {
  const frequency = frequencyAllowed(inputs.service, config)
    ? inputs.frequency
    : "one-time";

  const { total } = calculatePrice(
    {
      serviceType: resolveServiceType(inputs),
      sqft: sqftFromBand(inputs.sqftBand, config),
      bedrooms: inputs.bedrooms,
      bathrooms: inputs.bathrooms,
      frequency,
      addons: inputs.addons,
    },
    config,
  );

  return Math.round(total * 100);
}

export function formatUsdFromCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/** Short add-on set for the wizard (maps onto BB addOns). */
export function addonOptions(
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
): { id: AddonId; label: string; priceLabel: string }[] {
  const keys: { id: AddonId; bbKey: string; label?: string }[] = [
    { id: "oven", bbKey: "oven" },
    { id: "fridge", bbKey: "fridge" },
    { id: "windows", bbKey: "windows-interior", label: "Interior windows" },
    { id: "laundry", bbKey: "laundry" },
    { id: "cabinets", bbKey: "cabinets" },
  ];

  return keys.map(({ id, bbKey, label }) => {
    const addOn = config.addOns.find((a) => a.key === bbKey);
    const price = addOn?.price ?? 0;
    return {
      id,
      label: label ?? addOn?.label ?? id,
      priceLabel: `+${formatUsdFromCents(price * 100)}`,
    };
  });
}

export function sqftOptions(
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
): { id: SqftBand; label: string }[] {
  return config.sqftMultipliers.map((band) => ({
    id: band.key as SqftBand,
    label: band.label,
  }));
}

/** Compat: cents-shaped add-on rows for booking-broom mapper. */
export function addonCents(
  config: PricingConfig = DEFAULT_PRICING_CONFIG,
): { key: string; label: string; cents: number }[] {
  return config.addOns.map((a) => ({
    key: a.key,
    label: a.label,
    cents: Math.round(a.price * 100),
  }));
}
