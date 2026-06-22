import { NextResponse } from "next/server";

/**
 * PAYMENT WEBHOOK (STUB)
 *
 * Hosted providers (e.g. Coinbase Commerce) confirm payment asynchronously by
 * POSTing an event here. This stub shows the shape; it does not yet verify
 * signatures or fulfil orders.
 *
 * TODO (client) before going live with a hosted provider:
 *   1. Verify the webhook signature using the provider's shared secret
 *      (e.g. COINBASE_COMMERCE_WEBHOOK_SECRET) — reject unverified requests.
 *   2. On a successful-charge event, look up the order by metadata.orderRef,
 *      mark it paid in your order store, and send the receipt email
 *      (reuse lib/email.ts) + internal notification.
 *   3. Make handling idempotent — providers may retry the same event.
 */
export async function POST(request: Request) {
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
  if (!secret) {
    // Not configured yet — acknowledge so the provider doesn't hard-fail,
    // but do nothing. Configure the secret to enable real verification.
    return NextResponse.json({ ok: true, configured: false });
  }

  // TODO: verify signature (header "x-cc-webhook-signature") against the raw
  // body using `secret`, then process the event.
  const raw = await request.text();
  console.info("[aurum] payment webhook received", { bytes: raw.length });

  return NextResponse.json({ ok: true });
}
