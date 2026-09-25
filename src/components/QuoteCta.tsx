import Link from "next/link";
import { Reveal } from "./Reveal";

export function QuoteCta() {
  return (
    <section className="section-pad bg-limestone/40">
      <div className="container-site text-center">
        <Reveal>
          <h2 className="font-display text-4xl text-navy md:text-5xl">
            Get your free cleaning quote
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Get an estimate in a few minutes, then book when it works for you.
            We confirm the appointment after we review your request.
          </p>
          <Link href="/book" className="btn-primary mt-8 inline-flex">
            Get a free quote
          </Link>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted">
            <Link href="/services" className="link-underline text-navy">
              Services
            </Link>
            <Link href="/guides" className="link-underline text-navy">
              Guides
            </Link>
            <Link href="/service-area" className="link-underline text-navy">
              Service area
            </Link>
            <Link href="/about" className="link-underline text-navy">
              About
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
