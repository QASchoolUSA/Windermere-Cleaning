import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { QuoteCalculator } from "@/components/QuoteCalculator";
import { getServiceBySlug } from "@/lib/content/services";
import { getPricingConfig } from "@/lib/pricing-config";
import { createPageMetadata } from "@/lib/seo";

type PageProps = {
  searchParams: Promise<{ service?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const service = params.service ? getServiceBySlug(params.service) : undefined;

  if (service) {
    return createPageMetadata({
      title: `${service.name} Quote & Book Online`,
      description: `Get an instant ${service.name.toLowerCase()} estimate for Windermere, FL homes and apartments. Review scope details, then book online with Windermere Cleaning.`,
      path: "/book",
      image: "/images/book-atelier.jpg",
      keywords: [
        `${service.name} quote Windermere FL`,
        `book ${service.name.toLowerCase()} Windermere`,
        "online cleaning estimate Florida",
        ...service.keywords.slice(0, 2),
      ],
    });
  }

  return createPageMetadata({
    title: "Free Cleaning Quote & Book Online",
    description:
      "Get an instant estimated cleaning quote for Windermere, FL homes and apartments. Book house, deep, move-in/out, post-construction, or event cleaning online.",
    path: "/book",
    image: "/images/book-atelier.jpg",
    keywords: [
      "cleaning quote Windermere FL",
      "book house cleaning Windermere",
      "online cleaning estimate Florida",
    ],
  });
}

const faqs = [
  {
    q: "Is the online quote binding?",
    a: "No. The calculator returns a planning estimate from the service type, bedrooms, bathrooms, and square-footage band you select. We confirm the final total when you share access notes and we review the scope.",
  },
  {
    q: "Which service should I start with?",
    a: "Choose house cleaning for routine upkeep, deep cleaning for a thorough reset, or move-in/out when the home is empty. Apartment, post-construction, and event cleaning are available when those scopes fit better.",
  },
  {
    q: "How quickly can I book after quoting?",
    a: "Most homeowners finish the quote, pick a preferred day, and submit booking details in one sitting. We follow up to confirm timing, gate codes, and any estate-specific access instructions.",
  },
] as const;

export default async function BookPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const pricing = await getPricingConfig();
  const service = params.service ? getServiceBySlug(params.service) : undefined;

  return (
    <div className="relative bg-ivory pt-28 pb-20">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/book-atelier.jpg"
          alt="Quiet living room used as the backdrop for our online quote form"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory/90 to-ivory" />
      </div>
      <div className="container-site max-w-3xl">
        <header className="mb-10">
          <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
            Quote &amp; book
          </p>
          <h1 className="mt-3 font-display text-4xl text-navy md:text-5xl">
            {service
              ? `${service.name} quote for Windermere, FL`
              : "Free cleaning quote for Windermere, FL"}
          </h1>
          <p className="mt-4 text-lg text-muted">
            {service
              ? `Estimate ${service.name.toLowerCase()} for your Windermere address, then reserve a visit online.`
              : "Estimate house, deep, move-in/out, or specialty cleaning for your Windermere address, then reserve a visit online."}
          </p>
        </header>

        <QuoteCalculator initialService={params.service} config={pricing} />

        <section className="mt-14 space-y-5 text-muted leading-relaxed">
          <h2 className="font-display text-2xl text-navy md:text-3xl">
            How quoting works
          </h2>
          <p>
            Start by choosing the service that matches the job—weekly house
            upkeep, a seasonal deep reset, an empty-home move-in or move-out, or
            a post-construction / event clean when dust and staging demand extra
            care. Enter bedrooms, bathrooms, and a square-footage band so the
            calculator can return a transparent planning range instead of a
            vague “call for price” placeholder.
          </p>
          <p>
            Windermere homes often include open kitchens, stone finishes, and
            gated access, so the next step is confirming how we enter and what
            to prioritize. After you submit, we review notes for pet areas,
            guest suites, and HOA timing, then lock a visit window that fits
            your calendar. You can also browse{" "}
            <Link href="/services" className="link-underline text-navy">
              all services
            </Link>{" "}
            or check the{" "}
            <Link href="/service-area" className="link-underline text-navy">
              service area
            </Link>{" "}
            before you book.
          </p>
          <p>
            Prefer to research first? Our{" "}
            <Link href="/guides" className="link-underline text-navy">
              Windermere cleaning guides
            </Link>{" "}
            cover move-out checklists and local home-care tips so you know what
            landlords and estate managers typically inspect before you request
            a quote.
          </p>
        </section>

        <section className="mt-12 border-t border-[color:var(--line)] pt-10">
          <h2 className="font-display text-2xl text-navy">Quote FAQ</h2>
          <dl className="mt-6 space-y-6">
            {faqs.map((item) => (
              <div key={item.q}>
                <dt className="font-medium text-navy">{item.q}</dt>
                <dd className="mt-2 text-muted leading-relaxed">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  );
}
