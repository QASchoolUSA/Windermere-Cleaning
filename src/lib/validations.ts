import { z } from "zod";
import { services } from "./content/services";

const serviceSlugs = services.map((s) => s.slug) as [string, ...string[]];

export const quoteInputsSchema = z.object({
  service: z.enum(serviceSlugs as [string, ...string[]]),
  propertyType: z.enum(["house", "apartment", "townhome"]),
  bedrooms: z.number().int().min(0).max(12),
  bathrooms: z.number().int().min(1).max(12),
  sqftBand: z.enum(["under-1500", "1500-2500", "2500-4000", "4000-plus"]),
  frequency: z.enum(["one-time", "weekly", "bi-weekly", "monthly"]),
  addons: z.array(
    z.enum(["oven", "fridge", "windows", "laundry", "cabinets"]),
  ),
});

export const bookingSchema = z.object({
  quote: quoteInputsSchema,
  estimateCents: z.number().int().positive(),
  customer: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().min(7).max(40),
  }),
  schedule: z.object({
    preferredDate: z.string().min(1),
    timeWindow: z.enum(["morning", "afternoon", "flexible"]),
  }),
  address: z.object({
    line1: z.string().trim().min(3).max(200),
    line2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().length(2).default("FL"),
    zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/),
  }),
  notes: z.string().trim().max(2000).optional(),
  attribution: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_term: z.string().optional(),
      utm_content: z.string().optional(),
      gclid: z.string().optional(),
    })
    .optional(),
});

export type BookingPayload = z.infer<typeof bookingSchema>;
