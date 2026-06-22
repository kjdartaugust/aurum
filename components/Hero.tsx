import Link from "next/link";
import GoldTicker from "./GoldTicker";
import SafeImage from "./SafeImage";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <SafeImage
          src="/hero-gold.svg"
          alt="Stacked investment-grade gold bars"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/30" />
      </div>

      <div className="container-px relative grid min-h-[88vh] items-center pb-16 pt-12">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-gold-light">
            Licensed bullion house · Est. trust
          </span>

          <h1 className="mt-6 font-serif text-5xl leading-[1.05] text-zinc-50 sm:text-6xl lg:text-7xl">
            Own gold that{" "}
            <span className="shimmer-text">holds its worth</span>.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-300">
            Aurum deals in certified refined bars and coins, and ethically
            sourced unrefined gold. Every gram is assayed, serialized, and
            delivered fully insured — so your wealth is never a question of
            trust.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href="/products" className="btn-gold">
              Shop bullion
            </Link>
            <Link href="/#quote" className="btn-outline">
              Request a quote
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
            <GoldTicker />
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-zinc-400">
              <li>✓ 99.99% certified purity</li>
              <li>✓ LBMA-grade refining</li>
              <li>✓ Escrow on bulk orders</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
