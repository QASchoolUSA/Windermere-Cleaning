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

const SERVICE_BASE: Record<ServiceSlug, number> = {
  "house-cleaning": 18000,
  "apartment-cleaning": 14000,
  "move-out-move-in-cleaning": 28000,
  "post-construction-cleaning": 35000,
  "deep-cleaning": 26000,
  "event-cleaning": 22000,
};

const PROPERTY_MULT: Record<PropertyType, number> = {
  apartment: 0.9,
  townhome: 1.0,
  house: 1.1,
};

const SQFT_MULT: Record<SqftBand, number> = {
  "under-1500": 0.9,
  "1500-2500": 1.0,
  "2500-4000": 1.25,
  "4000-plus": 1.55,
};

const FREQUENCY_MULT: Record<Frequency, number> = {
  "one-time": 1,
  weekly: 0.85,
  "bi-weekly": 0.9,
  monthly: 0.95,
};

const ADDON_CENTS: Record<AddonId, number> = {
  oven: 4500,
  fridge: 4500,
  windows: 7500,
  laundry: 3500,
  cabinets: 5500,
};

const BEDROOM_CENTS = 2500;
const BATHROOM_CENTS = 3000;

/** Frequencies that apply to maintenance-style services */
export function frequencyAllowed(service: ServiceSlug): boolean {
  return service === "house-cleaning" || service === "apartment-cleaning";
}

export function calculateQuoteCents(inputs: QuoteInputs): number {
  const base = SERVICE_BASE[inputs.service];
  const rooms =
    Math.max(0, inputs.bedrooms) * BEDROOM_CENTS +
    Math.max(0, inputs.bathrooms) * BATHROOM_CENTS;

  let subtotal =
    (base + rooms) *
    PROPERTY_MULT[inputs.propertyType] *
    SQFT_MULT[inputs.sqftBand];

  if (frequencyAllowed(inputs.service)) {
    subtotal *= FREQUENCY_MULT[inputs.frequency];
  }

  const addonsTotal = inputs.addons.reduce(
    (sum, id) => sum + ADDON_CENTS[id],
    0,
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

export const ADDON_OPTIONS: { id: AddonId; label: string; priceLabel: string }[] =
  [
    { id: "oven", label: "Inside oven", priceLabel: "+$45" },
    { id: "fridge", label: "Inside refrigerator", priceLabel: "+$45" },
    { id: "windows", label: "Interior windows", priceLabel: "+$75" },
    { id: "laundry", label: "Laundry (1 load)", priceLabel: "+$35" },
    { id: "cabinets", label: "Inside cabinets", priceLabel: "+$55" },
  ];

export const SQFT_OPTIONS: { id: SqftBand; label: string }[] = [
  { id: "under-1500", label: "Under 1,500 sq ft" },
  { id: "1500-2500", label: "1,500 – 2,500 sq ft" },
  { id: "2500-4000", label: "2,500 – 4,000 sq ft" },
  { id: "4000-plus", label: "4,000+ sq ft" },
];
