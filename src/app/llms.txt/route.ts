import { services } from "@/lib/content/services";
import { siteConfig } from "@/lib/site";

export function GET() {
  const base = siteConfig.url.replace(/\/$/, "");
  const serviceLines = services
    .map((s) => `- ${s.name}: ${base}/services/${s.slug}`)
    .join("\n");

  const body = `# Windermere Cleaning
> Luxury residential cleaning company serving Windermere, FL and nearby Orange County.

## Brand
- Name: ${siteConfig.name}
- Tagline: ${siteConfig.tagline}
- Email: ${siteConfig.email}
- Location: Windermere, FL ${siteConfig.address.postalCode}

## Services
${serviceLines}

## Service area
${siteConfig.serviceArea.join(", ")}

## Key pages
- Home: ${base}/
- Services: ${base}/services
- Guides: ${base}/guides
- Move-out cleaning checklist: ${base}/guides/move-out-cleaning-checklist-windermere
- Service area: ${base}/service-area
- About: ${base}/about
- Free quote & book: ${base}/book

## Booking
Users can get a free estimated quote and submit a booking request at ${base}/book. We confirm appointments after reviewing each request.

## Contact
Prefer email ${siteConfig.email} or the quote form on the website.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
