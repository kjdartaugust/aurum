const PILLARS = [
  {
    icon: "✦",
    title: "Certified purity",
    body: "Every refined product ships with an independent assay certificate and a serial number you can verify. 99.99% fine on investment bars.",
  },
  {
    icon: "⛨",
    title: "Insured & escrow-backed",
    body: "Standard orders travel via fully insured armored courier. Bulk and unrefined deals settle through third-party escrow after assay.",
  },
  {
    icon: "❖",
    title: "Responsibly sourced",
    body: "Our unrefined gold comes through vetted, conflict-free channels with documented chain-of-custody and KYC on large transactions.",
  },
  {
    icon: "◈",
    title: "Licensed & compliant",
    body: "Aurum operates as a licensed precious-metals dealer, adhering to AML/KYC standards and full export documentation.",
  },
];

const BADGES = [
  "LBMA Good Delivery",
  "ISO 9001 Assay",
  "AML / KYC Compliant",
  "Conflict-Free Sourcing",
  "Fully Insured Logistics",
];

export default function TrustSection() {
  return (
    <section id="trust" className="border-y border-white/5 bg-black/30 py-24">
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            Why Aurum
          </p>
          <h2 className="mt-3 font-serif text-4xl text-zinc-50 sm:text-5xl">
            Trust, made tangible
          </h2>
          <p className="mt-4 text-zinc-400">
            Gold is only as good as the house that stands behind it. We build
            certainty into every transaction.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <div key={p.title} className="card p-7">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-2xl text-gold-light">
                {p.icon}
              </div>
              <h3 className="mt-5 font-serif text-xl text-zinc-100">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {p.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="hairline mb-8" />
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {BADGES.map((badge) => (
              <span
                key={badge}
                className="text-sm uppercase tracking-[0.18em] text-zinc-500"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
