import raw from "./products.json";

/**
 * PRODUCT CATALOG
 *
 * The catalog content lives in `data/products.json` so it can be updated
 * without touching application code. To add, edit, or remove products, the
 * client edits that JSON file and redeploys.
 *
 * TODO (client / future): when the catalog needs non-technical editing or
 * inventory/stock tracking, migrate this loader to a headless CMS or database
 * (e.g. Sanity, Contentful, Supabase). Keep the `Product` shape below as the
 * contract so the rest of the app is unaffected.
 *
 * Each JSON record must match the `Product` type:
 *   - category: "refined" (bars/coins, fixed price) | "unrefined" (raw, quote)
 *   - price:    a number in USD, or null for quote-only items
 *   - buyable:  true => can be added to cart & checked out directly
 */

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
  /** Purity as karat label, e.g. "24K", and fineness, e.g. "99.99%". */
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

export const products: Product[] = raw as Product[];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
