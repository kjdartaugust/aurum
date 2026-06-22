import Link from "next/link";
import Logo from "./Logo";
import { business } from "@/data/business";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40">
      <div className="container-px py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-zinc-400">
              A premium bullion house dealing in certified refined gold and
              responsibly sourced unrefined gold. Wealth you can hold.
            </p>
            <div className="mt-5 space-y-1 text-sm text-zinc-400">
              <p className="text-zinc-300">{business.legalName}</p>
              <p>
                {business.address.line1}, {business.address.city},{" "}
                {business.address.country}
              </p>
              <p>
                <a
                  href={`mailto:${business.email}`}
                  className="hover:text-gold-light"
                >
                  {business.email}
                </a>{" "}
                ·{" "}
                <a
                  href={`tel:${business.phone.replace(/[^+\d]/g, "")}`}
                  className="hover:text-gold-light"
                >
                  {business.phone}
                </a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Explore
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/products" className="hover:text-gold-light">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/#certifications" className="hover:text-gold-light">
                  Certifications
                </Link>
              </li>
              <li>
                <Link href="/#trust" className="hover:text-gold-light">
                  Why Aurum
                </Link>
              </li>
              <li>
                <Link href="/#business" className="hover:text-gold-light">
                  Business info
                </Link>
              </li>
              <li>
                <Link href="/#quote" className="hover:text-gold-light">
                  Request a quote
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Legal
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-gold-light">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-light">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-gold-light">
                  Refund & Returns
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-gold-light">
                  AML / KYC & Sourcing
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 hairline" />

        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {business.legalName}. All rights
            reserved.
          </p>
          <p className="max-w-xl leading-relaxed">
            You must be 18+ (or your local age of majority) to purchase. Gold is
            not available where its sale is prohibited. Precious-metals prices
            fluctuate and may fall as well as rise — nothing here is investment
            advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
