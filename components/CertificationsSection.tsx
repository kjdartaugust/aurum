const PURITY_BADGES = [
  { value: "24K", label: "Karat purity", note: "Investment-grade fine gold" },
  { value: "99.99%", label: "Fineness", note: "Four-nines refined" },
  { value: "LBMA", label: "Good Delivery", note: "Internationally recognized" },
  { value: "ISO 9001", label: "Assay standard", note: "Independently verified" },
];

const SECURITY_BADGES = [
  { icon: "🔒", label: "SSL Secured", note: "256-bit encrypted connection" },
  { icon: "🛡️", label: "Secure Checkout", note: "PCI-conscious payment flow" },
  { icon: "📜", label: "Certificate of Assay", note: "Issued with every order" },
  { icon: "🚚", label: "Insured Delivery", note: "Fully insured, tracked" },
];

export default function CertificationsSection() {
  return (
    <section
      id="certifications"
      className="border-y border-white/5 bg-black/30 py-24"
    >
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            Certified & guaranteed
          </p>
          <h2 className="mt-3 font-serif text-4xl text-zinc-50 sm:text-5xl">
            Purity you can prove
          </h2>
          <p className="mt-4 text-zinc-400">
            Every refined product ships with an independent assay certificate
            and a unique serial number. What you buy is exactly what you hold —
            guaranteed.
          </p>
        </div>

        {/* Purity badges */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PURITY_BADGES.map((b) => (
            <div
              key={b.value}
              className="card flex flex-col items-center p-7 text-center"
            >
              <span className="font-serif text-4xl text-gold-gradient bg-gold-gradient bg-clip-text text-transparent">
                {b.value}
              </span>
              <span className="mt-3 text-sm font-medium text-zinc-100">
                {b.label}
              </span>
              <span className="mt-1 text-xs text-zinc-500">{b.note}</span>
            </div>
          ))}
        </div>

        {/* Assay certificate showcase */}
        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2">
          <div className="card relative overflow-hidden p-8">
            <div className="pointer-events-none absolute inset-0 bg-gold-radial" />
            {/* A stylized assay-certificate mock. Replace with a scan/photo of a
                real certificate when available. */}
            {/* TODO: swap this mock for an image of your actual assay certificate. */}
            <div className="relative rounded-xl border border-gold/30 bg-charcoal-100/60 p-6">
              <div className="flex items-center justify-between border-b border-gold/20 pb-4">
                <div>
                  <p className="font-serif text-lg text-gold-light">
                    Certificate of Assay
                  </p>
                  <p className="text-xs text-zinc-500">Aurum Bullion · Official</p>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-gradient font-serif text-xl font-bold text-charcoal">
                  A
                </span>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <CertRow k="Metal" v="Gold (Au)" />
                <CertRow k="Fineness" v="999.9 / 1000" />
                <CertRow k="Weight" v="1 troy oz (31.1035 g)" />
                <CertRow k="Serial" v="AU-0001-XXXX" />
                <CertRow k="Assayer" v="Independent · ISO 9001" />
              </dl>
              <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
                <span className="text-gold">◆</span> Verifiable against your order
                reference
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-2xl text-zinc-100">
              Our purity guarantee
            </h3>
            <p className="mt-3 text-zinc-400">
              We stand behind the stated purity of every item we sell. If an
              independent assay ever finds a refined Aurum product below its
              certified fineness, we will refund or replace it in full.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-zinc-300">
              <li className="flex gap-3">
                <span className="text-gold">◆</span> Serialized & matched to your
                order
              </li>
              <li className="flex gap-3">
                <span className="text-gold">◆</span> Tamper-evident sealing on bars
                & coins
              </li>
              <li className="flex gap-3">
                <span className="text-gold">◆</span> Independent assay available on
                request
              </li>
            </ul>
          </div>
        </div>

        {/* Security / trust badges */}
        <div className="mt-16">
          <div className="hairline mb-10" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SECURITY_BADGES.map((b) => (
              <div
                key={b.label}
                className="flex items-center gap-4 rounded-2xl border border-white/5 bg-charcoal-100/50 p-5"
              >
                <span className="text-2xl" aria-hidden>
                  {b.icon}
                </span>
                <span>
                  <span className="block text-sm font-medium text-zinc-100">
                    {b.label}
                  </span>
                  <span className="block text-xs text-zinc-500">{b.note}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CertRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-zinc-500">{k}</dt>
      <dd className="text-zinc-200">{v}</dd>
    </div>
  );
}
