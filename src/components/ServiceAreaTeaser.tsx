import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Reveal } from "./Reveal";

export function ServiceAreaTeaser() {
  return (
    <section className="relative overflow-hidden bg-navy text-ivory">
      <div className="absolute inset-0">
        <Image
          src="/images/service-area.jpg"
          alt="Calm lake landscape near Windermere Florida service area"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-navy/70" />
      </div>
      <div className="relative container-site section-pad">
        <Reveal>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
            Service area
          </p>
          <h2 className="mt-3 max-w-xl font-display text-4xl md:text-5xl">
            Rooted in Windermere, FL
          </h2>
          <p className="mt-4 max-w-lg text-limestone/85">
            We serve Windermere and neighboring Orange County communities where
            estate and lake living demand careful, consistent cleaning.
          </p>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-limestone/75">
            {siteConfig.serviceArea.join(" · ")}
          </p>
          <Link href="/service-area" className="btn-ghost mt-8 inline-flex">
            Explore service area
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
