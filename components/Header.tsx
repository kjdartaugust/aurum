"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import GoldTicker from "./GoldTicker";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/context/CartContext";

const NAV = [
  { href: "/products", label: "Catalog" },
  { href: "/#trust", label: "Why Aurum" },
  { href: "/#quote", label: "Request a Quote" },
];

export default function Header() {
  const { count, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Live ticker strip */}
      <div className="hidden border-b border-white/5 bg-black/40 md:block">
        <div className="container-px flex h-9 items-center justify-between">
          <GoldTicker compact />
          <p className="text-xs tracking-wide text-zinc-500">
            Insured global delivery · Escrow on bulk orders
          </p>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/5 bg-charcoal/85 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="container-px flex h-16 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-300 transition-colors hover:text-gold-light"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={open}
              className="relative rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-200 transition-colors hover:border-gold/50 hover:text-gold-light"
              aria-label={`Open cart, ${count} items`}
            >
              Cart
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-gold-gradient text-[11px] font-bold text-charcoal">
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full border border-white/10 md:hidden"
              aria-label="Toggle menu"
            >
              <span className="text-lg leading-none">{mobileOpen ? "×" : "≡"}</span>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-white/5 bg-charcoal/95 px-5 py-4 md:hidden">
            <div className="mb-3">
              <GoldTicker compact />
            </div>
            <nav className="flex flex-col gap-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-zinc-200 hover:text-gold-light"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
