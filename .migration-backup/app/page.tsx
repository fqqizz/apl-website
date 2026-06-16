// APL V3 Final Refinement Pass - Force Deployment Rebuild
import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import LeagueVision from "@/components/sections/LeagueVision";
import Standards from "@/components/sections/Standards";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyAPL from "@/components/sections/WhyAPL";
import FoundingEra from "@/components/sections/FoundingEra";
import RegistrationCTA from "@/components/sections/RegistrationCTA";
import FAQPreview from "@/components/sections/FAQPreview";
import { createMetadata, SEO_PAGES } from "@/lib/seo";

export const metadata: Metadata = createMetadata(SEO_PAGES.home);

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
