/**
 * PAYMENT PROVIDER ABSTRACTION
 *
 * Bullion is high-risk; mainstream processors (Stripe/PayPal) usually decline
 * it. This module isolates payment behind one interface so the client can plug
 * in a precious-metals-friendly provider by setting `PAYMENT_PROVIDER` (+ its
 * keys) — no changes needed in the checkout route or UI.
 *
 * Providers:
 *   - "mock"     (default) — no real charge; immediate confirmation. Dev/demo.
 *   - "coinbase" — Coinbase Commerce hosted checkout (crypto settlement). A
 *                  real, working reference implementation; activates when
 *                  COINBASE_COMMERCE_API_KEY is set.
 *
 * TODO (client): to add a high-risk card gateway, bank-wire, or escrow flow,
 * implement another branch below returning a `PaymentResult` and document its
 * env vars in .env.example.
 */

export interface PaymentOrder {
  orderRef: string;
  amount: number;
  currency: string;
  customerEmail: string;
  description: string;
}

export interface PaymentResult {
  /** "paid": settled now (mock). "redirect": send the buyer to `hostedUrl` to
   *  complete payment (confirmed later via webhook). "failed": do not proceed. */
  status: "paid" | "redirect" | "failed";
  provider: string;
  hostedUrl?: string;
  /** Provider-side id, useful for reconciliation/webhooks. */
  reference?: string;
}

export function activeProvider(): string {
  return process.env.PAYMENT_PROVIDER ?? "mock";
}

export async function createPayment(
  order: PaymentOrder
): Promise<PaymentResult> {
  const provider = activeProvider();

  if (provider === "coinbase") {
    const result = await coinbaseCommerce(order);
    if (result) return result;
    // Misconfigured (no key / API error): fail closed rather than silently
    // "selling" gold for free.
    console.error("[aurum] coinbase provider selected but unavailable");
    return { status: "failed", provider };
  }

  // Default: mock. No funds are charged.
  console.info("[aurum] MOCK payment (no funds charged)", {
    orderRef: order.orderRef,
    amount: order.amount,
  });
  return { status: "paid", provider: "mock" };
}

/** Coinbase Commerce — creates a hosted charge and returns its checkout URL. */
async function coinbaseCommerce(
  order: PaymentOrder
): Promise<PaymentResult | null> {
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
    const data = json?.data;
    if (!data?.hosted_url) return null;
    return {
      status: "redirect",
      provider: "coinbase",
      hostedUrl: data.hosted_url,
      reference: data.id,
    };
  } catch (e) {
    console.error("[aurum] coinbase error", e);
    return null;
  }
}
