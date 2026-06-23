import { sendEmail, emailLayout, escapeHtml } from "@/lib/email";
import { business } from "@/data/business";
import { formatUSD } from "@/lib/format";
import { kvEnabled, kvGet, kvSet, kvSetNx } from "@/lib/kv";

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
 * Order store. Uses Vercel KV when configured (durable, shared across all
 * serverless instances), otherwise an in-memory Map for local/dev. Records
 * expire after 30 days to avoid unbounded growth.
 */
const TTL_SECONDS = 60 * 60 * 24 * 30;
const memOrders = new Map<string, Order>();
const memFulfilled = new Set<string>();

export async function saveOrder(order: Order): Promise<void> {
  if (kvEnabled) {
    await kvSet(`order:${order.orderRef}`, JSON.stringify(order), TTL_SECONDS);
  } else {
    memOrders.set(order.orderRef, order);
  }
}

export async function getOrder(ref: string): Promise<Order | undefined> {
  if (kvEnabled) {
    const raw = await kvGet(`order:${ref}`);
    return raw ? (JSON.parse(raw) as Order) : undefined;
  }
  return memOrders.get(ref);
}

/** Claim the one-time right to fulfil `ref`. Returns false if already claimed. */
async function claimFulfilment(ref: string): Promise<boolean> {
  if (kvEnabled) {
    return kvSetNx(`fulfilled:${ref}`, "1", TTL_SECONDS);
  }
  if (memFulfilled.has(ref)) return false;
  memFulfilled.add(ref);
  return true;
}

/**
 * Mark an order paid and send confirmation emails. Idempotent — providers may
 * deliver the same webhook more than once. `fallback` lets us still email a
 * basic receipt if the order record can't be found.
 */
export async function fulfilOrder(
  ref: string,
  fallback?: { email?: string; total?: number; currency?: string }
): Promise<boolean> {
  const order = await getOrder(ref);

  // Nothing we can do — don't consume the idempotency claim, so a later retry
  // (e.g. after the order record propagates) can still succeed.
  if (!order && !fallback?.email) {
    console.warn("[aurum] fulfilOrder: order not found and no fallback", ref);
    return false;
  }

  // Only act once, even across duplicate webhook deliveries.
  if (!(await claimFulfilment(ref))) return true;

  if (order) {
    order.status = "paid";
    if (kvEnabled) {
      await kvSet(`order:${ref}`, JSON.stringify(order), TTL_SECONDS);
    }
    await sendOrderEmails(order);
    return true;
  }

  // Order record unavailable — send a minimal receipt from event data.
  await sendEmail({
    to: fallback!.email!,
    subject: `Payment received — order ${ref}`,
    html: emailLayout(
      `Payment received — ${ref}`,
      `<p style="color:#a1a1aa">We've received your payment${
        fallback!.total != null ? ` of ${formatUSD(fallback!.total)}` : ""
      }. Our vault team will arrange insured delivery and follow up shortly.</p>`
    ),
  });
  return true;
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
