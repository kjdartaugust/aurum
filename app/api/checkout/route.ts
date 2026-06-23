import { NextResponse } from "next/server";
import { getProduct } from "@/data/products";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { createPayment } from "@/lib/payments";
import { saveOrder, sendOrderEmails, type Order, type OrderLineItem } from "@/lib/orders";

interface Customer {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

interface CheckoutBody {
  items?: { id: string; qty: number }[];
  customer?: Customer;
}

const INSURED_SHIPPING = 75;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function POST(request: Request) {
  if (rateLimit(`checkout:${clientIp(request)}`, { max: 10, windowMs: 60_000 })) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const items = body.items ?? [];
  const customer = body.customer ?? {};

  if (items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 422 });
  }
  if (!customer.name || !customer.email || !isEmail(customer.email)) {
    return NextResponse.json(
      { error: "A valid name and email are required for your receipt." },
      { status: 422 }
    );
  }
  if (!customer.address || !customer.city || !customer.country) {
    return NextResponse.json(
      { error: "A complete delivery address is required." },
      { status: 422 }
    );
  }

  // Re-price the cart server-side from the catalog. Never trust client prices.
  let subtotal = 0;
  const lineItems: OrderLineItem[] = [];
  for (const item of items) {
    const product = getProduct(item.id);
    if (!product || product.price == null || !product.buyable) continue;
    const qty = Math.max(1, Math.floor(item.qty));
    const lineTotal = product.price * qty;
    subtotal += lineTotal;
    lineItems.push({
      id: product.id,
      name: product.name,
      qty,
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

  const total = subtotal + INSURED_SHIPPING;
  const orderRef = `AUR-${Date.now().toString(36).toUpperCase()}`;

  // --- Payment (pluggable provider; see lib/payments.ts) ---
  const payment = await createPayment({
    orderRef,
    amount: total,
    currency: "USD",
    customerEmail: customer.email,
    description: lineItems.map((l) => `${l.name} ×${l.qty}`).join(", "),
  });

  if (payment.status === "failed") {
    return NextResponse.json(
      { error: "Payment could not be initiated. Please try again." },
      { status: 402 }
    );
  }

  const order: Order = {
    orderRef,
    customer: customer as Order["customer"],
    lineItems,
    subtotal,
    shipping: INSURED_SHIPPING,
    total,
    currency: "USD",
    provider: payment.provider,
    status: payment.status === "paid" ? "paid" : "pending",
  };
  // Persist so the webhook can look the order up to fulfil it later.
  saveOrder(order);

  console.info("[aurum] order created", {
    orderRef,
    total,
    provider: payment.provider,
    status: order.status,
  });

  // Hosted provider (paystack/coinbase/stripe): buyer pays on the provider page;
  // payment is confirmed asynchronously in app/api/payments/webhook, which sends
  // the receipt. Here we only hand back the redirect URL.
  if (payment.status === "redirect" && payment.hostedUrl) {
    return NextResponse.json({
      ok: true,
      provider: payment.provider,
      orderRef,
      redirectUrl: payment.hostedUrl,
      total,
      currency: "USD",
    });
  }

  // Mock provider: settled instantly — send the receipt now.
  await sendOrderEmails(order);

  return NextResponse.json({
    ok: true,
    provider: payment.provider,
    orderRef,
    lineItems,
    subtotal,
    shipping: INSURED_SHIPPING,
    total,
    currency: "USD",
    note:
      payment.provider === "mock"
        ? "Mock checkout — no funds were charged. Integrate a precious-metals-friendly provider before launch."
        : undefined,
  });
}
