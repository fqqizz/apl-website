"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ApexAI from "@/components/features/ApexAI";
import IntroAnimation from "@/components/layout/IntroAnimation";
import { IntroProvider } from "@/components/layout/IntroProvider";
import AnnouncementBar from "@/components/layout/AnnouncementBar";

export default function SiteLayout({
  children,
  showFooter = true
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <IntroProvider>
      <IntroAnimation />
      <AnnouncementBar />
      <Navbar />
      <div className="page-shell">{children}</div>
      {showFooter && <Footer />}
      <ApexAI />
    </IntroProvider>
  );
}
