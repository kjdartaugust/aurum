import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { fulfilOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

/**
 * PAYMENT WEBHOOK
 *
 * Hosted providers confirm payment asynchronously by POSTing here. We verify
 * the signature, then mark the order paid + send the receipt (via fulfilOrder,
 * which is idempotent against retries).
 *
 * Point each provider's webhook at:  {SITE_URL}/api/payments/webhook
 * and set the matching *_WEBHOOK_SECRET env var.
 */
export async function POST(request: Request) {
  const raw = await request.text();

  // Detect provider by its signature header.
  const paystackSig = request.headers.get("x-paystack-signature");
  const coinbaseSig = request.headers.get("x-cc-webhook-signature");
  const stripeSig = request.headers.get("stripe-signature");

  try {
    if (paystackSig) return await handlePaystack(raw, paystackSig);
    if (coinbaseSig) return await handleCoinbase(raw, coinbaseSig);
    if (stripeSig) return await handleStripe(raw, stripeSig);
  } catch (e) {
    console.error("[aurum] webhook error", e);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  return NextResponse.json({ error: "Unrecognized webhook" }, { status: 400 });
}

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/** Paystack: HMAC-SHA512 of the raw body using the secret key. */
async function handlePaystack(raw: string, signature: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ ok: true, configured: false });

  const expected = crypto
    .createHmac("sha512", secret)
    .update(raw)
    .digest("hex");
  if (!timingSafeEqual(expected, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw);
  if (event?.event === "charge.success") {
    const ref = event.data?.reference;
    const email = event.data?.customer?.email;
    const total = event.data?.amount != null ? event.data.amount / 100 : undefined;
    if (ref) await fulfilOrder(ref, { email, total });
  }
  return NextResponse.json({ ok: true });
}

/** Coinbase Commerce: HMAC-SHA256 of the raw body using the webhook secret. */
async function handleCoinbase(raw: string, signature: string) {
  const secret = process.env.COINBASE_COMMERCE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: true, configured: false });

  const expected = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex");
  if (!timingSafeEqual(expected, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw);
  const type = event?.event?.type;
  if (type === "charge:confirmed" || type === "charge:resolved") {
    const data = event.event.data;
    const ref = data?.metadata?.orderRef;
    const email = data?.metadata?.email;
    if (ref) await fulfilOrder(ref, { email });
  }
  return NextResponse.json({ ok: true });
}

/**
 * Stripe: header is "t=<ts>,v1=<sig>"; expected = HMAC-SHA256 of `${t}.${raw}`
 * with the webhook signing secret.
 */
async function handleStripe(raw: string, header: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ ok: true, configured: false });

  const parts = Object.fromEntries(
    header.split(",").map((kv) => kv.split("=") as [string, string])
  );
  const t = parts["t"];
  const v1 = parts["v1"];
  if (!t || !v1) {
    return NextResponse.json({ error: "Bad signature header" }, { status: 401 });
  }
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${t}.${raw}`)
    .digest("hex");
  if (!timingSafeEqual(expected, v1)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw);
  if (event?.type === "checkout.session.completed") {
    const session = event.data?.object;
    const ref = session?.client_reference_id;
    const email = session?.customer_email ?? session?.customer_details?.email;
    const total =
      session?.amount_total != null ? session.amount_total / 100 : undefined;
    if (ref) await fulfilOrder(ref, { email, total });
  }
  return NextResponse.json({ ok: true });
}
