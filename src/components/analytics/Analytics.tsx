"use client";

import Script from "next/script";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function Analytics() {
  const gtagId = process.env.NEXT_PUBLIC_GTAG_ID;
  if (!gtagId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtagId}');
        `}
      </Script>
    </>
  );
}

export function trackBookingConversion(bookingId?: string) {
  const gtagId = process.env.NEXT_PUBLIC_GTAG_ID;
  const label = process.env.NEXT_PUBLIC_ADS_CONVERSION_LABEL;
  if (!gtagId || typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "generate_lead", {
    event_category: "booking",
    event_label: bookingId || "booking_submit",
  });

  if (label) {
    window.gtag("event", "conversion", {
      send_to: `${gtagId}/${label}`,
    });
  }
}

export function readAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
  ] as const;
  const out: Record<string, string> = {};
  for (const key of keys) {
    const val = params.get(key);
    if (val) out[key] = val;
  }

  try {
    const stored = sessionStorage.getItem("wc_attribution");
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, string>;
      return { ...parsed, ...out };
    }
    if (Object.keys(out).length) {
      sessionStorage.setItem("wc_attribution", JSON.stringify(out));
    }
  } catch {
    /* ignore */
  }
  return out;
}
