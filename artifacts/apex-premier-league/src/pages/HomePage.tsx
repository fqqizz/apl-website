import Hero from "@/components/sections/Hero";
import LeagueVision from "@/components/sections/LeagueVision";
import LeagueStats from "@/components/sections/LeagueStats";
import Standards from "@/components/sections/Standards";
import CompetitionStructure from "@/components/sections/CompetitionStructure";
import AwardsSection from "@/components/sections/AwardsSection";
import FoundingEra from "@/components/sections/FoundingEra";
import RegistrationCTA from "@/components/sections/RegistrationCTA";
import FAQPreview from "@/components/sections/FAQPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LeagueVision />
      <LeagueStats />
      <Standards />
      <CompetitionStructure />
      <AwardsSection />
      <FoundingEra />
      <RegistrationCTA />
      <FAQPreview />
    </>
  );
}
