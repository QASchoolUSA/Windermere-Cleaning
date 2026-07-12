import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { Reveal } from "@/components/Reveal";
import { faqJsonLd } from "@/lib/jsonld";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

const areaFaqs = [
  {
    question: "Does Windermere Cleaning serve only Windermere, FL?",
    answer:
      "Windermere is our home base. We also serve nearby Orange County communities such as Lake Butler, Bay Hill, Dr. Phillips, Winter Garden, Horizon West, and surrounding neighborhoods.",
  },
  {
    question: "Is my neighborhood covered?",
    answer:
      "If you are near Windermere or central Orange County, request a quote with your address. We’ll confirm coverage when we review your booking.",
  },
];

export const metadata: Metadata = createPageMetadata({
  title: "Service Area — Windermere & Orange County, FL",
  description:
    "Windermere Cleaning serves Windermere, FL and nearby areas including Lake Butler, Bay Hill, Dr. Phillips, Winter Garden, and Horizon West.",
  path: "/service-area",
  image: "/images/service-area.jpg",
  keywords: [
    "cleaning Windermere FL",
    "house cleaners Orange County FL",
    "Lake Butler cleaning service",
  ],
});

export default function ServiceAreaPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(areaFaqs)} />
      <div className="bg-ivory pt-28">
        <div className="relative h-[42vh] min-h-[280px]">
          <Image
            src="/images/service-area.jpg"
            alt="Lake and landscape atmosphere near Windermere Florida"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy/50" />
          <div className="absolute inset-x-0 bottom-0 container-site pb-10">
            <h1 className="font-display text-4xl text-ivory md:text-6xl">
              Service area
            </h1>
          </div>
        </div>

        <section className="container-site section-pad">
          <Reveal>
            <h2 className="font-display text-3xl text-navy md:text-4xl">
              Windermere, FL and nearby communities
            </h2>
            <p className="mt-5 max-w-2xl text-lg text-muted">
              We provide residential cleaning across Windermere and neighboring
              Orange County areas known for lake living and estate homes.
            </p>
          </Reveal>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {siteConfig.serviceArea.map((area) => (
              <li
                key={area}
                className="border border-[color:var(--line)] bg-white/60 px-5 py-4 font-display text-xl text-navy"
              >
                {area}
              </li>
            ))}
          </ul>

          <Link href="/book" className="btn-primary mt-12 inline-flex">
            Quote cleaning in your area
          </Link>
        </section>

        <Faq items={areaFaqs} title="Service area FAQs" />
      </div>
    </>
  );
}
