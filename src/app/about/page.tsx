import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Reveal } from "@/components/Reveal";
import { createPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "About Windermere Cleaning",
  description:
    "Windermere Cleaning is a luxury residential cleaning company serving Windermere, FL and nearby Orange County. Learn who we are and how booking works.",
  path: "/about",
  image: "/images/why-us.jpg",
  keywords: [
    "about Windermere Cleaning",
    "cleaning company Windermere FL",
  ],
});

export default function AboutPage() {
  return (
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
            {siteConfig.name} provides professional residential cleaning for
            Windermere, Florida and neighboring Orange County communities. We
            focus on discreet service for high-value homes—clear online quotes,
            careful workmanship, and bookings that flow into our scheduling
            system for confirmation.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Whether you need weekly house cleaning, a deep reset, move-in or
            move-out care, post-construction cleanup, or help after a
            celebration, we scope the work to your property and timeline.
          </p>
          <Link href="/book" className="btn-primary mt-8 inline-flex">
            Get a free quote
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/why-us.jpg"
              alt="Interior detail representing Windermere Cleaning’s refined approach"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
