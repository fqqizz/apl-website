import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy | Apex Premier League",
  description: "APL privacy policy for player and franchise data.",
  path: "/privacy"
});

export default function PrivacyPage() {
  return (
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
  );
}
