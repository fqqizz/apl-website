import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createMetadata, SEO_PAGES } from "@/lib/seo";

export const metadata: Metadata = createMetadata(SEO_PAGES.refundPolicy);

export default function RefundPolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd pageName="Refund Policy" path="/refund-policy" />
      <LegalPage
        label="LEGAL"
        title="REFUND POLICY"
        intro="Registration and franchise fees are governed by the following refund terms."
        sections={[
          {
            title: "Non-Refundable Fees",
            body: "Registration fees and franchise fees paid to Apex Premier League are non-refundable once payment is successfully processed, except in rare technical or duplicate payment cases reviewed by the APL committee."
          },
          {
            title: "Administrative Review",
            body: "Any exception requests must be submitted in writing to contact@apexpremiereleague.in with payment reference details. Approval is at the sole discretion of the APL committee."
          },
          {
            title: "Withdrawal",
            body: "Withdrawal from the league after registration does not entitle participants to a refund of fees already paid."
          }
        ]}
      />
    </>
  );
}
