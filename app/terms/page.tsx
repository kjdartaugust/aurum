import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of the Aurum storefront and the purchase of gold bullion.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="June 2026">
      <p>
        These terms govern your use of the Aurum storefront and any purchase of
        gold products. By using this site, placing an order, or requesting a
        quote, you agree to them.
      </p>

      <h2>Eligibility, age & jurisdiction</h2>
      <ul>
        <li>
          You must be at least <strong>18 years old</strong> (or the age of
          majority in your jurisdiction, whichever is greater) to purchase.
        </li>
        <li>
          You are responsible for ensuring that buying, importing, or holding
          gold is lawful where you live. We do not sell into jurisdictions where
          such sales are prohibited or sanctioned.
          {/* TODO (client): list any countries/regions you do not ship to. */}
        </li>
        <li>
          You confirm you are not on any sanctions or prohibited-persons list and
          that funds used are from lawful sources.
        </li>
      </ul>

      <h2>Pricing</h2>
      <p>
        Standardized refined products are sold at the fixed price displayed at
        the time of order. Unrefined and bulk lots are priced against the live
        gold spot rate at the moment of confirmed assay; quoted prices are
        indicative until settlement.
      </p>

      <h2>Orders & payment</h2>
      <ul>
        <li>An order is binding once payment (or escrow funding) is confirmed.</li>
        <li>
          We may decline or cancel an order, refunding any payment, where stock,
          pricing errors, or compliance checks require it.
        </li>
        <li>
          Large transactions may require identity verification before
          processing.
        </li>
      </ul>

      <h2>Delivery & risk</h2>
      <p>
        Shipments are fully insured and dispatched via vetted secure couriers.
        Risk passes on delivery to the address you provide. Bulk and unrefined
        orders typically settle through third-party escrow following independent
        assay.
      </p>

      <h2>Market risk</h2>
      <p>
        The value of precious metals fluctuates and may fall as well as rise.
        Nothing on this site constitutes investment advice. You purchase at your
        own discretion.
      </p>

      <h2>Liability</h2>
      <p>
        To the maximum extent permitted by law, our liability is limited to the
        value of the affected order. We are not liable for losses arising from
        market movements.
      </p>
    </LegalPage>
  );
}
