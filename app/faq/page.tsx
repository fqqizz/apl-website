import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import FAQAccordion from "@/components/features/FAQAccordion";
import JsonLd from "@/components/seo/JsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createMetadata, SEO_PAGES } from "@/lib/seo";
import { faqPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata(SEO_PAGES.faq);

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqPageSchema()} />
      <BreadcrumbJsonLd pageName="FAQ" path="/faq" />
      <div className="pb-20">
        <PageHeader label="FAQ" title="QUESTIONS, ANSWERED" description="Player, franchise, and general league information." />
        <div className="container-apl max-w-3xl">
          <FAQAccordion showRulebook />
        </div>
      </div>
    </>
  );
}
