import { sendEmail, emailLayout, escapeHtml } from "@/lib/email";
import { business } from "@/data/business";
import { formatUSD } from "@/lib/format";

export interface OrderLineItem {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  country: string;
}

export interface Order {
  orderRef: string;
  customer: OrderCustomer;
  lineItems: OrderLineItem[];
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  provider: string;
  status: "pending" | "paid";
}

/**
 * In-memory order store.
 *
 * ⚠️ TODO (client) for production: this lives in a single serverless instance's
 * memory, so a webhook that lands on a *different* instance than checkout won't
 * find the order. Swap this for a shared store — Vercel KV / Upstash Redis or a
 * database — keyed by orderRef. The function signatures below can stay the same.
 */
const orders = new Map<string, Order>();
const fulfilled = new Set<string>();

export function saveOrder(order: Order): void {
  orders.set(order.orderRef, order);
}

export function getOrder(ref: string): Order | undefined {
  return orders.get(ref);
}

/**
 * Mark an order paid and send confirmation emails. Idempotent — providers may
 * deliver the same webhook more than once. `fallback` lets us still email a
 * basic receipt if the order record isn't in this instance's memory.
 */
export async function fulfilOrder(
  ref: string,
  fallback?: { email?: string; total?: number; currency?: string }
): Promise<boolean> {
  if (fulfilled.has(ref)) return true;

  const order = orders.get(ref);
  if (order) {
    order.status = "paid";
    fulfilled.add(ref);
    await sendOrderEmails(order);
    return true;
  }

  // Order not found in this instance — send a minimal receipt if we can.
  if (fallback?.email) {
    fulfilled.add(ref);
    await sendEmail({
      to: fallback.email,
      subject: `Payment received — order ${ref}`,
      html: emailLayout(
        `Payment received — ${ref}`,
        `<p style="color:#a1a1aa">We've received your payment${
          fallback.total != null
            ? ` of ${formatUSD(fallback.total)}`
            : ""
        }. Our vault team will arrange insured delivery and follow up shortly.</p>`
      ),
    });
    return true;
  }

  console.warn("[aurum] fulfilOrder: order not found and no fallback", ref);
  return false;
}

function summaryTable(order: Order): string {
  const rows = order.lineItems
    .map(
      (li) =>
        `<tr><td style="padding:6px 0;color:#e4e4e7">${escapeHtml(
          li.name
        )} × ${li.qty}</td><td style="padding:6px 0;text-align:right;color:#e4e4e7">${formatUSD(
          li.lineTotal
        )}</td></tr>`
    )
    .join("");
  return `<table style="width:100%;font-size:14px;border-collapse:collapse">
    ${rows}
    <tr><td style="padding:6px 0;border-top:1px solid #26262d;color:#a1a1aa">Insured delivery</td>
      <td style="padding:6px 0;border-top:1px solid #26262d;text-align:right;color:#a1a1aa">${formatUSD(
        order.shipping
      )}</td></tr>
    <tr><td style="padding:8px 0;color:#fafafa;font-weight:700">Total</td>
      <td style="padding:8px 0;text-align:right;color:#e6c878;font-weight:700">${formatUSD(
        order.total
      )}</td></tr>
  </table>`;
}

/** Send the customer receipt + internal notification for a paid order. */
export async function sendOrderEmails(order: Order): Promise<void> {
  const { customer } = order;
  const summary = summaryTable(order);

  await sendEmail({
    to: customer.email,
    subject: `Your Aurum order ${order.orderRef}`,
    html: emailLayout(
      `Order confirmed — ${order.orderRef}`,
      `<p style="color:#a1a1aa;margin:0 0 16px">Thank you, ${escapeHtml(
        customer.name
      )}. We've received your payment and our vault team will arrange insured delivery to:</p>
       <p style="color:#e4e4e7;margin:0 0 18px">${escapeHtml(
         customer.address
       )}, ${escapeHtml(customer.city)}, ${escapeHtml(customer.country)}</p>
       ${summary}`
    ),
  });

  await sendEmail({
    to: process.env.NEXT_PUBLIC_INQUIRY_EMAIL ?? business.email,
    replyTo: customer.email,
    subject: `Paid order ${order.orderRef} — ${formatUSD(order.total)} (${order.provider})`,
    html: emailLayout(
      `Paid order ${order.orderRef}`,
      `<p style="color:#a1a1aa">From ${escapeHtml(customer.name)} (${escapeHtml(
        customer.email
      )}, ${escapeHtml(customer.phone ?? "no phone")}) · paid via ${escapeHtml(
        order.provider
      )}</p>${summary}`
    ),
  });
}
