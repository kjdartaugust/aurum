import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Refund & Returns Policy",
  description:
    "Aurum's refund, return, and cancellation policy for gold bullion orders.",
};

export default function RefundPage() {
  return (
    <LegalPage title="Refund & Returns Policy" updated="June 2026">
      <p>
        Because the price of gold moves continuously with the market, bullion
        sales carry special return conditions. This policy explains when refunds
        and returns are available.
      </p>

      <h2>Order cancellation</h2>
      <p>
        You may cancel an order before it is dispatched for a full refund. Once
        an order has shipped, the return terms below apply. {/* TODO: confirm your
        cancellation window, e.g. "within 24 hours of ordering". */}
      </p>

      <h2>Market-loss policy</h2>
      <p>
        Gold is priced live. If you return an order that was correctly supplied,
        any difference between the price you paid and the prevailing market
        (buy-back) price at the time of return — a &ldquo;market loss&rdquo; —
        may be deducted from your refund. A market gain is not paid out.
        {/* TODO: confirm whether you charge market-loss and any minimum fee. */}
      </p>

      <h2>Returns for defects or errors</h2>
      <ul>
        <li>
          If an item arrives damaged, incorrect, or not matching its certified
          purity, contact us within{" "}
          <strong>{/* TODO */} 7 days</strong> of delivery for a full refund or
          replacement at our cost.
        </li>
        <li>
          Returned items must be unaltered, in original sealed packaging, with
          all certificates and serial numbers intact.
        </li>
      </ul>

      <h2>Non-returnable items</h2>
      <p>
        Custom orders, and unrefined/bulk lots priced against live spot and
        settled via escrow, are generally non-returnable once assayed and
        accepted. {/* TODO: adjust to your operations. */}
      </p>

      <h2>Refund method & timing</h2>
      <p>
        Approved refunds are issued to the original payment method (or by bank
        transfer for wire/escrow orders) within{" "}
        <strong>{/* TODO */} 5–10 business days</strong> of us receiving and
        verifying the returned goods.
      </p>

      <h2>How to start a return</h2>
      <p>
        Email{" "}
        <a href="mailto:support@aurumbullion.example">
          support@aurumbullion.example
        </a>{" "}
        with your order reference. Do not ship items back until you receive
        return authorization and insured-shipping instructions.
      </p>
    </LegalPage>
  );
}
