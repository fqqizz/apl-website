import Hero from "@/components/sections/Hero";
import LeagueVision from "@/components/sections/LeagueVision";
import Standards from "@/components/sections/Standards";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyAPL from "@/components/sections/WhyAPL";
import FoundingEra from "@/components/sections/FoundingEra";
import RegistrationCTA from "@/components/sections/RegistrationCTA";
import FAQPreview from "@/components/sections/FAQPreview";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LeagueVision />
      <Standards />
      <HowItWorks />
      <WhyAPL />
      <FoundingEra />
      <RegistrationCTA />
      <FAQPreview />
    </>
  );
}
