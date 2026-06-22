import type { Metadata } from "next";
import ProductCatalog from "@/components/ProductCatalog";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse Aurum's full range of certified refined gold bars and coins, plus responsibly sourced unrefined gold available by quote.",
};

export default function ProductsPage() {
  return (
    <>
      <section className="border-b border-white/5 bg-black/30 py-16">
        <div className="container-px">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            The Aurum collection
          </p>
          <h1 className="mt-3 font-serif text-5xl text-zinc-50 sm:text-6xl">
            Gold for every holding
          </h1>
          <p className="mt-4 max-w-2xl text-zinc-400">
            Standardized bars and coins ship at a fixed price and can be bought
            directly. Unrefined and bulk lots are priced against live spot —
            request a quote and a specialist will respond within a business day.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-px">
          <ProductCatalog />
        </div>
      </section>

      <QuoteForm />
    </>
  );
}
