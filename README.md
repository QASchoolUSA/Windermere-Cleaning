# Windermere Cleaning

Luxury residential cleaning website for **Windermere Cleaning** (Windermere, FL).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Framer Motion
- Zod validation
- Booking Broom HTTP integration (`app.bookingbroom.com`)

## Develop

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Booking Broom

Set in `.env.local` (see `.env.example`):

- `BOOKING_BROOM_MODE=mock` — logs the Booking Broom payload locally (default)
- `BOOKING_BROOM_MODE=live` — POST to Booking Broom
- `# BOOKING_BROOM_URL optional; defaults to https://app.bookingbroom.com`
- `BOOKING_BROOM_API_KEY=bb_windermere_dev_key` (or your production key)
- Site slug hardcoded to `windermere` (no `BOOKING_BROOM_SITE_SLUG` env)

The server maps the quote form into Booking Broom’s public API shape (`site_slug`, `api_key`, `customer_name`, etc.).

## SEM / Analytics

Optional:

- `NEXT_PUBLIC_GTAG_ID`
- `NEXT_PUBLIC_ADS_CONVERSION_LABEL`

## Scripts

- `pnpm dev` — development
- `pnpm build` — production build
- `pnpm start` — start production server
