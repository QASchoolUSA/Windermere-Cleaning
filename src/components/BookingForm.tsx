"use client";

import { useEffect, useRef, useState } from "react";
import type { QuoteInputs } from "@/lib/pricing";
import { formatUsdFromCents } from "@/lib/pricing";
import { services } from "@/lib/content/services";
import {
  readAttribution,
  trackBookingConversion,
} from "@/components/analytics/Analytics";
import { createSoftLeadTracker } from "@/lib/soft-lead";

type Status = "idle" | "submitting" | "success" | "error";

export function BookingForm({
  quote,
  estimateCents,
  onBack,
}: {
  quote: QuoteInputs;
  estimateCents: number;
  onBack: () => void;
}) {
  const softLead = useRef<ReturnType<typeof createSoftLeadTracker> | null>(null);
  if (!softLead.current) {
    softLead.current = createSoftLeadTracker();
  }

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState<string>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [timeWindow, setTimeWindow] = useState("flexible");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("Windermere");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");

  const serviceName =
    services.find((s) => s.slug === quote.service)?.name ?? "Cleaning";

  useEffect(() => {
    const tracker = softLead.current;
    return () => tracker?.dispose();
  }, []);

  useEffect(() => {
    if (status === "success") return;
    const address = [line1, line2, city, zip].filter(Boolean).join(", ");
    const attribution = readAttribution();
    softLead.current?.schedule({
      customer_name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      address: address || undefined,
      service_type: serviceName,
      preferred_date: preferredDate || undefined,
      preferred_time: timeWindow || undefined,
      notes: notes || undefined,
      intent: "book",
      last_step: "contact",
      attribution: Object.keys(attribution).length ? attribution : undefined,
      property: {
        bedrooms: quote.bedrooms,
        bathrooms: quote.bathrooms,
        home_type: quote.propertyType,
        size_label: quote.sqftBand,
      },
      quote: {
        estimate: estimateCents / 100,
        currency: "USD",
        frequency: quote.frequency,
        payment_terms: "Due after cleaning is complete",
      },
    });
  }, [
    status,
    name,
    email,
    phone,
    preferredDate,
    timeWindow,
    line1,
    line2,
    city,
    zip,
    notes,
    serviceName,
    quote,
    estimateCents,
  ]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const payload = {
      quote,
      estimateCents,
      customer: {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
      schedule: {
        preferredDate,
        timeWindow,
      },
      address: {
        line1: line1.trim(),
        line2: line2.trim() || undefined,
        city: city.trim() || "Windermere",
        state: "FL",
        zip: zip.trim(),
      },
      notes: notes.trim() || undefined,
      attribution: readAttribution(),
      session_key: softLead.current?.sessionKey,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        id?: string;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Booking failed");
      }
      setBookingId(data.id);
      setStatus("success");
      trackBookingConversion(data.id);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="atelier-panel p-8 text-center md:p-12">
        <p className="text-[0.7rem] uppercase tracking-[0.16em] text-brass">
          Request received
        </p>
        <h2 className="mt-3 font-display text-4xl text-navy">
          We’ll confirm shortly
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted">
          Your {serviceName.toLowerCase()} request for{" "}
          {formatUsdFromCents(estimateCents)} (estimate) is in our booking
          system.
          {bookingId ? ` Reference: ${bookingId}.` : ""}
        </p>
      </div>
    );
  }

  return (
    <div className="atelier-panel p-6 md:p-10">
      <button
        type="button"
        onClick={onBack}
        className="text-[0.72rem] uppercase tracking-[0.14em] text-muted"
      >
        ← Back to quote
      </button>
      <h2 className="mt-4 font-display text-3xl text-navy md:text-4xl">
        Book your cleaning
      </h2>
      <p className="mt-2 text-muted">
        {serviceName} · estimated {formatUsdFromCents(estimateCents)}
      </p>

      <form onSubmit={onSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
        <label className="md:col-span-1">
          <span className="field-label">Full name</span>
          <input
            className="field"
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </label>
        <label>
          <span className="field-label">Email</span>
          <input
            className="field"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          />
        </label>
        <label>
          <span className="field-label">Phone</span>
          <input
            className="field"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.currentTarget.value)}
          />
        </label>
        <label>
          <span className="field-label">Preferred date</span>
          <input
            className="field"
            name="preferredDate"
            type="date"
            required
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.currentTarget.value)}
          />
        </label>
        <label>
          <span className="field-label">Time window</span>
          <select
            className="field"
            name="timeWindow"
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.currentTarget.value)}
          >
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="flexible">Flexible</option>
          </select>
        </label>
        <label className="md:col-span-2">
          <span className="field-label">Street address</span>
          <input
            className="field"
            name="line1"
            required
            autoComplete="address-line1"
            value={line1}
            onChange={(e) => setLine1(e.currentTarget.value)}
          />
        </label>
        <label>
          <span className="field-label">Apt / suite (optional)</span>
          <input
            className="field"
            name="line2"
            autoComplete="address-line2"
            value={line2}
            onChange={(e) => setLine2(e.currentTarget.value)}
          />
        </label>
        <label>
          <span className="field-label">City</span>
          <input
            className="field"
            name="city"
            required
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.currentTarget.value)}
          />
        </label>
        <label>
          <span className="field-label">ZIP</span>
          <input
            className="field"
            name="zip"
            required
            pattern="\d{5}(-\d{4})?"
            autoComplete="postal-code"
            placeholder="34786"
            value={zip}
            onChange={(e) => setZip(e.currentTarget.value)}
          />
        </label>
        <label className="md:col-span-2">
          <span className="field-label">Notes (optional)</span>
          <textarea
            className="field min-h-[100px]"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
          />
        </label>

        {status === "error" && (
          <p className="md:col-span-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            className="btn-primary"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Submit booking request"}
          </button>
        </div>
      </form>
    </div>
  );
}
