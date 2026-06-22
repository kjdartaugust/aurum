# Aurum — Premium Gold Bullion Storefront

A luxury bullion-dealer storefront: certified refined gold bars & coins for
direct purchase, and responsibly sourced unrefined gold (doré, nuggets, dust)
available by quote. Built with Next.js (App Router) + Tailwind, deploy-ready
for Vercel.

## Features

- **Hero** with a live gold spot-price ticker and primary CTAs.
- **Catalog** of Refined (bars/coins) and Unrefined (raw) gold with category &
  weight filters; each card shows purity (e.g. 24K / 99.99%), certification and
  price.
- **Direct purchase** — fixed-price items go into a persistent cart and through
  a placeholder secure checkout.
- **Request a Quote** form for bulk/unrefined orders, with a WhatsApp deep link
  and email fallback (note: KYC required on large transactions).
- **Trust layer** — certifications, purity guarantees, escrow/insurance info,
  testimonials and licensing badges.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — sensible fallbacks work without it
npm run dev                  # http://localhost:3000
```

## Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server                 |
| `npm run build` | Production build                     |
| `npm start`     | Serve the production build           |
| `npm run lint`  | Run ESLint (next/core-web-vitals)    |

## Environment

All variables are optional — the app ships with working fallbacks. See
`.env.example`. Notably:

- `NEXT_PUBLIC_SITE_URL` — canonical URL for metadata, OG tags & sitemap.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_INQUIRY_EMAIL` — quote routing.
- `RESEND_API_KEY` (+ `RESEND_FROM`) — emails quote requests via Resend; without
  it requests are logged and the WhatsApp link still works.
- `GOLD_API_KEY` — live spot feed; without it the ticker shows a realistic
  simulated price.
- Payments are a **placeholder** (`app/api/checkout`). Bullion is high-risk;
  integrate a precious-metals-friendly provider before launch.

## Deploy

Push to a Git repo and import into Vercel. Set any env vars in the Vercel
dashboard. No build configuration is required.
