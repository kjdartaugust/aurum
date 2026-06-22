import { NextResponse } from "next/server";
import { getProduct } from "@/data/products";
import { sendEmail, emailLayout, escapeHtml } from "@/lib/email";
import { business } from "@/data/business";
import { formatUSD } from "@/lib/format";

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

interface LineItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

const INSURED_SHIPPING = 75;
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/**
 * ⚠️ PLACEHOLDER PAYMENT PROCESSOR — DOES NOT CHARGE ANY FUNDS.
 *
 * Bullion / precious-metals sales are classified high-risk and are declined by
 * most mainstream processors (Stripe, PayPal, etc.). Before launch, integrate a
 * precious-metals-friendly provider and replace this mock with a real flow.
 *
 * TODO (client): choose & integrate a payment provider, e.g.:
 *   - A high-risk merchant gateway (e.g. PaymentCloud, Durango, Easy Pay Direct)
 *   - Bank wire / escrow for large orders (recommended for bullion)
 *   - Crypto settlement (e.g. BTCPay Server, Coinbase Commerce)
 * Then: create a real payment intent / hosted-checkout session here, verify the
 * payment server-side (webhook), and only then mark the order as paid.
 */
async function processPayment(
  orderRef: string,
  amount: number
): Promise<{ paid: boolean; provider: string }> {
  const provider = process.env.PAYMENT_PROVIDER ?? "mock";
  // TODO: replace with a real charge/payment-intent against `provider`.
  console.info("[aurum] MOCK payment", { orderRef, amount, provider });
  return { paid: true, provider };
}

function receiptRows(items: LineItem[]): string {
  return items
    .map(
      (li) =>
        `<tr>
          <td style="padding:6px 0;color:#e4e4e7">${escapeHtml(li.name)} × ${li.qty}</td>
          <td style="padding:6px 0;text-align:right;color:#e4e4e7">${formatUSD(li.lineTotal)}</td>
        </tr>`
    )
    .join("");
}

export async function POST(request: Request) {
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
  const lineItems: LineItem[] = [];
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

  // --- Payment (placeholder) ---
  const payment = await processPayment(orderRef, total);
  if (!payment.paid) {
    return NextResponse.json({ error: "Payment failed." }, { status: 402 });
  }

  // TODO (client): persist the order to a database/order-management system here.
  console.info("[aurum] order placed", {
    orderRef,
    total,
    customer: customer.email,
    items: lineItems.map((l) => `${l.id}×${l.qty}`),
  });

  // --- Order confirmation emails (receipt + internal notification) ---
  const summary = `
    <table style="width:100%;font-size:14px;border-collapse:collapse">
      ${receiptRows(lineItems)}
      <tr><td style="padding:6px 0;border-top:1px solid #26262d;color:#a1a1aa">Insured delivery</td>
        <td style="padding:6px 0;border-top:1px solid #26262d;text-align:right;color:#a1a1aa">${formatUSD(INSURED_SHIPPING)}</td></tr>
      <tr><td style="padding:8px 0;color:#fafafa;font-weight:700">Total</td>
        <td style="padding:8px 0;text-align:right;color:#e6c878;font-weight:700">${formatUSD(total)}</td></tr>
    </table>`;

  await sendEmail({
    to: customer.email,
    subject: `Your Aurum order ${orderRef}`,
    html: emailLayout(
      `Order confirmed — ${orderRef}`,
      `<p style="color:#a1a1aa;margin:0 0 16px">Thank you, ${escapeHtml(
        customer.name
      )}. We've received your order and our vault team will arrange insured delivery to:</p>
       <p style="color:#e4e4e7;margin:0 0 18px">${escapeHtml(customer.address)}, ${escapeHtml(
        customer.city
      )}, ${escapeHtml(customer.country)}</p>
       ${summary}`
    ),
  });

  // Internal notification (best-effort).
  await sendEmail({
    to: process.env.NEXT_PUBLIC_INQUIRY_EMAIL ?? business.email,
    replyTo: customer.email,
    subject: `New order ${orderRef} — ${formatUSD(total)}`,
    html: emailLayout(
      `New order ${orderRef}`,
      `<p style="color:#a1a1aa">From ${escapeHtml(customer.name)} (${escapeHtml(
        customer.email
      )}, ${escapeHtml(customer.phone ?? "no phone")})</p>${summary}`
    ),
  });

  return NextResponse.json({
    ok: true,
    provider: payment.provider,
    orderRef,
    lineItems,
    subtotal,
    shipping: INSURED_SHIPPING,
    total,
    currency: "USD",
    note: "Mock checkout — no funds were charged. Integrate a precious-metals-friendly provider before launch.",
  });
}
