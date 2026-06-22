"use client";

import { useMemo, useState } from "react";
import { products, type ProductCategory } from "@/data/products";
import ProductCard from "./ProductCard";

type CategoryFilter = "all" | ProductCategory;
type WeightFilter = "all" | "under-1" | "1-to-5" | "over-5";

const CATEGORY_TABS: { value: CategoryFilter; label: string; hint: string }[] = [
  { value: "all", label: "All gold", hint: "Everything we carry" },
  { value: "refined", label: "Refined", hint: "Bars & coins" },
  { value: "unrefined", label: "Unrefined", hint: "Doré, nuggets & dust" },
];

const WEIGHT_TABS: { value: WeightFilter; label: string }[] = [
  { value: "all", label: "Any weight" },
  { value: "under-1", label: "Under 1 oz" },
  { value: "1-to-5", label: "1 – 5 oz" },
  { value: "over-5", label: "Over 5 oz" },
];

function inWeightBand(oz: number, band: WeightFilter): boolean {
  switch (band) {
    case "under-1":
      return oz < 1;
    case "1-to-5":
      return oz >= 1 && oz <= 5;
    case "over-5":
      return oz > 5;
    default:
      return true;
  }
}

export default function ProductCatalog({
  showFilters = true,
  initialCategory = "all",
  heading,
}: {
  showFilters?: boolean;
  initialCategory?: CategoryFilter;
  heading?: React.ReactNode;
}) {
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [weight, setWeight] = useState<WeightFilter>("all");

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (category === "all" || p.category === category) &&
          inWeightBand(p.weightOz, weight)
      ),
    [category, weight]
  );

  return (
    <div>
      {heading}

      {showFilters && (
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setCategory(tab.value)}
                className={`rounded-full px-5 py-2.5 text-sm transition-all ${
                  category === tab.value
                    ? "bg-gold-gradient font-medium text-charcoal shadow-gold"
                    : "border border-white/10 text-zinc-300 hover:border-gold/40 hover:text-gold-light"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-zinc-500">
              Weight
            </span>
            {WEIGHT_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setWeight(tab.value)}
                className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                  weight === tab.value
                    ? "border border-gold/60 text-gold-light"
                    : "border border-white/10 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-zinc-500">
          No items match these filters.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
