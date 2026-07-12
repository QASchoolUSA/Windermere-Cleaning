import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  getServiceBySlug,
  services,
} from "@/lib/content/services";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/jsonld";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return createPageMetadata({
    title: `${service.name} in Windermere, FL`,
    description: service.summary,
    path: `/services/${service.slug}`,
    image: service.image,
    keywords: service.keywords,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: service.name,
          description: service.description,
          url: absoluteUrl(`/services/${service.slug}`),
          image: absoluteUrl(service.image),
        })}
      />
      <JsonLd data={faqJsonLd(service.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ])}
      />

      <article className="bg-ivory pt-28">
        <div className="relative h-[48vh] min-h-[320px] w-full">
          <Image
            src={service.image}
            alt={service.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 container-site pb-10">
            <p className="text-[0.7rem] uppercase tracking-[0.18em] text-brass">
              Service
            </p>
            <h1 className="mt-2 font-display text-4xl text-ivory md:text-6xl">
              {service.name}
            </h1>
          </div>
        </div>

        <div className="container-site section-pad grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="font-display text-3xl text-navy md:text-4xl">
              {service.headline}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {service.description}
            </p>
            <h3 className="mt-10 font-display text-2xl text-navy">
              What’s included
            </h3>
            <ul className="mt-4 space-y-3">
              {service.includes.map((item) => (
                <li key={item} className="flex gap-3 text-navy">
                  <span className="mt-2 h-px w-5 shrink-0 bg-brass" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="md:col-span-5">
            <div className="atelier-panel sticky top-28 p-8">
              <p className="text-[0.7rem] uppercase tracking-[0.16em] text-brass">
                Get started
              </p>
              <p className="mt-3 font-display text-3xl text-navy">
                Free quote for {service.shortName.toLowerCase()} cleaning
              </p>
              <p className="mt-3 text-sm text-muted">
                Estimate online in minutes, then book if you’re ready.
              </p>
              <Link
                href={`/book?service=${service.slug}`}
                className="btn-primary mt-6 inline-flex"
              >
                Get a free quote
              </Link>
            </div>
          </aside>
        </div>

        <Faq items={service.faqs} title={`${service.name} FAQs`} />
      </article>
    </>
  );
}
