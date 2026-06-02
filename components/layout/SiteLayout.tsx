import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ApexAI from "@/components/features/ApexAI";
import ContactFloat from "@/components/features/ContactFloat";

export default function SiteLayout({
  children,
  showFooter = true
}: {
  children: React.ReactNode;
  showFooter?: boolean;
}) {
  return (
    <>
      <Navbar />
      <div className="page-shell">{children}</div>
      {showFooter && <Footer />}
      <ContactFloat />
      <ApexAI />
    </>
  );
}
