import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "AML / KYC & Sourcing",
  description:
    "Aurum's anti-money-laundering, know-your-customer, and responsible sourcing commitments.",
};

export default function CompliancePage() {
  return (
    <LegalPage title="AML / KYC & Responsible Sourcing" updated="June 2026">
      <p>
        Aurum operates as a licensed precious-metals dealer and is committed to
        the integrity of the gold supply chain. Trading in bullion is regulated;
        the controls below protect both our clients and the wider market.
      </p>

      <h2>Know Your Customer (KYC)</h2>
      <p>
        For transactions above applicable regulatory thresholds, we are required
        to verify customer identity before settlement. You may be asked to
        provide:
      </p>
      <ul>
        <li>Government-issued photo identification.</li>
        <li>Proof of address dated within the last three months.</li>
        <li>For businesses, beneficial-ownership and registration documents.</li>
        <li>Source-of-funds confirmation for high-value orders.</li>
      </ul>

      <h2>Anti-Money-Laundering (AML)</h2>
      <p>
        We screen transactions for indicators of money laundering and may delay
        or decline any order pending checks. Suspicious activity is reported to
        the relevant authorities as required by law.
      </p>

      <h2>Responsible sourcing</h2>
      <p>
        Our unrefined gold is procured through vetted, conflict-free channels
        with documented chain-of-custody, consistent with OECD due-diligence
        guidance. We do not knowingly deal in gold linked to conflict, illegal
        mining, or human-rights abuses.
      </p>

      <h2>Escrow & assay</h2>
      <p>
        Bulk and unrefined settlements are secured through independent assay and
        third-party escrow, so funds are released only once quantity and purity
        are verified.
      </p>

      <h2>Questions</h2>
      <p>
        For compliance enquiries, contact{" "}
        <a href="mailto:compliance@aurumbullion.example">
          compliance@aurumbullion.example
        </a>
        .
      </p>
    </LegalPage>
  );
}
