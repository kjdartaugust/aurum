import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCatalog from "@/components/ProductCatalog";
import CertificationsSection from "@/components/CertificationsSection";
import TrustSection from "@/components/TrustSection";
import Testimonials from "@/components/Testimonials";
import BusinessInfo from "@/components/BusinessInfo";
import QuoteForm from "@/components/QuoteForm";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Featured catalog preview */}
      <section className="py-24">
        <div className="container-px">
          <ProductCatalog
            heading={
              <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="max-w-xl">
                  <p className="text-xs uppercase tracking-[0.25em] text-gold">
                    The collection
                  </p>
                  <h2 className="mt-3 font-serif text-4xl text-zinc-50 sm:text-5xl">
                    Refined & unrefined gold
                  </h2>
                  <p className="mt-4 text-zinc-400">
                    From single-ounce bars to bulk doré — every product assayed,
                    serialized, and backed by a purity guarantee.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="btn-outline shrink-0"
                >
                  View full catalog →
                </Link>
              </div>
            }
          />
        </div>
      </section>

      <CertificationsSection />
      <TrustSection />
      <Testimonials />
      <BusinessInfo />
      <QuoteForm />
    </>
  );
}
