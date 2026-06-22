"use client";

import Link from "next/link";
import SafeImage from "./SafeImage";
import type { Product } from "@/data/products";
import { formatUSD } from "@/lib/format";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <article className="card group flex flex-col overflow-hidden hover:-translate-y-1 hover:border-gold/30 hover:shadow-gold">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SafeImage
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] uppercase tracking-wider text-gold-light backdrop-blur">
            {product.karat} · {product.fineness}
          </span>
        </div>
        {!product.buyable && (
          <span className="absolute right-3 top-3 rounded-full bg-gold-gradient px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-charcoal">
            Quote only
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg text-zinc-100">{product.name}</h3>
        </div>
        <p className="mt-1 text-sm text-zinc-400">{product.weightLabel}</p>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {product.blurb}
        </p>

        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <span className="text-gold/70">◆</span>
          {product.certification}
        </div>
        {product.origin && (
          <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
            <span className="text-gold/70">◆</span>
            {product.origin}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
          {product.price != null ? (
            <span className="font-serif text-xl text-gold-light">
              {formatUSD(product.price)}
            </span>
          ) : (
            <span className="text-sm text-zinc-400">Priced at live spot</span>
          )}

          {product.buyable ? (
            <button
              onClick={() => add(product.id)}
              className="btn-gold px-5 py-2 text-xs"
            >
              Add to vault
            </button>
          ) : (
            <Link href="/#quote" className="btn-outline px-5 py-2 text-xs">
              Request a quote
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
