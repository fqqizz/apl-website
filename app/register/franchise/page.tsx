import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import FranchiseRegistrationForm from "@/components/forms/FranchiseRegistrationForm";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Own a Franchise | Apex Premier League",
  description: "Founding franchise ownership. Limited spots. Season One only.",
  path: "/register/franchise",
  ogImage: "/og/home.jpg"
});

export default function RegisterFranchisePage() {
  return (
    <div className="pb-20">
      <PageHeader
        label="FRANCHISE OWNERSHIP"
        title="OWN A FRANCHISE"
        description="Founding franchise ownership. Limited spots. Season One only."
        gold
      />
      <div className="container-apl max-w-2xl">
        <FranchiseRegistrationForm />
      </div>
    </div>
  );
}
