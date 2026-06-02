import type { Metadata } from "next";
import Image from "next/image";
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
      <div className="container-apl relative mb-10 aspect-[21/9] overflow-hidden rounded-xl border border-apl">
        <Image
          src="/images/editorial-chase.png"
          alt="Franchise-level competitive football"
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="hero-gradient absolute inset-0" />
      </div>
      <div className="container-apl max-w-3xl">
        <FranchiseRegistrationForm />
      </div>
    </div>
  );
}
