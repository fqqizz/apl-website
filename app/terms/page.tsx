import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createMetadata, SEO_PAGES } from "@/lib/seo";

export const metadata: Metadata = createMetadata(SEO_PAGES.terms);

export default function TermsPage() {
  return (
    <>
      <BreadcrumbJsonLd pageName="Terms of Service" path="/terms" />
      <LegalPage
        label="LEGAL"
        title="TERMS OF SERVICE"
        intro="These terms define participation standards, administrative authority, and conduct expectations for Apex Premier League."
        sections={[
          {
            title: "Registration Policies",
            body: "Player registration requires accurate details and official payment where applicable. Submission does not guarantee selection, franchise placement, or final league approval."
          },
          {
            title: "Conduct Rules",
            body: "Participants must maintain respectful behavior. Abuse, violence, fraud, or conduct damaging to APL may lead to suspension or removal."
          },
          {
            title: "Franchise Fees",
            body: "Franchise fees, deadlines, and approvals are communicated through official APL channels and remain subject to league review."
          },
          {
            title: "Media Rights",
            body: "APL may capture, publish, and distribute league-related media including player images, team visuals, and promotional content."
          },
          {
            title: "League Authority",
            body: "APL reserves the right to make final decisions on eligibility, scheduling, disciplinary matters, and operational changes."
          },
          {
            title: "Suspension Rules",
            body: "APL may suspend or remove any participant, team, or franchise for misconduct, false information, or rule breaches."
          }
        ]}
      />
    </>
  );
}
