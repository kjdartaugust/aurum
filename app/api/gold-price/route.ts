import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SpotPayload {
  price: number;
  change: number;
  changePct: number;
  currency: string;
  unit: string;
  updatedAt: string;
  simulated?: boolean;
}

// Realistic baseline so the ticker is always alive even without a provider key.
const BASE_PRICE = 2410;

function simulatedSpot(): SpotPayload {
  // Deterministic-ish intraday wobble derived from the clock so consecutive
  // polls move gently rather than jumping randomly.
  const t = Date.now() / 1000;
  const wave = Math.sin(t / 900) * 14 + Math.sin(t / 180) * 3.5;
  const price = +(BASE_PRICE + wave).toFixed(2);
  const change = +wave.toFixed(2);
  return {
    price,
    change,
    changePct: +((change / BASE_PRICE) * 100).toFixed(3),
    currency: "USD",
    unit: "oz",
    updatedAt: new Date().toISOString(),
    simulated: true,
  };
}

export async function GET() {
  const key = process.env.GOLD_API_KEY;

  // If a provider key is configured, try the live feed (goldapi.io shape).
  if (key) {
    try {
      const res = await fetch("https://www.goldapi.io/api/XAU/USD", {
        headers: { "x-access-token": key, "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (res.ok) {
        const d = await res.json();
        const payload: SpotPayload = {
          price: d.price,
          change: d.ch ?? 0,
          changePct: d.chp ?? 0,
          currency: "USD",
          unit: "oz",
          updatedAt: new Date().toISOString(),
        };
        return NextResponse.json(payload);
      }
    } catch {
      // fall through to simulated
    }
  }

  return NextResponse.json(simulatedSpot());
}
