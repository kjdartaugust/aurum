const TESTIMONIALS = [
  {
    quote:
      "The assay documentation and serialized bars gave my family office complete confidence. Settlement and insured delivery were flawless.",
    name: "M. Adjei",
    role: "Private Wealth Manager",
  },
  {
    quote:
      "I needed bulk doré on a tight timeline. The escrow process and live-spot pricing were transparent end to end. A genuinely professional house.",
    name: "L. Okonkwo",
    role: "Refinery Procurement Lead",
  },
  {
    quote:
      "My first time buying physical gold. The team walked me through purity, storage and delivery — never pushy, always precise.",
    name: "S. Mensah",
    role: "First-time investor",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            Trusted by buyers worldwide
          </p>
          <h2 className="mt-3 font-serif text-4xl text-zinc-50 sm:text-5xl">
            What our clients say
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card flex flex-col p-7">
              <div className="text-gold-light" aria-hidden>
                ★★★★★
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-zinc-300">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-white/5 pt-4">
                <p className="font-medium text-zinc-100">{t.name}</p>
                <p className="text-xs text-zinc-500">{t.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
