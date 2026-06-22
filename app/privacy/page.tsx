import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Aurum collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <p>
        Aurum (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This
        policy explains what personal data we collect when you browse our
        storefront, place an order, or request a quote, and how we use it.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Contact details</strong> you provide in quote and checkout
          forms: name, email, phone, and order preferences.
        </li>
        <li>
          <strong>Identity & compliance data</strong> required for AML/KYC on
          larger transactions (see our Compliance notice).
        </li>
        <li>
          <strong>Technical data</strong> such as IP address and basic usage
          analytics, used to operate and secure the site.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To respond to quotes and fulfil orders, including insured delivery.</li>
        <li>To meet legal obligations, including anti-money-laundering checks.</li>
        <li>To detect and prevent fraud and abuse of our services.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        We share data only with service providers necessary to operate (payment
        processors, couriers, assayers, escrow agents) and where required by
        law. We do not sell your personal data.
      </p>

      <h2>Retention & your rights</h2>
      <p>
        We retain records as long as needed for the purposes above and to meet
        legal/financial obligations. Subject to applicable law, you may request
        access, correction, or deletion of your data by contacting us.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href="mailto:privacy@aurumbullion.example">
          privacy@aurumbullion.example
        </a>
        .
      </p>
    </LegalPage>
  );
}
