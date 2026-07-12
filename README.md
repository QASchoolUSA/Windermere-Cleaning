# Windermere Cleaning

Luxury residential cleaning website for **Windermere Cleaning** (Windermere, FL).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Framer Motion
- Zod validation
- Booking Broom HTTP integration (`bookings.kedrik.com`)

## Develop

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Booking Broom

Set in `.env.local`:

- `BOOKING_BROOM_MODE=mock` — logs payloads locally (default)
- `BOOKING_BROOM_MODE=live` — POST to Booking Broom
- `BOOKING_BROOM_BASE_URL`, `BOOKING_BROOM_BOOKINGS_PATH`, `BOOKING_BROOM_API_KEY`

## SEM / Analytics

Optional:

- `NEXT_PUBLIC_GTAG_ID`
- `NEXT_PUBLIC_ADS_CONVERSION_LABEL`

## Scripts

- `npm run dev` — development
- `npm run build` — production build
- `npm run start` — start production server
