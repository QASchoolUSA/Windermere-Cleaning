import { Hero } from "@/components/Hero";
import { ServicesPreview } from "@/components/ServicesPreview";
import { WhyUs } from "@/components/WhyUs";
import { ServiceAreaTeaser } from "@/components/ServiceAreaTeaser";
import { Faq } from "@/components/Faq";
import { QuoteCta } from "@/components/QuoteCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeFaqs } from "@/lib/content/services";
import { faqJsonLd } from "@/lib/jsonld";

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />
      <Hero />
      <ServicesPreview />
      <WhyUs />
      <ServiceAreaTeaser />
      <Faq items={homeFaqs} />
      <QuoteCta />
    </>
  );
}
