import Image from "next/image";
import { Reveal } from "./Reveal";

export function WhyUs() {
  return (
    <section className="section-pad bg-limestone/50">
      <div className="container-site grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/why-us.jpg"
              alt="Refined interior details reflecting discreet luxury cleaning standards"
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
            Quiet professionalism for high-value homes
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
            Windermere properties deserve more than a rushed checklist. We
            schedule with discretion, respect premium materials, and leave homes
            settled—not staged with cluttered marketing promises.
          </p>
          <ul className="mt-8 space-y-4 text-navy">
            {[
              "Detail-minded care for stone, wood, and designer fixtures",
              "Clear quotes online—then book when you’re ready",
              "Local focus: Windermere and nearby Orange County",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-[0.95rem]">
                <span className="mt-2 h-px w-6 shrink-0 bg-brass" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
