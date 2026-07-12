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
            Estimate in minutes, then book when it fits—your request goes
            straight to our booking system for confirmation.
          </p>
          <Link href="/book" className="btn-primary mt-8 inline-flex">
            Open quote calculator
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
