import Image from "next/image";
import type { Metadata } from "next";
import { QuoteCalculator } from "@/components/QuoteCalculator";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
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

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative bg-ivory pt-28 pb-20">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/book-atelier.jpg"
          alt="Calm luxury interior setting for the Windermere Cleaning quote atelier"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ivory via-ivory/90 to-ivory" />
      </div>
      <div className="container-site max-w-3xl">
        <QuoteCalculator initialService={params.service} />
      </div>
    </div>
  );
}
