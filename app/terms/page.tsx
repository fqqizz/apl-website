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
        intro="These terms define participation standards, administrative authority, and conduct expectations for all individuals and entities associated with Apex Premier League."
        sections={[
          {
            title: "Registration Process",
            body: "All players and franchise applicants must complete the official registration form with accurate personal information, valid contact details, and any required documentation. Submission of a registration form constitutes acknowledgement of these terms. Registration does not guarantee acceptance into the league. APL reserves the right to verify submitted information and request additional documentation before confirming any registration."
          },
          {
            title: "Player Responsibilities",
            body: "Registered players are expected to maintain eligibility throughout the season, attend scheduled matches and events, and represent the league and their franchise with professionalism. Players must not engage in any activity that brings the league into disrepute. Failure to meet these responsibilities may result in suspension, removal from the roster, or forfeiture of registration fees at the discretion of APL administration."
          },
          {
            title: "Franchise Responsibilities",
            body: "Franchise owners are responsible for fulfilling all financial obligations, maintaining communication with APL administration, and ensuring their team operates within the rules and spirit of the league. Franchise owners must ensure that their players meet eligibility requirements and adhere to the code of conduct. Franchise fees, deadlines, and approvals are communicated through official APL channels and remain subject to league review."
          },
          {
            title: "League Governance",
            body: "Apex Premier League reserves the right to make final decisions on all matters relating to league operations, including but not limited to eligibility determinations, scheduling, rule enforcement, disciplinary actions, and operational changes. These decisions are made in the interest of maintaining the integrity, fairness, and professional standards of the league. Decisions made by the APL administration are final and binding."
          },
          {
            title: "Application Reviews",
            body: "All player and franchise applications are subject to review by the APL administration. APL retains full discretion in approving, rejecting, or placing applications on hold. Factors considered during review may include completeness of application, eligibility criteria, payment status, and overall league balance. APL is not obligated to provide specific reasons for rejection, though applicants may contact the league for general feedback."
          },
          {
            title: "Payment Terms",
            body: "Registration fees and franchise fees are payable through the official payment channels designated by APL. Payment processing and registration administration may be managed by Farhana Begum on behalf of Apex Premier League. All fees must be paid by the deadlines communicated during registration. Late payments may result in delayed processing, loss of priority placement, or cancellation of the application."
          },
          {
            title: "Refund Policy",
            body: "Refund requests are evaluated on a case-by-case basis by APL administration. Refunds may be issued if a registration is rejected by APL prior to league confirmation, subject to applicable processing fees. Once a player or franchise has been confirmed and placed within the league structure, fees are generally non-refundable. For specific refund inquiries, applicants should contact APL administration directly through the official contact channels."
          },
          {
            title: "Code of Conduct",
            body: "All participants, including players, franchise owners, staff, and supporters, must maintain respectful and sportsmanlike behavior at all times during league activities. Any form of abuse, violence, discrimination, fraud, match-fixing, or conduct that damages the reputation or operations of APL may result in immediate suspension, removal from the league, or a permanent ban. APL may capture, publish, and distribute league-related media including player images, team visuals, and promotional content."
          },
          {
            title: "Data Usage",
            body: "By registering with APL, participants consent to the collection, storage, and processing of their personal information for league administration purposes. This includes names, contact details, photographs, and performance data. APL will not sell personal data to third parties. Data may be used for league communications, public-facing rosters, promotional materials, and internal analytics. Participants may request data corrections or removal by contacting APL administration."
          },
          {
            title: "Contact Information",
            body: "For questions, concerns, or formal inquiries regarding these terms, registration, payments, or any league-related matters, participants may reach the APL team through the official contact page on the APL website, via the official WhatsApp community, or by phone at +91 8491900407. APL aims to respond to all inquiries within a reasonable timeframe."
          }
        ]}
      />
    </>
  );
}
