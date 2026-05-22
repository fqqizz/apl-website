import LegalPage from "@/components/LegalPage";

export default function PrivacyPolicy() {
  return (
    <LegalPage
      eyebrow="APL Legal"
      title="Privacy Policy"
      intro="APEX PREMIERE LEAGUE respects the personal information submitted by players, franchise owners, managers, partners, and supporters."
      sections={[
        {
          title: "Information We Collect",
          body: "We may collect names, contact details, age, area or district, player position, social handles, uploaded identification, photographs, franchise details, and messages submitted through official APL forms."
        },
        {
          title: "How We Use Information",
          body: "Information is used for registration review, eligibility checks, league communication, franchise onboarding, event operations, safety, media coordination, and official APL updates."
        },
        {
          title: "Media And Publicity",
          body: "Photos, videos, reels, match visuals, interviews, and league-created content may be used for APL promotional, editorial, social, and archive purposes."
        },
        {
          title: "Data Care",
          body: "APL takes reasonable steps to keep submitted information organized and protected. Access is limited to people involved in league administration, verification, and approved operations."
        },
        {
          title: "Contact",
          body: "For privacy questions, corrections, or removal requests, contact contact@apexpremiereleague.in."
        },
        {
          title: "Fees and Refund Policy",
          body: "Registration fees and franchise fees paid to APEX PREMIERE LEAGUE are non-refundable once processing, verification, administrative work, or league operations have commenced. No refunds will be issued for any reason including cancellation, withdrawal, or non-participation. All payments are final and binding."
        }
      ]}
    />
  );
}
