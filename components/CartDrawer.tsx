"use client";

import { useEffect } from "react";
import Link from "next/link";
import SafeImage from "./SafeImage";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/data/products";
import { formatUSD } from "@/lib/format";

export default function CartDrawer() {
  const { items, isOpen, close, setQty, remove, subtotal, count } = useCart();

  // Close on Escape and lock background scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-charcoal-50 shadow-soft transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <h2 className="font-serif text-xl text-zinc-100">
            Your Vault <span className="text-zinc-500">({count})</span>
          </h2>
          <button
            onClick={close}
            className="text-2xl leading-none text-zinc-400 hover:text-gold-light"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="mb-2 font-serif text-lg text-zinc-300">
                Your vault is empty
              </p>
              <p className="mb-6 text-sm text-zinc-500">
                Add investment-grade bars and coins to begin.
              </p>
              <Link href="/products" onClick={close} className="btn-outline">
                Browse the catalog
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => {
                const product = getProduct(item.id);
                if (!product || product.price == null) return null;
                return (
                  <li key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10">
                      <SafeImage
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <p className="text-sm font-medium text-zinc-100">
                          {product.name}
                        </p>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-xs text-zinc-500 hover:text-red-400"
                          aria-label={`Remove ${product.name}`}
                        >
                          Remove
                        </button>
                      </div>
                      <p className="text-xs text-zinc-500">{product.weightLabel}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-white/10">
                          <button
                            onClick={() => setQty(item.id, item.qty - 1)}
                            className="px-3 py-1 text-zinc-300 hover:text-gold-light"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{item.qty}</span>
                          <button
                            onClick={() => setQty(item.id, item.qty + 1)}
                            className="px-3 py-1 text-zinc-300 hover:text-gold-light"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-medium text-gold-light">
                          {formatUSD(product.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-5">
            <div className="mb-1 flex items-center justify-between text-sm text-zinc-400">
              <span>Subtotal</span>
              <span className="text-lg font-semibold text-zinc-100">
                {formatUSD(subtotal)}
              </span>
            </div>
            <p className="mb-4 text-xs text-zinc-500">
              Shipping, insurance & taxes calculated at checkout.
            </p>
            <Link
              href="/cart"
              onClick={close}
              className="btn-gold w-full"
            >
              Proceed to secure checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
