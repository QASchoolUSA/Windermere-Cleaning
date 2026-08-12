const PRODUCTION_SITE_URL = "https://windermerecleaning.com";

/** Prefer env URL, but never bake localhost into robots/sitemap for production. */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return PRODUCTION_SITE_URL;
  try {
    const host = new URL(raw).hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return PRODUCTION_SITE_URL;
    }
  } catch {
    return PRODUCTION_SITE_URL;
  }
  return raw.replace(/\/$/, "");
}

export const siteConfig = {
  name: "Windermere Cleaning",
  legalName: "Windermere Cleaning",
  tagline: "Discreet estate care for Windermere homes",
  description:
    "Luxury house cleaning, deep cleaning, move-in/out, post-construction, and event cleaning in Windermere, FL. Get a free quote and book online.",
  url: resolveSiteUrl(),
  locale: "en_US",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "hello@windermerecleaning.com",
  address: {
    streetAddress: "",
    addressLocality: "Windermere",
    addressRegion: "FL",
    postalCode: "34786",
    addressCountry: "US",
  },
  serviceArea: [
    "Windermere",
    "Lake Butler",
    "Bay Hill",
    "Dr. Phillips",
    "Winter Garden",
    "Horizon West",
    "Isleworth",
    "Orange County",
  ],
  social: {
    // Add when available
  },
} as const;

export type SiteConfig = typeof siteConfig;
