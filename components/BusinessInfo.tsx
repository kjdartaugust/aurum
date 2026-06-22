import { business } from "@/data/business";

export default function BusinessInfo() {
  const a = business.address;
  return (
    <section id="business" className="py-24">
      <div className="container-px">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-gold">
            A registered, accountable business
          </p>
          <h2 className="mt-3 font-serif text-4xl text-zinc-50 sm:text-5xl">
            Who you&rsquo;re dealing with
          </h2>
          <p className="mt-4 text-zinc-400">
            Transparency is part of the guarantee. Here is exactly who we are
            and how to reach us.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
          {/* Company */}
          <div className="card p-7">
            <h3 className="font-serif text-xl text-zinc-100">Company</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <Row k="Registered name" v={business.legalName} />
              <Row k="Trading as" v={business.tradingName} />
              <Row k="Reg. number" v={business.registrationNumber} />
              <Row k="License" v={business.licenseNumber} />
              <Row k="Tax ID" v={business.taxId} />
            </dl>
          </div>

          {/* Registered office */}
          <div className="card p-7">
            <h3 className="font-serif text-xl text-zinc-100">
              Registered office
            </h3>
            <address className="mt-4 space-y-1 text-sm not-italic text-zinc-300">
              <p>{a.line1}</p>
              {a.line2 && <p>{a.line2}</p>}
              <p>
                {a.city}, {a.region}
              </p>
              <p>
                {a.postalCode}, {a.country}
              </p>
            </address>
            <p className="mt-4 text-xs text-zinc-500">{business.regulator}</p>
          </div>

          {/* Contact */}
          <div className="card p-7">
            <h3 className="font-serif text-xl text-zinc-100">Contact</h3>
            <dl className="mt-4 space-y-3 text-sm">
              <Row
                k="Email"
                v={
                  <a
                    href={`mailto:${business.email}`}
                    className="text-gold-light hover:underline"
                  >
                    {business.email}
                  </a>
                }
              />
              <Row
                k="Phone"
                v={
                  <a
                    href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}
                    className="text-gold-light hover:underline"
                  >
                    {business.phone}
                  </a>
                }
              />
              <Row
                k="WhatsApp"
                v={
                  <a
                    href={`https://wa.me/${business.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-light hover:underline"
                  >
                    Message us
                  </a>
                }
              />
              <Row k="Hours" v={business.hours} />
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-zinc-500">{k}</dt>
      <dd className="text-right text-zinc-200">{v}</dd>
    </div>
  );
}
