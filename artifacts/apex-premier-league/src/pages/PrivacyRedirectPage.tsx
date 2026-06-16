
import LegalPage from "@/components/LegalPage";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";



export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd pageName="Privacy Policy" path="/privacy" />
      <LegalPage
        label="LEGAL"
        title="PRIVACY POLICY"
        intro="Apex Premier League respects the personal information submitted by players, franchise owners, and supporters."
        sections={[
          {
            title: "Information We Collect",
            body: "We may collect names, contact details, age, area, player position, social handles, uploaded identification, photographs, franchise details, and messages submitted through official APL forms."
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
            body: "APL takes reasonable steps to keep submitted information organized and protected. Access is limited to league administration and approved operations."
          },
          {
            title: "Contact",
            body: "For privacy questions, contact contact@apexpremiereleague.in or +91 8491900407."
          }
        ]}
      />
    </>
  );
}
