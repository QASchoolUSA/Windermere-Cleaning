import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { createBooking } from "@/lib/booking-broom";
import { calculateQuoteCents } from "@/lib/pricing";
import type { QuoteInputs } from "@/lib/pricing";
import { getPricingConfig } from "@/lib/pricing-config";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bookingSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Please check your booking details.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    // The same config the calculator priced with, so a legitimate quote agrees.
    const pricing = await getPricingConfig();
    const recomputed = calculateQuoteCents(data.quote as QuoteInputs, pricing);
    // Allow small client drift but reject tampering
    if (Math.abs(recomputed - data.estimateCents) > 100) {
      return NextResponse.json(
        { ok: false, message: "Quote changed. Please recalculate." },
        { status: 400 },
      );
    }

    const result = await createBooking(
      {
        ...data,
        estimateCents: recomputed,
      },
      pricing,
    );

    if (!result.ok) {
      return NextResponse.json(
        { ok: false, message: result.message || "Booking failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      id: result.id,
      message: result.message,
      degraded: result.degraded === true,
      fallback: result.fallback,
    });
  } catch (error) {
    console.error("[api/bookings]", error);
    return NextResponse.json(
      { ok: false, message: "Unexpected server error" },
      { status: 500 },
    );
  }
}
