import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

export function WhyUs() {
  return (
    <section className="section-pad bg-limestone/50">
      <div className="container-site grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/why-us.jpg"
              alt="Quiet living room corner with soft natural light"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
            Why Windermere Cleaning
          </p>
          <h2 className="mt-3 font-display text-4xl text-navy md:text-5xl">
            Careful work for homes that matter to you
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
            Windermere homes are not a place for a rushed pass-through. We
            schedule quietly, treat stone and wood with care, and leave the
            house settled—without overselling the visit.
          </p>
          <ul className="mt-8 space-y-4 text-navy">
            {[
              "Careful handling of stone, wood, and designer fixtures",
              "Clear quotes online—book when you are ready",
              "Local focus: Windermere and nearby Orange County",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-[0.95rem]">
                <span className="mt-2 h-px w-6 shrink-0 bg-brass" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-muted">
            Moving soon? Use our{" "}
            <Link
              href="/guides/move-out-cleaning-checklist-windermere"
              className="link-underline text-navy"
            >
              Windermere move-out cleaning checklist
            </Link>{" "}
            for deposit-ready rooms. Browse all{" "}
            <Link href="/guides" className="link-underline text-navy">
              cleaning guides
            </Link>{" "}
            or learn{" "}
            <Link href="/about" className="link-underline text-navy">
              about Windermere Cleaning
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
