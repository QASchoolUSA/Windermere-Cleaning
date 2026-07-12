import Link from "next/link";
import { services } from "@/lib/content/services";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-navy text-ivory">
      <div className="container-site section-pad grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-3xl md:text-4xl">Windermere Cleaning</p>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-limestone/85">
            {siteConfig.tagline}. Professional cleaning for Windermere, FL and
            nearby Orange County communities.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-brass">
            Services
          </p>
          <ul className="mt-4 space-y-2">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="link-underline text-sm text-limestone/90"
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-brass">
            Contact
          </p>
          <ul className="mt-4 space-y-2 text-sm text-limestone/90">
            <li>Windermere, FL {siteConfig.address.postalCode}</li>
            <li>
              <a className="link-underline" href={`mailto:${siteConfig.email}`}>
                {siteConfig.email}
              </a>
            </li>
            {siteConfig.phone ? (
              <li>
                <a className="link-underline" href={`tel:${siteConfig.phone}`}>
                  {siteConfig.phone}
                </a>
              </li>
            ) : null}
            <li>
              <Link href="/book" className="link-underline">
                Get a free quote
              </Link>
            </li>
            <li>
              <Link href="/service-area" className="link-underline">
                Service area
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-2 py-6 text-xs text-limestone/60 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p>Serving Windermere &amp; Orange County, Florida</p>
        </div>
      </div>
    </footer>
  );
}
