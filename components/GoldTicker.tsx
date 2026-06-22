"use client";

import { useEffect, useState } from "react";
import { formatUSDPrecise } from "@/lib/format";

interface SpotData {
  price: number;
  change: number;
  changePct: number;
  currency: string;
  unit: string;
  updatedAt: string;
  source?: string;
  simulated?: boolean;
}

export default function GoldTicker({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<SpotData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/gold-price", { cache: "no-store" });
        if (!res.ok) throw new Error("bad status");
        const json = (await res.json()) as SpotData;
        if (active) {
          setData(json);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    }

    load();
    const id = setInterval(load, 30_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  const up = (data?.change ?? 0) >= 0;
  const isLive = data != null && !data.simulated && !error;

  return (
    <div
      className={`flex items-center gap-3 ${
        compact ? "text-xs" : "text-sm"
      }`}
      aria-live="polite"
      aria-label="Live gold spot price"
      title={
        data
          ? `Source: ${data.source ?? "unknown"} · updated ${new Date(
              data.updatedAt
            ).toLocaleTimeString()}`
          : undefined
      }
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${
            error
              ? "bg-red-500/60"
              : isLive
                ? "bg-emerald-400/70 animate-pulse-soft"
                : "bg-amber-400/70 animate-pulse-soft"
          }`}
        />
      </span>
      <span className="uppercase tracking-[0.18em] text-zinc-500">
        Gold spot
      </span>
      {data ? (
        <>
          <span className="font-medium text-gold-light">
            {formatUSDPrecise(data.price)}
            <span className="ml-1 text-zinc-500">/{data.unit}</span>
          </span>
          <span
            className={`font-medium ${
              up ? "text-emerald-400" : "text-red-400"
            }`}
          >
            {up ? "▲" : "▼"} {Math.abs(data.changePct).toFixed(2)}%
          </span>
        </>
      ) : (
        <span className="text-zinc-500">{error ? "unavailable" : "loading…"}</span>
      )}
    </div>
  );
}
