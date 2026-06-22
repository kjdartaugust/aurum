import { NextResponse } from "next/server";
import { getProduct } from "@/data/products";

interface CheckoutBody {
  items?: { id: string; qty: number }[];
}

/**
 * PLACEHOLDER PAYMENT ENDPOINT.
 *
 * Precious-metals / bullion sales are classified high-risk by most payment
 * processors. Before production, integrate a precious-metals-friendly
 * provider (e.g. a high-risk merchant gateway, bank wire/escrow, or crypto
 * settlement) and replace the mock confirmation below with a real
 * payment-intent / hosted-checkout flow.
 */
export async function POST(request: Request) {
  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const items = body.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 422 });
  }

  let total = 0;
  const lineItems = [];
  for (const item of items) {
    const product = getProduct(item.id);
    if (!product || product.price == null || !product.buyable) continue;
    const lineTotal = product.price * item.qty;
    total += lineTotal;
    lineItems.push({
      id: product.id,
      name: product.name,
      qty: item.qty,
      unitPrice: product.price,
      lineTotal,
    });
  }

  if (lineItems.length === 0) {
    return NextResponse.json(
      { error: "No purchasable items in cart." },
      { status: 422 }
    );
  }

  const orderRef = `AUR-${Date.now().toString(36).toUpperCase()}`;

  return NextResponse.json({
    ok: true,
    provider: process.env.PAYMENT_PROVIDER ?? "mock",
    orderRef,
    lineItems,
    total,
    currency: "USD",
    note: "Mock checkout — no funds were charged. Swap in a real provider before launch.",
  });
}
