"use client";

import { useState } from "react";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/data/products";
import { formatUSD } from "@/lib/format";

interface OrderResult {
  orderRef: string;
  total: number;
  provider: string;
}

const INSURED_SHIPPING = 75;

export default function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lineItems = items
    .map((i) => ({ item: i, product: getProduct(i.id) }))
    .filter((x) => x.product && x.product.price != null && x.product.buyable);

  const total = subtotal + (subtotal > 0 ? INSURED_SHIPPING : 0);

  async function placeOrder() {
    setPlacing(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      setOrder({
        orderRef: data.orderRef,
        total: data.total + INSURED_SHIPPING,
        provider: data.provider,
      });
      clear();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setPlacing(false);
    }
  }

  if (order) {
    return (
      <div className="container-px flex min-h-[70vh] items-center justify-center py-20">
        <div className="card max-w-lg p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/10 text-3xl text-gold-light">
            ✓
          </div>
          <h1 className="mt-6 font-serif text-3xl text-zinc-50">
            Order confirmed
          </h1>
          <p className="mt-3 text-zinc-400">
            Reference{" "}
            <span className="font-medium text-gold-light">{order.orderRef}</span>.
            Total{" "}
            <span className="font-medium text-zinc-100">
              {formatUSD(order.total)}
            </span>
            . Our vault team will reach out to arrange insured delivery.
          </p>
          <p className="mt-4 rounded-xl border border-gold/20 bg-gold/5 p-3 text-xs text-zinc-400">
            Demo checkout via <strong>{order.provider}</strong> — no funds were
            charged. A precious-metals-friendly payment provider is required for
            production.
          </p>
          <Link href="/products" className="btn-gold mt-8">
            Continue browsing
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-px py-16">
      <h1 className="font-serif text-4xl text-zinc-50 sm:text-5xl">
        Secure checkout
      </h1>
      <p className="mt-3 text-zinc-400">
        Review your holdings before settlement. All deliveries are fully insured.
      </p>

      {lineItems.length === 0 ? (
        <div className="card mt-12 p-12 text-center">
          <p className="font-serif text-xl text-zinc-200">Your vault is empty</p>
          <p className="mt-2 text-sm text-zinc-500">
            Add bars or coins to continue to checkout.
          </p>
          <Link href="/products" className="btn-gold mt-6">
            Browse the catalog
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {lineItems.map(({ item, product }) => (
              <div key={item.id} className="card flex gap-5 p-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <SafeImage
                    src={product!.image}
                    alt={product!.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-lg text-zinc-100">
                        {product!.name}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        {product!.weightLabel} · {product!.karat} ·{" "}
                        {product!.fineness}
                      </p>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-xs text-zinc-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-full border border-white/10">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="px-3 py-1.5 text-zinc-300 hover:text-gold-light"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.qty}</span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="px-3 py-1.5 text-zinc-300 hover:text-gold-light"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-serif text-lg text-gold-light">
                      {formatUSD(product!.price! * item.qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="card h-fit p-7">
            <h2 className="font-serif text-xl text-zinc-100">Order summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <Row label="Subtotal" value={formatUSD(subtotal)} />
              <Row label="Insured delivery" value={formatUSD(INSURED_SHIPPING)} />
              <div className="hairline my-2" />
              <Row
                label="Total"
                value={formatUSD(total)}
                emphasize
              />
            </div>

            <button
              onClick={placeOrder}
              disabled={placing}
              className="btn-gold mt-6 w-full disabled:opacity-60"
            >
              {placing ? "Processing…" : "Pay securely"}
            </button>
            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}
            <p className="mt-4 text-center text-xs text-zinc-500">
              🔒 Demo payment — no funds are charged.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        emphasize ? "text-zinc-100" : "text-zinc-400"
      }`}
    >
      <span>{label}</span>
      <span
        className={emphasize ? "font-serif text-xl text-gold-light" : ""}
      >
        {value}
      </span>
    </div>
  );
}
