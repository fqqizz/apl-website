

import { useLocation } from 'wouter';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ApexAI from "@/components/features/ApexAI";
import IntroAnimation from "@/components/layout/IntroAnimation";
import { IntroProvider, useIntroReady } from "@/components/layout/IntroProvider";

function SiteLayoutContent({
  children,
  showFooter
}: {
  children: React.ReactNode;
  showFooter: boolean;
}) {
  const introReady = useIntroReady();
  
  return (
    <>
      <IntroAnimation />
      <Navbar />
      <div className="page-shell">{children}</div>
      {showFooter && <Footer />}
      {introReady && <ApexAI />}
    </>
  );
}

export default function SiteLayout({
  children,
  showFooter = true
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  const [pathname] = useLocation();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <IntroProvider>
      <SiteLayoutContent showFooter={showFooter}>{children}</SiteLayoutContent>
    </IntroProvider>
  );
}
