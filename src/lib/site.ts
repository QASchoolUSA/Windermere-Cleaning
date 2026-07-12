export const siteConfig = {
  name: "Windermere Cleaning",
  legalName: "Windermere Cleaning",
  tagline: "Discreet estate care for Windermere homes",
  description:
    "Luxury house cleaning, deep cleaning, move-in/out, post-construction, and event cleaning in Windermere, FL. Get a free quote and book online.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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
