"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ApexAI from "@/components/features/ApexAI";
import IntroAnimation from "@/components/layout/IntroAnimation";

export default function SiteLayout({
  children,
  showFooter = true
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [introDone, setIntroDone] = useState(false);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <IntroAnimation onComplete={() => setIntroDone(true)} />
      <div
        className={`transition-opacity duration-700 ${introDone ? "opacity-100" : "opacity-0"}`}
        aria-hidden={!introDone}
      >
        <Navbar />
        <div className="page-shell">{children}</div>
        {showFooter && <Footer />}
        {introDone && <ApexAI />}
      </div>
    </>
  );
}
