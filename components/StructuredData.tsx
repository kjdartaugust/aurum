import { SITE_URL } from "@/lib/site";
import { business } from "@/data/business";

/**
 * Organization + WebSite JSON-LD for richer search results. Uses central
 * business details, so it stays correct as the client fills in data/business.ts.
 */
export default function StructuredData() {
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: business.legalName,
      alternateName: business.tradingName,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.svg`,
      email: business.email,
      telephone: business.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: business.address.line1,
        addressLocality: business.address.city,
        addressRegion: business.address.region,
        postalCode: business.address.postalCode,
        addressCountry: business.address.country,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: business.tradingName,
      url: SITE_URL,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
