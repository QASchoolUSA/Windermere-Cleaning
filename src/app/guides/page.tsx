import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { guides } from "@/lib/guides";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Cleaning Guides for Windermere, FL",
  description:
    "Practical cleaning guides for Windermere, FL homeowners and renters—move-out checklists, deposit tips, and local home-care advice from Windermere Cleaning.",
  path: "/guides",
  keywords: [
    "Windermere cleaning guides",
    "move-out cleaning Windermere FL",
    "house cleaning tips Windermere",
  ],
});

export default function GuidesIndexPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Windermere FL Cleaning Guides",
    itemListElement: guides.map((g, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: g.title,
      url: absoluteUrl(`/guides/${g.slug}`),
    })),
  };

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
        ])}
      />
      <JsonLd data={itemListSchema} />

      <div className="bg-ivory pt-28">
        <section className="container-site section-pad !pt-8">
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
              Guides
            </p>
            <h1 className="mt-3 max-w-3xl font-display text-5xl text-navy md:text-6xl">
              Cleaning guides for Windermere, FL
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted">
              Local checklists and how-tos from Windermere Cleaning—built for
              deposit walkthroughs, empty-home resets, and Orange County moves.
            </p>
            <div className="mt-6 max-w-3xl space-y-4 text-muted leading-relaxed">
              <p>
                These guides are written for Windermere and nearby lake-community
                neighborhoods—Butler Chain estates, Isleworth-adjacent streets,
                Keene&apos;s Pointe, and the quieter cul-de-sacs off Conroy-Windermere
                Road—where open floor plans, outdoor living spaces, and HOA timing
                shape how a clean should be scoped. We focus on what homeowners,
                sellers, and property managers actually need before a walkthrough:
                room-by-room priorities, humidity-aware timing, and what usually
                trips deposit or listing inspections.
              </p>
              <p>
                Expect practical coverage of move-out and vacancy resets, recurring
                house-care cadence in humid Orange County seasons, and when a
                standard visit should upgrade to a deeper reset. Each guide links
                back to the matching service page and our free online quote so you
                can move from research to a confirmed plan without guessing at
                scope.
              </p>
            </div>
          </Reveal>

          <ul className="mt-14 divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
            {guides.map((guide, i) => (
              <Reveal key={guide.slug} delay={i * 0.04}>
                <li className="py-8">
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="group block max-w-3xl"
                  >
                    <h2 className="font-display text-2xl text-navy transition-colors group-hover:text-navy-soft md:text-3xl">
                      {guide.title}
                    </h2>
                    <p className="mt-3 text-muted">{guide.description}</p>
                    <span className="link-underline mt-4 inline-block text-[0.72rem] uppercase tracking-[0.14em] text-navy">
                      Read the guide
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal className="mt-14 border-t border-[color:var(--line)] pt-10">
            <p className="text-sm text-muted">
              Need a cleaner for the visit itself?{" "}
              <Link href="/services" className="link-underline text-navy">
                Browse services
              </Link>
              , check our{" "}
              <Link href="/service-area" className="link-underline text-navy">
                service area
              </Link>
              , or{" "}
              <Link href="/book" className="link-underline text-brass">
                get a free quote
              </Link>
              .
            </p>
          </Reveal>
        </section>
      </div>
    </>
  );
}
