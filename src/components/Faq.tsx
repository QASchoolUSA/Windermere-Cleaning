import { Reveal } from "./Reveal";

export function Faq({
  items,
  title = "Questions, answered plainly",
}: {
  items: { question: string; answer: string }[];
  title?: string;
}) {
  return (
    <section className="section-pad bg-ivory">
      <div className="container-site">
        <Reveal>
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
            FAQ
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl text-navy md:text-5xl">
            {title}
          </h2>
        </Reveal>
        <div className="mt-12 divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
          {items.map((item, i) => (
            <Reveal key={item.question} delay={i * 0.04}>
              <details className="group py-6">
                <summary className="cursor-pointer list-none font-display text-xl text-navy marker:content-none md:text-2xl">
                  <span className="flex items-start justify-between gap-6">
                    {item.question}
                    <span className="mt-1 text-brass transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-[0.98rem] leading-relaxed text-muted">
                  {item.answer}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
