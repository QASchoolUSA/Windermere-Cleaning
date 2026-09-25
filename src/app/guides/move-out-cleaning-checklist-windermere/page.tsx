import Link from "next/link";
import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { getGuideBySlug } from "@/lib/guides";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
} from "@/lib/jsonld";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

const SLUG = "move-out-cleaning-checklist-windermere";
const PATH = `/guides/${SLUG}`;
const guide = getGuideBySlug(SLUG)!;

export const metadata: Metadata = createPageMetadata({
  title: guide.title,
  description: guide.description,
  path: PATH,
  image: "/images/move-in-out.jpg",
  keywords: guide.keywords,
});

const faqs = [
  {
    question: "What is included in move-out cleaning in Windermere?",
    answer:
      "An empty-home clean focused on kitchens, baths, floors, baseboards, closets, and—when scoped—inside appliances and garage floors. Exact inclusions are listed on your quote.",
  },
  {
    question: "How is move-out different from a deep clean?",
    answer:
      "Deep cleans often happen in occupied homes. Move-outs assume emptiness so crews can reach appliance interiors, closet floors, and edges landlords check for deposits.",
  },
  {
    question: "How long does a Windermere move-out clean take?",
    answer:
      "Most 3-bedroom homes need several hours with a full crew; larger homes or heavy soil can take a full day. Empty access is the biggest time saver.",
  },
  {
    question: "Will move-out cleaning guarantee my deposit?",
    answer:
      "No cleaner can guarantee a landlord’s decision. A documented checklist clean plus timestamped photos gives you the strongest evidence. Final deposit rules follow your lease.",
  },
  {
    question: "Do you clean apartments and condos in Windermere?",
    answer:
      "Yes—see apartment cleaning and request move-out scope when you book, or ask via the contact path on About.",
  },
];

const timelineSteps = [
  {
    name: "7–10 days out",
    text: "Book the move-out date; confirm appliance interiors and garage on the quote.",
  },
  {
    name: "2–3 days out",
    text: "Finish packing; schedule junk or haul-away so rooms are empty.",
  },
  {
    name: "Clean day",
    text: "Crew arrives to an empty home; walk punch-list rooms together if possible.",
  },
  {
    name: "Same day",
    text: "Review photos; handle small touch-ups before lockbox drop.",
  },
  {
    name: "Key return",
    text: "Deliver keys and the photo set to the landlord or property manager.",
  },
];

export default function MoveOutChecklistGuidePage() {
  const url = absoluteUrl(PATH);

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: guide.title,
          description: guide.description,
          url,
          datePublished: guide.datePublished,
          dateModified: guide.dateModified,
          image: absoluteUrl("/images/move-in-out.jpg"),
        })}
      />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={howToJsonLd({
          name: "Windermere move-out cleaning timeline before keys are due",
          description:
            "Steps to schedule and complete a Windermere move-out clean before key return.",
          steps: timelineSteps,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: "Move-Out Cleaning Checklist Windermere", path: PATH },
        ])}
      />

      <article className="bg-ivory pt-28">
        <div className="container-site section-pad !pt-8 !pb-6">
          <Reveal>
            <nav
              aria-label="Breadcrumb"
              className="text-[0.72rem] uppercase tracking-[0.14em] text-muted"
            >
              <Link href="/" className="link-underline text-navy">
                Home
              </Link>
              <span className="mx-2 text-brass/70">/</span>
              <Link href="/guides" className="link-underline text-navy">
                Guides
              </Link>
              <span className="mx-2 text-brass/70">/</span>
              <span className="text-navy">Move-out checklist</span>
            </nav>
            <p className="mt-8 text-[0.7rem] uppercase tracking-[0.18em] text-brass">
              Guide
            </p>
            <h1 className="mt-3 max-w-4xl font-display text-4xl text-navy md:text-6xl">
              Move-Out Cleaning Checklist for Windermere, FL Homes (2026)
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted">
              Room-by-room checklist for deposit photos—kitchens, baths,
              appliances, garage, and HOA expectations in Windermere and nearby
              Dr. Phillips.
            </p>
          </Reveal>
        </div>

        <div className="container-site grid gap-12 pb-16 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-8 space-y-14">
            <Reveal>
              <section>
                <h2 className="font-display text-3xl text-navy md:text-4xl">
                  What Is Move-Out Cleaning in Windermere?
                </h2>
                <p className="mt-5 text-[1.05rem] leading-relaxed text-navy">
                  <strong>
                    Move-out cleaning in Windermere is a top-to-bottom empty-home
                    clean designed for landlord walkthroughs, HOA turnover rules,
                    and deposit photo documentation—not a light tidy while
                    furniture is still in place.
                  </strong>{" "}
                  Windermere Cleaning’s{" "}
                  <Link
                    href="/services/move-out-move-in-cleaning"
                    className="link-underline text-navy"
                  >
                    move-out / move-in cleaning
                  </Link>{" "}
                  covers kitchens (including inside appliances when scoped),
                  bathrooms, floors, baseboards, interior windows in reach,
                  closets, and often garage floors when requested. Most
                  single-family homes need a half-day to full-day crew window
                  once the home is empty.
                </p>
                <p className="mt-4 leading-relaxed text-muted">
                  Use this checklist if you are leaving a Windermere, Dr.
                  Phillips, or nearby southwest Orlando rental or owned home and
                  need the property photo-ready for the next occupant.
                </p>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl text-navy md:text-4xl">
                  Move-Out vs Deep Clean vs Regular House Cleaning
                </h2>
                <div className="mt-6 overflow-x-auto border border-[color:var(--line)]">
                  <table className="w-full min-w-[36rem] text-left text-sm">
                    <thead className="bg-limestone/60 text-[0.7rem] uppercase tracking-[0.12em] text-navy">
                      <tr>
                        <th className="px-4 py-3 font-medium">Service</th>
                        <th className="px-4 py-3 font-medium">Best when</th>
                        <th className="px-4 py-3 font-medium">Furniture</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--line)] text-muted">
                      <tr>
                        <td className="px-4 py-3 text-navy">
                          <Link
                            href="/services/house-cleaning"
                            className="link-underline"
                          >
                            House cleaning
                          </Link>
                        </td>
                        <td className="px-4 py-3">Recurring occupied home</td>
                        <td className="px-4 py-3">In place</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-navy">
                          <Link
                            href="/services/deep-cleaning"
                            className="link-underline"
                          >
                            Deep cleaning
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          Seasonal reset or first visit
                        </td>
                        <td className="px-4 py-3">Usually occupied</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-navy">
                          <Link
                            href="/services/move-out-move-in-cleaning"
                            className="link-underline"
                          >
                            Move-out / move-in
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          Empty home; deposit or new keys
                        </td>
                        <td className="px-4 py-3">Empty (or nearly empty)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-navy">
                          <Link
                            href="/services/apartment-cleaning"
                            className="link-underline"
                          >
                            Apartment cleaning
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          Condos / apartments with stricter punch lists
                        </td>
                        <td className="px-4 py-3">Varies</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-5 leading-relaxed text-muted">
                  If couches and beds are still in rooms, ask for deep clean
                  first—or stage a final move-out visit after the truck leaves.
                  Cleaners cannot reach baseboards and closet corners behind
                  packed rooms.
                </p>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl text-navy md:text-4xl">
                  Room-by-Room Move-Out Checklist
                </h2>

                <h3 className="mt-10 font-display text-2xl text-navy">
                  Kitchen
                </h3>
                <ul className="mt-4 space-y-3 text-navy">
                  {[
                    "Empty and wipe inside fridge, freezer, oven, microwave, and dishwasher (confirm scope on quote).",
                    "Degrease stovetop, range hood exterior, and backsplash.",
                    "Clean sink, faucet, and disposal splash zone; wipe cabinets exterior; spot interiors if greasy.",
                    "Wipe counters, pantry shelves, and floors including under movable appliances if accessible.",
                    "Remove all food, trash, and recycling; leave no odors in bins.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-10 font-display text-2xl text-navy">
                  Bathrooms
                </h3>
                <ul className="mt-4 space-y-3 text-navy">
                  {[
                    "Scrub tub/shower, glass, grout film, toilet (including base and hinge area), vanity, and mirrors.",
                    "Wipe cabinet interiors if empty; remove hair from drains where accessible.",
                    "Mop floors; clean exhaust fan cover if dusty and reachable.",
                    "Windermere humidity makes mildew the #1 deposit dispute—do not skip grout lines and silicone edges.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-10 font-display text-2xl text-navy">
                  Bedrooms & closets
                </h3>
                <ul className="mt-4 space-y-3 text-navy">
                  {[
                    "Wipe shelves and rods; vacuum closet floors.",
                    "Dust ceiling fan blades and vents in reach.",
                    "Vacuum carpets edge-to-edge; mop hard floors; wipe baseboards.",
                    "Check under beds and behind doors for debris after furniture removal.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-10 font-display text-2xl text-navy">
                  Living areas & laundry
                </h3>
                <ul className="mt-4 space-y-3 text-navy">
                  {[
                    "Dust built-ins, window sills, and switch/outlet plates.",
                    "Wipe interior glass in reach; clean sliding-door tracks (lake and golf-community homes collect grit).",
                    "Empty washer/dryer drums and wipe exteriors; clear lint trap.",
                    "Vacuum or mop all floor edges.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="mt-10 font-display text-2xl text-navy">
                  Garage, entry, outdoor transitions (when scoped)
                </h3>
                <ul className="mt-4 space-y-3 text-navy">
                  {[
                    "Sweep garage floor; remove oil-absorbent litter if requested.",
                    "Wipe entry door glass and handle sets.",
                    "Clear lanai furniture residue only if outdoor cleaning is on the work order—full exterior pressure washing is usually separate.",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl text-navy md:text-4xl">
                  Deposit Photo Tips That Actually Help
                </h2>
                <ol className="mt-6 list-decimal space-y-3 pl-5 text-navy">
                  <li>
                    Shoot <strong>wide + detail</strong>: entire kitchen, then
                    open fridge/oven; entire bath, then shower corners.
                  </li>
                  <li>
                    Use daylight or bright overheads—dark mildew photos lose
                    disputes.
                  </li>
                  <li>
                    Photograph <strong>timestamps</strong> (phone metadata) the
                    day of the clean and after.
                  </li>
                  <li>
                    Capture empty closets, garage corner, and under-sink
                    cabinets—common “you left stuff” claims.
                  </li>
                  <li>
                    Send the set to landlord/PM the same day keys are returned.
                  </li>
                </ol>
                <p className="mt-5 leading-relaxed text-muted">
                  Windermere Cleaning can include a photo handoff as part of
                  professional move-outs when requested at booking.
                </p>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl text-navy md:text-4xl">
                  Local Notes: Windermere, Dr. Phillips, and HOA Homes
                </h2>
                <ul className="mt-6 space-y-4 text-navy">
                  <li className="flex gap-3">
                    <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                    <span>
                      <strong>Empty first:</strong> Butler Chain–adjacent and
                      golf-community homes often have more glass, tile, and
                      outdoor tracking—budget time accordingly.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                    <span>
                      <strong>HOA / lockbox:</strong> Share gate codes and
                      elevator/garage instructions before arrival.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                    <span>
                      <strong>Pets:</strong> Heavy pet homes may need extra
                      carpet time or a scoped{" "}
                      <Link
                        href="/services/apartment-cleaning"
                        className="link-underline"
                      >
                        apartment
                      </Link>
                      -style edge detailed vacuum.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                    <span>
                      <strong>Post-renovation:</strong> New paint or flooring
                      dust is a different scope—see{" "}
                      <Link
                        href="/services/post-construction-cleaning"
                        className="link-underline"
                      >
                        post-construction cleaning
                      </Link>
                      .
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                    <span>
                      <strong>Events:</strong> If the home hosted a sale or
                      party during move week, ask whether{" "}
                      <Link
                        href="/services/event-cleaning"
                        className="link-underline"
                      >
                        event cleaning
                      </Link>{" "}
                      leftovers (sticky floors, outdoor trash) are in scope.
                    </span>
                  </li>
                </ul>
                <p className="mt-5 leading-relaxed text-muted">
                  Service area details live on{" "}
                  <Link href="/service-area" className="link-underline text-navy">
                    service area
                  </Link>
                  ; company background on{" "}
                  <Link href="/about" className="link-underline text-navy">
                    about
                  </Link>
                  .
                </p>
              </section>
            </Reveal>

            <Reveal>
              <section>
                <h2 className="font-display text-3xl text-navy md:text-4xl">
                  Timeline Before Keys Are Due
                </h2>
                <div className="mt-6 overflow-x-auto border border-[color:var(--line)]">
                  <table className="w-full min-w-[28rem] text-left text-sm">
                    <thead className="bg-limestone/60 text-[0.7rem] uppercase tracking-[0.12em] text-navy">
                      <tr>
                        <th className="px-4 py-3 font-medium">When</th>
                        <th className="px-4 py-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[color:var(--line)] text-muted">
                      {timelineSteps.map((step) => (
                        <tr key={step.name}>
                          <td className="px-4 py-3 font-medium text-navy">
                            {step.name}
                          </td>
                          <td className="px-4 py-3">{step.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-5 leading-relaxed text-muted">
                  Rush same-day move-outs after a packed morning are possible
                  only if the home is already empty—message early via{" "}
                  <Link href="/book" className="link-underline text-navy">
                    book
                  </Link>
                  .
                </p>
              </section>
            </Reveal>
          </div>

          <aside className="md:col-span-4">
            <div className="atelier-panel sticky top-28 p-8">
              <p className="text-[0.7rem] uppercase tracking-[0.16em] text-brass">
                Ready to book
              </p>
              <p className="mt-3 font-display text-3xl text-navy">
                Empty-home move-out cleaning
              </p>
              <p className="mt-3 text-sm text-muted">
                Get a free quote for Windermere or Dr. Phillips—confirm
                appliances and garage on the estimate.
              </p>
              <Link href="/book?service=move-out-move-in-cleaning" className="btn-primary mt-6 inline-flex">
                Get a free quote
              </Link>
              <Link
                href="/services/move-out-move-in-cleaning"
                className="link-underline mt-4 block text-[0.72rem] uppercase tracking-[0.14em] text-navy"
              >
                Move-out service details
              </Link>
              <Link
                href="/services"
                className="link-underline mt-3 block text-[0.72rem] uppercase tracking-[0.14em] text-navy"
              >
                All services
              </Link>
            </div>
          </aside>
        </div>

        <Faq items={faqs} title="Move-out cleaning FAQs" />

        <section className="section-pad bg-navy text-ivory">
          <div className="container-site max-w-3xl text-center">
            <h2 className="font-display text-4xl md:text-5xl">
              Book your Windermere move-out clean
            </h2>
            <p className="mt-4 text-limestone/85">
              Empty the rooms, share access codes, and let the crew handle the
              deposit-ready checklist.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/book?service=move-out-move-in-cleaning" className="btn-brass">
                Get a free quote
              </Link>
              <Link
                href="/services/move-out-move-in-cleaning"
                className="inline-flex items-center justify-center border border-ivory/30 px-6 py-3 text-[0.72rem] uppercase tracking-[0.14em] text-ivory transition hover:border-brass hover:text-brass"
              >
                Service details
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  );
}
