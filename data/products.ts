export type ProductCategory = "refined" | "unrefined";
export type ProductForm = "bar" | "coin" | "raw";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  form: ProductForm;
  /** Weight in troy ounces. */
  weightOz: number;
  weightLabel: string;
  /** Purity as karat label, e.g. "24K" and fineness "99.99%". */
  karat: string;
  fineness: string;
  certification: string;
  /** Fixed list price in USD. `null` => quote-only (bulk / unrefined). */
  price: number | null;
  image: string;
  origin?: string;
  blurb: string;
  /** Standardized fixed-price items can be bought directly. */
  buyable: boolean;
}

export const products: Product[] = [
  {
    id: "bar-1oz-aurum",
    name: "Aurum 1 oz Cast Gold Bar",
    category: "refined",
    form: "bar",
    weightOz: 1,
    weightLabel: "1 troy oz (31.1 g)",
    karat: "24K",
    fineness: "99.99%",
    certification: "LBMA Good Delivery · Assay card included",
    price: 2480,
    image:
      "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=80",
    blurb:
      "Our flagship investment bar. Sealed in a tamper-evident assay card with serial number and purity guarantee.",
    buyable: true,
  },
  {
    id: "bar-10oz-aurum",
    name: "Aurum 10 oz Cast Gold Bar",
    category: "refined",
    form: "bar",
    weightOz: 10,
    weightLabel: "10 troy oz (311 g)",
    karat: "24K",
    fineness: "99.99%",
    certification: "LBMA Good Delivery · Independent assay",
    price: 24650,
    image:
      "https://images.unsplash.com/photo-1624365168968-3f0fe725208a?auto=format&fit=crop&w=900&q=80",
    blurb:
      "A serious store of value. Hand-poured, individually serialized, and shipped fully insured via armored courier.",
    buyable: true,
  },
  {
    id: "coin-1oz-sovereign",
    name: "Aurum Sovereign 1 oz Coin",
    category: "refined",
    form: "coin",
    weightOz: 1,
    weightLabel: "1 troy oz (31.1 g)",
    karat: "24K",
    fineness: "99.99%",
    certification: "Mint certificate of authenticity",
    price: 2545,
    image:
      "https://images.unsplash.com/photo-1612869538502-b3f6f4a3f5c1?auto=format&fit=crop&w=900&q=80",
    blurb:
      "Legal-tender quality strike with a milled edge and proof finish. A collectible that holds its metal value.",
    buyable: true,
  },
  {
    id: "coin-half-sovereign",
    name: "Aurum Half-Sovereign ½ oz Coin",
    category: "refined",
    form: "coin",
    weightOz: 0.5,
    weightLabel: "½ troy oz (15.55 g)",
    karat: "22K",
    fineness: "91.67%",
    certification: "Mint certificate of authenticity",
    price: 1290,
    image:
      "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&w=900&q=80",
    blurb:
      "An accessible entry point into physical gold. Ideal for gifting and incremental stacking.",
    buyable: true,
  },
  {
    id: "bar-100g-aurum",
    name: "Aurum 100 g Minted Bar",
    category: "refined",
    form: "bar",
    weightOz: 3.215,
    weightLabel: "100 g (3.215 oz)",
    karat: "24K",
    fineness: "99.99%",
    certification: "CertiCard with security hologram",
    price: 7920,
    image:
      "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=900&q=80",
    blurb:
      "Precision-minted with a brushed face and laser-etched weight. Popular with first-time and seasoned investors alike.",
    buyable: true,
  },
  {
    id: "raw-dore-bar",
    name: "Doré Bar — Semi-Refined",
    category: "unrefined",
    form: "raw",
    weightOz: 32,
    weightLabel: "≈ 1 kg (variable)",
    karat: "~21K",
    fineness: "85–90% (assay-dependent)",
    certification: "Origin & assay report on request",
    price: null,
    image:
      "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&w=900&q=80",
    origin: "Ghana · responsibly sourced",
    blurb:
      "Semi-refined doré for refiners and wholesale buyers. Priced against live spot on confirmed assay. Quote only.",
    buyable: false,
  },
  {
    id: "raw-nugget-lot",
    name: "Alluvial Gold Nugget Lot",
    category: "unrefined",
    form: "raw",
    weightOz: 16,
    weightLabel: "≈ 500 g lot (variable)",
    karat: "~22K",
    fineness: "88–92% (assay-dependent)",
    certification: "Chain-of-custody documentation",
    price: null,
    image:
      "https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=900&q=80",
    origin: "West Africa · artisanal, conflict-free",
    blurb:
      "Natural alluvial nuggets sourced through vetted, conflict-free channels. Bulk quote with KYC required.",
    buyable: false,
  },
  {
    id: "raw-gold-dust",
    name: "Raw Gold Dust — Bulk",
    category: "unrefined",
    form: "raw",
    weightOz: 64,
    weightLabel: "2 kg+ (variable)",
    karat: "~20K",
    fineness: "82–88% (assay-dependent)",
    certification: "Independent assay before settlement",
    price: null,
    image:
      "https://images.unsplash.com/photo-1631545806609-c2b999c5edf2?auto=format&fit=crop&w=900&q=80",
    origin: "West Africa · responsibly sourced",
    blurb:
      "Wholesale gold dust for industrial refiners. Settlement after independent assay and escrow confirmation.",
    buyable: false,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
