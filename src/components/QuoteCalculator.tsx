"use client";

import { useMemo, useState, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { services, type ServiceSlug } from "@/lib/content/services";
import {
  ADDON_OPTIONS,
  SQFT_OPTIONS,
  calculateQuoteCents,
  formatUsdFromCents,
  frequencyAllowed,
  type AddonId,
  type Frequency,
  type PropertyType,
  type QuoteInputs,
  type SqftBand,
} from "@/lib/pricing";
import { BookingForm } from "./BookingForm";

const STEPS = ["Service", "Property", "Details", "Quote"] as const;

export function QuoteCalculator({
  initialService,
}: {
  initialService?: string;
}) {
  const reduce = useReducedMotion();
  const defaultService =
    (services.find((s) => s.slug === initialService)?.slug as ServiceSlug) ||
    "house-cleaning";

  const [step, setStep] = useState(0);
  const [showBooking, setShowBooking] = useState(false);
  const [inputs, setInputs] = useState<QuoteInputs>({
    service: defaultService,
    propertyType: "house",
    bedrooms: 3,
    bathrooms: 2,
    sqftBand: "1500-2500",
    frequency: "one-time",
    addons: [],
  });

  useEffect(() => {
    if (initialService && services.some((s) => s.slug === initialService)) {
      setInputs((prev) => ({
        ...prev,
        service: initialService as ServiceSlug,
        frequency: frequencyAllowed(initialService as ServiceSlug)
          ? prev.frequency
          : "one-time",
      }));
    }
  }, [initialService]);

  const estimateCents = useMemo(() => calculateQuoteCents(inputs), [inputs]);
  const serviceName =
    services.find((s) => s.slug === inputs.service)?.name ?? "Cleaning";

  const toggleAddon = (id: AddonId) => {
    setInputs((prev) => ({
      ...prev,
      addons: prev.addons.includes(id)
        ? prev.addons.filter((a) => a !== id)
        : [...prev.addons, id],
    }));
  };

  const panel = (key: string, child: ReactNode) => (
    <motion.div
      key={key}
      initial={reduce ? false : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduce ? undefined : { opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {child}
    </motion.div>
  );

  if (showBooking) {
    return (
      <BookingForm
        quote={inputs}
        estimateCents={estimateCents}
        onBack={() => setShowBooking(false)}
      />
    );
  }

  return (
    <div className="atelier-panel p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--line)] pb-6">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-brass">
            Quote atelier
          </p>
          <h1 className="mt-2 font-display text-3xl text-navy md:text-4xl">
            Free cleaning quote
          </h1>
        </div>
        <ol className="flex flex-wrap gap-3 text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={i === step ? "text-navy" : i < step ? "text-brass" : ""}
            >
              {String(i + 1).padStart(2, "0")} {label}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 min-h-[280px]">
        <AnimatePresence mode="wait">
          {step === 0 &&
            panel(
              "service",
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => {
                  const active = inputs.service === s.slug;
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          service: s.slug,
                          frequency: frequencyAllowed(s.slug)
                            ? prev.frequency
                            : "one-time",
                        }))
                      }
                      className={`border px-4 py-4 text-left transition ${
                        active
                          ? "border-brass bg-white"
                          : "border-[color:var(--line)] bg-transparent hover:border-brass/50"
                      }`}
                    >
                      <span className="font-display text-xl text-navy">
                        {s.name}
                      </span>
                      <span className="mt-2 block text-sm text-muted">
                        {s.shortName}
                      </span>
                    </button>
                  );
                })}
              </div>,
            )}

          {step === 1 &&
            panel(
              "property",
              <div className="space-y-8">
                <div>
                  <p className="field-label">Property type</p>
                  <div className="grid grid-cols-3 gap-3">
                    {(
                      [
                        ["house", "House"],
                        ["apartment", "Apartment"],
                        ["townhome", "Townhome"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          setInputs((p) => ({
                            ...p,
                            propertyType: id as PropertyType,
                          }))
                        }
                        className={`border px-3 py-3 text-sm ${
                          inputs.propertyType === id
                            ? "border-brass bg-white text-navy"
                            : "border-[color:var(--line)] text-muted"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label>
                    <span className="field-label">Bedrooms</span>
                    <input
                      className="field"
                      type="number"
                      min={0}
                      max={12}
                      value={inputs.bedrooms}
                      onChange={(e) =>
                        setInputs((p) => ({
                          ...p,
                          bedrooms: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span className="field-label">Bathrooms</span>
                    <input
                      className="field"
                      type="number"
                      min={1}
                      max={12}
                      value={inputs.bathrooms}
                      onChange={(e) =>
                        setInputs((p) => ({
                          ...p,
                          bathrooms: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                </div>
                <div>
                  <p className="field-label">Approximate size</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SQFT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() =>
                          setInputs((p) => ({
                            ...p,
                            sqftBand: opt.id as SqftBand,
                          }))
                        }
                        className={`border px-4 py-3 text-left text-sm ${
                          inputs.sqftBand === opt.id
                            ? "border-brass bg-white text-navy"
                            : "border-[color:var(--line)] text-muted"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>,
            )}

          {step === 2 &&
            panel(
              "details",
              <div className="space-y-8">
                {frequencyAllowed(inputs.service) && (
                  <div>
                    <p className="field-label">Frequency</p>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {(
                        [
                          ["one-time", "One-time"],
                          ["weekly", "Weekly"],
                          ["bi-weekly", "Bi-weekly"],
                          ["monthly", "Monthly"],
                        ] as const
                      ).map(([id, label]) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() =>
                            setInputs((p) => ({
                              ...p,
                              frequency: id as Frequency,
                            }))
                          }
                          className={`border px-3 py-3 text-sm ${
                            inputs.frequency === id
                              ? "border-brass bg-white text-navy"
                              : "border-[color:var(--line)] text-muted"
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="field-label">Add-ons</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {ADDON_OPTIONS.map((opt) => {
                      const on = inputs.addons.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => toggleAddon(opt.id)}
                          className={`flex items-center justify-between border px-4 py-3 text-left text-sm ${
                            on
                              ? "border-brass bg-white text-navy"
                              : "border-[color:var(--line)] text-muted"
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className="text-brass">{opt.priceLabel}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>,
            )}

          {step === 3 &&
            panel(
              "quote",
              <div className="text-center md:text-left">
                <p className="text-[0.7rem] uppercase tracking-[0.16em] text-brass">
                  Estimated quote
                </p>
                <p className="mt-3 font-display text-5xl text-navy md:text-6xl">
                  {formatUsdFromCents(estimateCents)}
                </p>
                <p className="mt-3 text-muted">
                  {serviceName} ·{" "}
                  {inputs.propertyType.charAt(0).toUpperCase() +
                    inputs.propertyType.slice(1)}{" "}
                  · {inputs.bedrooms} bed / {inputs.bathrooms} bath
                </p>
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">
                  This is an estimated quote based on your selections. Final
                  pricing is confirmed when we accept your booking request.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setShowBooking(true)}
                  >
                    Book this cleaning
                  </button>
                  <button
                    type="button"
                    className="btn-primary !bg-transparent !text-navy border border-[color:var(--line)]"
                    onClick={() => setStep(0)}
                  >
                    Adjust details
                  </button>
                </div>
              </div>,
            )}
        </AnimatePresence>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-[color:var(--line)] pt-6">
        <button
          type="button"
          className="text-[0.72rem] uppercase tracking-[0.14em] text-muted disabled:opacity-30"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </button>
        {step < 3 ? (
          <button
            type="button"
            className="btn-primary"
            onClick={() => setStep((s) => Math.min(3, s + 1))}
          >
            Continue
          </button>
        ) : (
          <span className="text-[0.7rem] uppercase tracking-[0.12em] text-brass">
            Ready to book
          </span>
        )}
      </div>
    </div>
  );
}
