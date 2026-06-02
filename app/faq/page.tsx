import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import FAQAccordion from "@/components/features/FAQAccordion";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "FAQ | Apex Premier League",
  description: "Frequently asked questions about player registration, franchises, and Season One.",
  path: "/faq"
});

export default function FAQPage() {
  return (
    <div className="pb-20">
      <PageHeader label="FAQ" title="QUESTIONS, ANSWERED" description="Player, franchise, and general league information." />
      <div className="container-apl max-w-3xl">
        <FAQAccordion />
      </div>
    </div>
  );
}
