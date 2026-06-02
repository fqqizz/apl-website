import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import StatusChecker from "@/components/forms/StatusChecker";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createMetadata, SEO_PAGES } from "@/lib/seo";

export const metadata: Metadata = createMetadata(SEO_PAGES.statusChecker);

export default function StatusPage() {
  return (
    <>
      <BreadcrumbJsonLd pageName="Application Status" path="/status" />
      <div className="pb-20">
        <PageHeader
          label="APPLICATION STATUS"
          title="CHECK YOUR STATUS"
          description="Enter your Player ID to view your application status and submission date."
        />
        <div className="container-apl max-w-xl">
          <StatusChecker />
        </div>
      </div>
    </>
  );
}
