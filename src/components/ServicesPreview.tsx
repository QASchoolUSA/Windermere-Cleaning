"use client";

import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/content/services";
import { Reveal } from "./Reveal";

export function ServicesPreview() {
  return (
    <section id="services" className="section-pad bg-ivory">
      <div className="container-site">
        <Reveal>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
            Services
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl text-navy md:text-5xl">
            Cleaning crafted for Windermere homes
          </h2>
          <p className="mt-4 max-w-xl text-muted">
            From weekly estate care to post-construction resets—each service is
            scoped for high-value finishes and discreet service.
          </p>
        </Reveal>

        <ul className="mt-14 divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
          {services.map((service, i) => (
            <Reveal key={service.slug} delay={i * 0.05}>
              <li className="group grid gap-6 py-8 md:grid-cols-12 md:items-center">
                <div className="relative aspect-[4/3] overflow-hidden md:col-span-4">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="md:col-span-5">
                  <h3 className="font-display text-2xl text-navy md:text-3xl">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                    {service.summary}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 md:col-span-3 md:justify-end">
                  <Link
                    href={`/services/${service.slug}`}
                    className="link-underline text-[0.72rem] uppercase tracking-[0.14em] text-navy"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="btn-primary !py-2.5 !px-4"
                  >
                    Quote
                  </Link>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10">
          <Link
            href="/services"
            className="link-underline text-[0.75rem] uppercase tracking-[0.14em] text-navy"
          >
            View all services
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
