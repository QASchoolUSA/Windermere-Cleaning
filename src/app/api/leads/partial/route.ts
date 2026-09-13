import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const bookingBroomUrl = (
    process.env.BOOKING_BROOM_URL || "https://app.bookingbroom.com"
  ).replace(/\/$/, "");
  const apiKey = process.env.BOOKING_BROOM_API_KEY;
  const siteSlug = "windermere";

  let form: Record<string, unknown>;
  try {
    form = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const sessionKey =
    typeof form.session_key === "string" && form.session_key.trim()
      ? form.session_key.trim()
      : "";
  if (!sessionKey) {
    return NextResponse.json(
      { error: "session_key is required" },
      { status: 400 },
    );
  }

  const email = typeof form.email === "string" ? form.email : undefined;
  const phone = typeof form.phone === "string" ? form.phone : undefined;
  const hasEmail =
    !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const hasPhone = !!phone && phone.replace(/\D/g, "").length >= 10;
  if (!hasEmail && !hasPhone) {
    return NextResponse.json(
      { error: "A valid email or phone is required" },
      { status: 400 },
    );
  }

  if (!bookingBroomUrl || !apiKey) {
    // Soft-leads are best-effort; don't fail the page if BB isn't configured.
    return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
  }

  const wirePayload = {
    site_slug: siteSlug,
    api_key: apiKey,
    session_key: sessionKey,
    customer_name:
      typeof form.customer_name === "string" ? form.customer_name : undefined,
    email,
    phone,
    address: typeof form.address === "string" ? form.address : undefined,
    service_type:
      typeof form.service_type === "string" ? form.service_type : undefined,
    preferred_date:
      typeof form.preferred_date === "string" ? form.preferred_date : undefined,
    preferred_time:
      typeof form.preferred_time === "string" ? form.preferred_time : undefined,
    notes: typeof form.notes === "string" ? form.notes : undefined,
    intent:
      form.intent === "quote" || form.intent === "book"
        ? form.intent
        : undefined,
    property: form.property,
    quote: form.quote,
    attribution: form.attribution,
    last_step:
      typeof form.last_step === "string"
        ? form.last_step
        : form.last_step != null
          ? String(form.last_step)
          : undefined,
  };

  try {
    const res = await fetch(`${bookingBroomUrl}/api/leads/partial`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wirePayload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: typeof data.error === "string" ? data.error : "Lead save failed" },
        { status: res.status >= 400 && res.status < 600 ? res.status : 502 },
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ ok: true, skipped: true }, { status: 200 });
  }
}
