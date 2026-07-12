"use client";

import { useState } from "react";
import type { QuoteInputs } from "@/lib/pricing";
import { formatUsdFromCents } from "@/lib/pricing";
import { services } from "@/lib/content/services";
import {
  readAttribution,
  trackBookingConversion,
} from "@/components/analytics/Analytics";

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
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState<string>();
  const serviceName =
    services.find((s) => s.slug === quote.service)?.name ?? "Cleaning";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      quote,
      estimateCents,
      customer: {
        name: String(form.get("name") || ""),
        email: String(form.get("email") || ""),
        phone: String(form.get("phone") || ""),
      },
      schedule: {
        preferredDate: String(form.get("preferredDate") || ""),
        timeWindow: String(form.get("timeWindow") || "flexible"),
      },
      address: {
        line1: String(form.get("line1") || ""),
        line2: String(form.get("line2") || "") || undefined,
        city: String(form.get("city") || "Windermere"),
        state: "FL",
        zip: String(form.get("zip") || ""),
      },
      notes: String(form.get("notes") || "") || undefined,
      attribution: readAttribution(),
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
          <input className="field" name="name" required autoComplete="name" />
        </label>
        <label>
          <span className="field-label">Email</span>
          <input
            className="field"
            name="email"
            type="email"
            required
            autoComplete="email"
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
          />
        </label>
        <label>
          <span className="field-label">Preferred date</span>
          <input className="field" name="preferredDate" type="date" required />
        </label>
        <label>
          <span className="field-label">Time window</span>
          <select className="field" name="timeWindow" defaultValue="flexible">
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
          />
        </label>
        <label>
          <span className="field-label">Apt / suite (optional)</span>
          <input className="field" name="line2" autoComplete="address-line2" />
        </label>
        <label>
          <span className="field-label">City</span>
          <input
            className="field"
            name="city"
            defaultValue="Windermere"
            required
            autoComplete="address-level2"
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
          />
        </label>
        <label className="md:col-span-2">
          <span className="field-label">Notes (optional)</span>
          <textarea className="field min-h-[100px]" name="notes" />
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
