# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Aurum is a premium gold-bullion dealer storefront built with **Next.js 14 (App
Router) + TypeScript + Tailwind**, deploy-ready for Vercel. It sells two product
classes: standardized **refined** items (bars/coins) that are bought directly,
and **unrefined** gold (doré/nuggets/dust) that is quote-only.

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build (also type-checks + lints)
npm start        # serve the production build
npm run lint     # ESLint (next/core-web-vitals)
```

There is no test runner configured. `npm run build` is the primary correctness
gate — it type-checks the whole project and fails on any TS error.

If `npm install` hits TLS/cert errors on this machine, prefix with
`NODE_OPTIONS=--use-system-ca`.

## Architecture

- **Product catalog: content in `data/products.json`, types in
  `data/products.ts`.** The JSON holds the records (the client edits it without
  touching code); `products.ts` is a typed loader exporting `products` /
  `getProduct`. The `Product` type carries `category` (`refined` | `unrefined`),
  `price` (a `number`, or `null` for quote-only items), and `buyable`. UI keys
  off these: `buyable` decides "Add to vault" vs "Request a quote", and
  `price == null` items are excluded from cart totals and checkout.

- **`data/business.ts` is the central business profile** (legal name, address,
  license, contact, WhatsApp) — full of `// TODO` placeholders the client fills
  in. It feeds the footer, `BusinessInfo`, `StructuredData` (JSON-LD), and email
  layouts, so updating it propagates everywhere.

- **Cart is client-side global state** via `context/CartContext.tsx`
  (`useReducer` + React context, wrapped around the app in `app/layout.tsx`).
  It persists to `localStorage` under `aurum.cart.v1`, and guards against
  overwriting persisted data before hydration completes. `useCart()` exposes
  items, derived `count`/`subtotal` (computed by looking each item back up in
  `products`), and drawer open/close. Components touching the cart must be
  Client Components.

- **API routes are intentionally self-contained fallbacks** so the app runs with
  zero configuration:
  - `app/api/gold-price/route.ts` — live spot price. Tries `GOLD_API_KEY`
    (goldapi.io) → free keyless **gold-api.com** → clock-derived **simulated**
    fallback. Tracks an intraday open in memory to compute change%. `GoldTicker`
    polls every 30s (green dot = live, amber = simulated).
  - `app/api/quote/route.ts` — emails the inquiry via `lib/email.ts` (Resend),
    else logs it. Honeypot (`company` field) + `lib/rate-limit.ts`. The client
    also builds a `wa.me` deep link.
  - `app/api/checkout/route.ts` — re-prices the cart **server-side** from
    `products` (never trusts client prices), validates customer/delivery, then
    calls `createPayment()` from **`lib/payments.ts`** (pluggable provider).
    `mock` (default) confirms instantly and emails receipt + internal
    notification; hosted providers (`paystack`/`coinbase`/`stripe`) return a
    `redirectUrl`, and payment is confirmed via `app/api/payments/webhook`
    (real HMAC signature verification per provider) which calls `fulfilOrder`.
    Rate-limited.

- **Orders & receipts: `lib/orders.ts`.** `saveOrder` (called at checkout),
  `fulfilOrder` (idempotent via a one-time claim; called by the webhook — marks
  paid + emails receipt), and `sendOrderEmails`. Backed by **Vercel KV** when
  `KV_REST_API_URL`/`KV_REST_API_TOKEN` are set (see `lib/kv.ts`, a dependency-free
  REST client), else an in-memory Map for dev. The cart page handles the
  `?status=success&ref=` redirect-back from hosted providers.

- **Payments are abstracted in `lib/payments.ts`.** Switch providers with the
  `PAYMENT_PROVIDER` env var; the checkout route and UI don't change. Bullion is
  high-risk — `mock` charges nothing; `coinbase` is a working crypto reference.
- **Emails go through `lib/email.ts`** (`sendEmail` + `emailLayout`), which
  no-ops gracefully without `RESEND_API_KEY`. Error pages: `app/not-found.tsx`,
  `app/error.tsx`, `app/global-error.tsx`. Analytics: `components/Analytics.tsx`
  (cookieless Plausible, loads only if `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set).

- **Routing:** `app/page.tsx` is the landing page composing the section
  components (`Hero`, `ProductCatalog` preview, `TrustSection`, `Testimonials`,
  `QuoteForm`). `/#trust` and `/#quote` are anchor links into those sections.
  `app/products` is the full catalog; `app/cart` is the checkout flow.
  `app/privacy`, `app/terms`, `app/refund`, `app/compliance` are static legal
  pages sharing `components/LegalPage.tsx`. SEO is handled by metadata routes:
  `app/robots.ts`, `app/sitemap.ts`, `app/icon.svg`, and `app/opengraph-image.tsx`
  (a dynamic `next/og` image — **must** stay on the edge runtime; the Node
  runtime crashes on font loading, and every multi-child `<div>` in it needs an
  explicit `display`). `lib/site.ts` resolves the canonical URL from
  `NEXT_PUBLIC_SITE_URL`.

- **`components/ProductCatalog.tsx`** is reused on both the landing preview and
  the catalog page via props (`showFilters`, `initialCategory`, `heading`). It
  owns the category + weight filter state.

## Design system

Tailwind config (`tailwind.config.ts`) defines the brand: `charcoal` (near-black
base) and `gold` palettes, `font-serif` (Playfair Display) for headlines vs
`font-sans` (Inter) for body — both loaded via `next/font` in the layout.
Reusable primitives live in `app/globals.css` as `@layer components`: `.btn-gold`,
`.btn-outline`, `.card`, `.container-px`, `.hairline`, `.shimmer-text`. Prefer
these classes over re-deriving the styling inline.

## Conventions

- Use the `@/*` path alias (maps to repo root) for imports.
- Default to Server Components; add `"use client"` only when a component needs
  state, effects, or the cart context.
- Remote images come from `images.unsplash.com` (allow-listed in
  `next.config.mjs`); add new hosts there before using them. Render remote
  product/hero images through `components/SafeImage.tsx`, not `next/image`
  directly — it falls back to `/placeholder-gold.svg` if the source 404s.
- Money is formatted through `lib/format.ts` (`formatUSD`), not ad-hoc.
