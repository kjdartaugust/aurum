import { SITE_URL } from "@/lib/site";

/**
 * PAYMENT PROVIDER ABSTRACTION
 *
 * Bullion is high-risk; mainstream card processors often decline it. This
 * module isolates payment behind one interface so the client can switch
 * providers with the `PAYMENT_PROVIDER` env var — no changes in the checkout
 * route or UI.
 *
 * Providers:
 *   - "mock"     (default) — no real charge; instant confirmation. Dev/demo.
 *   - "paystack" — Paystack hosted checkout (cards + mobile money; great for
 *                  Ghana/Nigeria). Activates with PAYSTACK_SECRET_KEY.
 *   - "coinbase" — Coinbase Commerce hosted checkout (crypto; international).
 *                  Activates with COINBASE_COMMERCE_API_KEY.
 *   - "stripe"   — Stripe Checkout. ⚠️ Stripe restricts precious-metals/bullion
 *                  and may freeze the account; use only as a backup. Activates
 *                  with STRIPE_SECRET_KEY.
 *
 * All hosted providers return `status: "redirect"` with a `hostedUrl`; payment
 * is confirmed later via app/api/payments/webhook (see that file's TODOs).
 */

export interface PaymentOrder {
  orderRef: string;
  amount: number; // in major units (USD dollars)
  currency: string;
  customerEmail: string;
  description: string;
}

export interface PaymentResult {
  status: "paid" | "redirect" | "failed";
  provider: string;
  hostedUrl?: string;
  reference?: string;
}

export function activeProvider(): string {
  return process.env.PAYMENT_PROVIDER ?? "mock";
}

const subunits = (amount: number) => Math.round(amount * 100);
const successUrl = (ref: string) =>
  `${SITE_URL}/cart?status=success&ref=${ref}`;
const cancelUrl = () => `${SITE_URL}/cart?status=cancelled`;

export async function createPayment(
  order: PaymentOrder
): Promise<PaymentResult> {
  const provider = activeProvider();

  let result: PaymentResult | null = null;
  if (provider === "paystack") result = await paystack(order);
  else if (provider === "coinbase") result = await coinbase(order);
  else if (provider === "stripe") result = await stripe(order);
  else {
    // Default: mock. No funds are charged.
    console.info("[aurum] MOCK payment (no funds charged)", {
      orderRef: order.orderRef,
      amount: order.amount,
    });
    return { status: "paid", provider: "mock" };
  }

  if (!result) {
    // Provider selected but unavailable/misconfigured: fail closed rather than
    // silently "selling" gold for free.
    console.error(`[aurum] payment provider "${provider}" unavailable`);
    return { status: "failed", provider };
  }
  return result;
}

/** Paystack — initialize a transaction, redirect to authorization_url. */
async function paystack(order: PaymentOrder): Promise<PaymentResult | null> {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: order.customerEmail,
        amount: subunits(order.amount),
        currency: order.currency,
        reference: order.orderRef,
        callback_url: successUrl(order.orderRef),
        metadata: { description: order.description },
      }),
    });
    if (!res.ok) {
      console.error("[aurum] paystack init failed", res.status);
      return null;
    }
    const json = await res.json();
    const url = json?.data?.authorization_url;
    if (!url) return null;
    return { status: "redirect", provider: "paystack", hostedUrl: url };
  } catch (e) {
    console.error("[aurum] paystack error", e);
    return null;
  }
}

/** Coinbase Commerce — create a hosted charge, redirect to hosted_url. */
async function coinbase(order: PaymentOrder): Promise<PaymentResult | null> {
  const key = process.env.COINBASE_COMMERCE_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CC-Api-Key": key,
        "X-CC-Version": "2018-03-22",
      },
      body: JSON.stringify({
        name: "Aurum bullion order",
        description: order.description,
        pricing_type: "fixed_price",
        local_price: {
          amount: order.amount.toFixed(2),
          currency: order.currency,
        },
        metadata: { orderRef: order.orderRef, email: order.customerEmail },
      }),
    });
    if (!res.ok) {
      console.error("[aurum] coinbase charge failed", res.status);
      return null;
    }
    const json = await res.json();
    const url = json?.data?.hosted_url;
    if (!url) return null;
    return {
      status: "redirect",
      provider: "coinbase",
      hostedUrl: url,
      reference: json.data.id,
    };
  } catch (e) {
    console.error("[aurum] coinbase error", e);
    return null;
  }
}

/** Stripe Checkout — create a session, redirect to its url. ⚠️ see header note. */
async function stripe(order: PaymentOrder): Promise<PaymentResult | null> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    // Stripe's API is form-encoded.
    const form = new URLSearchParams();
    form.set("mode", "payment");
    form.set("success_url", successUrl(order.orderRef));
    form.set("cancel_url", cancelUrl());
    form.set("client_reference_id", order.orderRef);
    form.set("customer_email", order.customerEmail);
    form.set("line_items[0][quantity]", "1");
    form.set("line_items[0][price_data][currency]", order.currency.toLowerCase());
    form.set("line_items[0][price_data][unit_amount]", String(subunits(order.amount)));
    form.set("line_items[0][price_data][product_data][name]", "Aurum bullion order");
    form.set(
      "line_items[0][price_data][product_data][description]",
      order.description.slice(0, 250)
    );

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form.toString(),
    });
    if (!res.ok) {
      console.error("[aurum] stripe session failed", res.status);
      return null;
    }
    const json = await res.json();
    if (!json?.url) return null;
    return {
      status: "redirect",
      provider: "stripe",
      hostedUrl: json.url,
      reference: json.id,
    };
  } catch (e) {
    console.error("[aurum] stripe error", e);
    return null;
  }
}
