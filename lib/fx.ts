/**
 * Live USD -> GHS exchange rate.
 *
 * Fetches from the free, keyless open.er-api.com, caches the result in memory
 * for a few hours (FX doesn't move much intraday, and this avoids a lookup on
 * every checkout), and falls back gracefully so a payment never fails on FX:
 *   live rate  ->  last cached rate  ->  PAYSTACK_USD_TO_GHS env  ->  15.5
 */
let cache: { rate: number; at: number } | null = null;
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

function envFallback(): number {
  return Number(process.env.PAYSTACK_USD_TO_GHS ?? "15.5") || 15.5;
}

export async function getUsdToGhs(): Promise<number> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.rate;

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const data = await res.json();
      const ghs = data?.rates?.GHS;
      if (typeof ghs === "number" && ghs > 0) {
        cache = { rate: ghs, at: Date.now() };
        return ghs;
      }
    }
  } catch (e) {
    console.error("[aurum] live FX lookup failed; using fallback", e);
  }

  // Live lookup failed — prefer a stale cached rate, else the env fallback.
  return cache?.rate ?? envFallback();
}
