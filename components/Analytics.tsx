import Script from "next/script";

/**
 * Privacy-friendly analytics via Plausible (https://plausible.io) — cookieless,
 * no personal data, GDPR/CCPA-friendly and lightweight, so it needs no consent
 * banner gating. Only loads when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set.
 *
 * TODO (client): set NEXT_PUBLIC_PLAUSIBLE_DOMAIN to your site domain to enable
 * analytics. Alternatives if you prefer: Vercel Web Analytics (@vercel/analytics)
 * or Fathom. Leave the env var empty to disable analytics entirely.
 */
export default function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
