import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo";
import { services } from "@/lib/content/services";

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${absoluteUrl("/")}#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    image: absoluteUrl("/og/default.jpg"),
    telephone: siteConfig.phone || undefined,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry,
    },
    areaServed: siteConfig.serviceArea.map((name) => ({
      "@type": "City",
      name,
    })),
    priceRange: "$$",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cleaning services",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.name,
          url: absoluteUrl(`/services/${s.slug}`),
        },
      })),
    },
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function serviceJsonLd(args: {
  name: string;
  description: string;
  url: string;
  image: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    url: args.url,
    image: args.image,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    areaServed: {
      "@type": "City",
      name: "Windermere",
      containedInPlace: {
        "@type": "State",
        name: "Florida",
      },
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(args: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.headline,
    description: args.description,
    image: args.image ?? absoluteUrl("/og/default.jpg"),
    datePublished: args.datePublished,
    dateModified: args.dateModified,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/og/default.jpg"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": args.url,
    },
    about: [
      {
        "@type": "Service",
        name: "Move Out / Move In Cleaning",
        url: absoluteUrl("/services/move-out-move-in-cleaning"),
      },
      {
        "@type": "City",
        name: "Windermere",
        containedInPlace: { "@type": "State", name: "Florida" },
      },
      {
        "@type": "Place",
        name: "Dr. Phillips",
      },
    ],
  };
}

export function howToJsonLd(args: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: args.name,
    description: args.description,
    step: args.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
