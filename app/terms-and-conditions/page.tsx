import LegalPage from "@/components/LegalPage";

export default function TermsAndConditions() {
  return (
    <LegalPage
      eyebrow="APL Legal"
      title="Terms & Conditions"
      intro="These terms define the participation standards, administrative authority, registration policies, and conduct expectations for APEX PREMIER LEAGUE."
      sections={[
        {
          title: "Registration Policies",
          body: "Player registration requires accurate details and official payment where applicable. Submission does not guarantee selection, franchise placement, match participation, or final league approval."
        },
        {
          title: "Conduct Rules",
          body: "Players, franchise owners, managers, staff, and spectators must maintain respectful behavior. Abuse, violence, fraud, harassment, or conduct damaging to APL may lead to warnings, suspension, removal, or further action."
        },
        {
          title: "Franchise Fees",
          body: "Franchise fees, deadlines, and approvals are communicated through official APL channels. Franchise rights remain subject to league review, documentation, and compliance."
        },
        {
          title: "Media Rights",
          body: "APL may capture, publish, edit, distribute, and archive league-related media including player images, team visuals, interviews, highlights, reels, and promotional content."
        },
        {
          title: "League Authority",
          body: "APL reserves the right to make final decisions on eligibility, scheduling, fixtures, disciplinary matters, team participation, match rules, and operational changes in the interest of the league."
        },
        {
          title: "Refund Policy",
          body: "All registration fees and franchise fees are strictly non-refundable. Once payment has been processed and any administrative, verification, or league operations have commenced, no refunds will be issued under any circumstances including cancellation, withdrawal, non-participation, or ineligibility. Players and franchise owners acknowledge that all payments are final and binding at the time of submission. Payments for Apex Premier League are processed and managed under the authorized operations of Farhana Begum."
        },
        {
          title: "Suspension Rules",
          body: "APL may suspend or remove any participant, team, or franchise for misconduct, false information, non-payment, rule breaches, or actions that compromise league standards."
        }
      ]}
    />
  );
}
