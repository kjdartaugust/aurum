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

- **`data/products.ts` is the single source of truth.** The `Product` type
  carries `category` (`refined` | `unrefined`), `price` (a `number`, or `null`
  for quote-only items), and `buyable`. UI behavior keys off these: `buyable`
  decides "Add to vault" vs "Request a quote", and `price == null` items are
  excluded from cart totals and checkout. There is no database — add products by
  editing this array.

- **Cart is client-side global state** via `context/CartContext.tsx`
  (`useReducer` + React context, wrapped around the app in `app/layout.tsx`).
  It persists to `localStorage` under `aurum.cart.v1`, and guards against
  overwriting persisted data before hydration completes. `useCart()` exposes
  items, derived `count`/`subtotal` (computed by looking each item back up in
  `products`), and drawer open/close. Components touching the cart must be
  Client Components.

- **API routes are intentionally self-contained fallbacks** so the app runs with
  zero configuration:
  - `app/api/gold-price/route.ts` — returns a live price if `GOLD_API_KEY` is
    set (goldapi.io shape), otherwise a clock-derived **simulated** spot price.
    `GoldTicker` polls it every 30s.
  - `app/api/quote/route.ts` — emails the inquiry via Resend when `RESEND_API_KEY`
    is set, otherwise logs it. Includes a honeypot (`company` field) and a naive
    per-IP in-memory rate limit. The client also builds a `wa.me` deep link from
    `NEXT_PUBLIC_WHATSAPP_NUMBER`.
  - `app/api/checkout/route.ts` — **placeholder payment**. Re-prices the cart
    server-side from `products` (never trusts client prices) and returns a mock
    order ref. Bullion is high-risk; a precious-metals-friendly provider must be
    integrated before launch.

- **Routing:** `app/page.tsx` is the landing page composing the section
  components (`Hero`, `ProductCatalog` preview, `TrustSection`, `Testimonials`,
  `QuoteForm`). `/#trust` and `/#quote` are anchor links into those sections.
  `app/products` is the full catalog; `app/cart` is the checkout flow.
  `app/privacy`, `app/terms`, `app/compliance` are static legal pages sharing
  `components/LegalPage.tsx`. SEO is handled by metadata routes:
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
