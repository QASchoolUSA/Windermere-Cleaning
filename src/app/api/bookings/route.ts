import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations";
import { createBooking } from "@/lib/booking-broom";
import { calculateQuoteCents } from "@/lib/pricing";
import type { QuoteInputs } from "@/lib/pricing";

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
    const recomputed = calculateQuoteCents(data.quote as QuoteInputs);
    // Allow small client drift but reject tampering
    if (Math.abs(recomputed - data.estimateCents) > 100) {
      return NextResponse.json(
        { ok: false, message: "Quote changed. Please recalculate." },
        { status: 400 },
      );
    }

    const result = await createBooking({
      ...data,
      estimateCents: recomputed,
    });

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
    });
  } catch (error) {
    console.error("[api/bookings]", error);
    return NextResponse.json(
      { ok: false, message: "Unexpected server error" },
      { status: 500 },
    );
  }
}
