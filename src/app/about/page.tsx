import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/jsonld";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "About Windermere Cleaning",
  description:
    "Windermere Cleaning provides discreet residential cleaning for Windermere, FL and nearby Orange County. Learn who we are and how to book.",
  path: "/about",
  image: "/images/why-us.jpg",
  keywords: [
    "about Windermere Cleaning",
    "cleaning company Windermere FL",
  ],
});

const aboutFaqs = [
  {
    question: "Where does Windermere Cleaning work?",
    answer:
      "We focus on Windermere, FL and nearby Orange County communities such as Lake Butler, Bay Hill, Dr. Phillips, Winter Garden, Horizon West, and Isleworth.",
  },
  {
    question: "How do quotes and booking work?",
    answer:
      "Start with a free online quote on the Book page. When you are ready, request a visit—we confirm after reviewing your home details. No pressure to book immediately.",
  },
  {
    question: "What services do you offer?",
    answer:
      "House, apartment, move-in/out, deep, post-construction, and after-event cleaning. Each service has its own page with inclusions and FAQs.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <JsonLd data={faqJsonLd(aboutFaqs)} />

      <div className="bg-ivory pt-28">
        <section className="container-site section-pad !pt-8 grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
              About
            </p>
            <h1 className="mt-3 font-display text-5xl text-navy md:text-6xl">
              {siteConfig.name}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {siteConfig.name} cleans homes in Windermere, Florida and nearby
              Orange County. We keep the work discreet: clear online quotes,
              careful handling of finishes, and confirmation once we review your
              booking request.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Weekly house cleaning, a deep reset, move-in or move-out care,
              post-construction cleanup, or help after a celebration—we match the
              visit to your property and timeline.
            </p>
            <Link href="/book" className="btn-primary mt-8 inline-flex">
              Get a free quote
            </Link>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <li>
                <Link href="/services" className="link-underline text-navy">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/guides" className="link-underline text-navy">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/service-area" className="link-underline text-navy">
                  Service area
                </Link>
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/why-us.jpg"
                alt="Soft interior light in a Windermere living space"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </section>

        <Faq items={aboutFaqs} title="About Windermere Cleaning" />
      </div>
    </>
  );
}
