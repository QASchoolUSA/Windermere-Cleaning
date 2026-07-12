import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { services } from "@/lib/content/services";
import { createPageMetadata } from "@/lib/seo";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = createPageMetadata({
  title: "Cleaning Services in Windermere, FL",
  description:
    "Explore Windermere Cleaning services: house, apartment, move-in/out, post-construction, deep cleaning, and after-event cleaning in Windermere, FL.",
  path: "/services",
  keywords: [
    "cleaning services Windermere FL",
    "house cleaning services Orange County FL",
  ],
});

export default function ServicesPage() {
  return (
    <div className="bg-ivory pt-28">
      <section className="container-site section-pad !pt-8">
        <Reveal>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
            Services
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-5xl text-navy md:text-6xl">
            Professional cleaning services in Windermere, FL
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Six focused services for estate homes, apartments, renovations, and
            celebrations—each with a dedicated quote path.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05}>
              <article className="group relative">
                <Link
                  href={`/services/${service.slug}`}
                  className="absolute inset-0 z-0"
                  aria-label={`View details for ${service.name}`}
                />
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <h2 className="mt-5 font-display text-3xl text-navy transition-colors group-hover:text-navy-soft">
                  {service.name}
                </h2>
                <p className="mt-3 text-muted">{service.summary}</p>
                <div className="relative z-10 mt-4 flex gap-4">
                  <span className="link-underline text-[0.72rem] uppercase tracking-[0.14em] text-navy pointer-events-none">
                    Learn more
                  </span>
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="link-underline text-[0.72rem] uppercase tracking-[0.14em] text-brass"
                  >
                    Get quote
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
