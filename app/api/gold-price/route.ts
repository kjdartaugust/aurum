import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SpotPayload {
  price: number;
  change: number;
  changePct: number;
  currency: string;
  unit: string;
  updatedAt: string;
  source: string;
  simulated?: boolean;
}

const BASE_PRICE = 2410;

/**
 * Track an intraday "open" price in module memory so we can show a real change
 * value alongside live sources that only return spot. Resets each UTC day (and
 * on cold starts, which is acceptable for a ticker).
 */
let dayOpen: { date: string; price: number } | null = null;

function withChange(price: number, source: string): SpotPayload {
  const today = new Date().toISOString().slice(0, 10);
  if (!dayOpen || dayOpen.date !== today) {
    dayOpen = { date: today, price };
  }
  const change = +(price - dayOpen.price).toFixed(2);
  return {
    price: +price.toFixed(2),
    change,
    changePct: +((change / dayOpen.price) * 100).toFixed(3),
    currency: "USD",
    unit: "oz",
    updatedAt: new Date().toISOString(),
    source,
  };
}

function simulatedSpot(): SpotPayload {
  const t = Date.now() / 1000;
  const wave = Math.sin(t / 900) * 14 + Math.sin(t / 180) * 3.5;
  const price = BASE_PRICE + wave;
  return { ...withChange(price, "simulated"), simulated: true };
}

/** goldapi.io — optional paid/keyed provider; richest data (gives its own change). */
async function fromGoldApiIo(key: string): Promise<SpotPayload | null> {
  try {
    const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
      headers: { "x-access-token": key, "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const d = await res.json();
    if (typeof d.price !== "number") return null;
    return {
      price: +d.price.toFixed(2),
      change: d.ch ?? 0,
      changePct: d.chp ?? 0,
      currency: "USD",
      unit: "oz",
      updatedAt: new Date().toISOString(),
      source: "goldapi.io",
    };
  } catch {
    return null;
  }
}

/**
 * gold-api.com — free and keyless. Returns spot USD/oz with no rate-limit
 * signup. Recommended default live source. Shape: { price: number, ... }.
 */
async function fromGoldApiCom(): Promise<SpotPayload | null> {
  try {
    const res = await fetch("https://api.gold-api.com/price/XAU", {
      headers: { Accept: "application/json" },
      cache: "no-store",
      // Don't let a slow upstream hang the request.
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const d = await res.json();
    if (typeof d.price !== "number") return null;
    return withChange(d.price, "gold-api.com");
  } catch {
    return null;
  }
}

export async function GET() {
  // 1) Keyed provider if configured, 2) free keyless live source, 3) simulated.
  const key = process.env.GOLD_API_KEY;

  const live =
    (key ? await fromGoldApiIo(key) : null) ?? (await fromGoldApiCom());

  return NextResponse.json(live ?? simulatedSpot());
}
