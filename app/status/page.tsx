import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import StatusChecker from "@/components/forms/StatusChecker";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Check Application Status | Apex Premier League",
  description: "Check your APL player application status using your official Player ID.",
  path: "/status",
  ogImage: "/og/home.jpg"
});

export default function StatusPage() {
  return (
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
  );
}
