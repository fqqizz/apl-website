import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { createMetadata, SEO_PAGES } from "@/lib/seo";

export const metadata: Metadata = createMetadata(SEO_PAGES.franchises);

const benefits = [
  "Official franchise identity in Kashmir's first structured league",
  "Priority placement during the founding era",
  "Player pool access through registered APL talent",
  "Media and matchday presence within the APL ecosystem"
];

export default function FranchisesPage() {
  return (
    <>
      <BreadcrumbJsonLd pageName="Franchises" path="/franchises" />
      <div className="pb-20">
        <PageHeader
          label="FRANCHISE ECOSYSTEM"
          title="OWN KASHMIR'S NEXT GREAT CLUB"
          description="Franchise ownership is limited. Founding owners build clubs meant to last beyond a single season."
        />
        <div className="container-apl relative mb-12 aspect-[21/9] overflow-hidden rounded-xl border border-apl">
          <Image
            src="/images/editorial-tackle.png"
            alt="Competitive football match action"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="hero-gradient absolute inset-0" />
        </div>
        <div className="container-apl grid gap-6 lg:grid-cols-2">
          <GlassCard hover={false}>
            <h2 className="text-display-md text-apl-white">The model</h2>
            <p className="mt-4 text-body-md text-apl-text-secondary">
              APL franchises are official league clubs — not informal teams. Owners commit to operations, squad development,
              and representing their area with professional standards.
            </p>
          </GlassCard>
          <GlassCard hover={false}>
            <h2 className="text-display-md text-apl-white">Founding benefits</h2>
            <ul className="mt-4 space-y-3">
              {benefits.map((b) => (
                <li key={b} className="text-body-md text-apl-text-secondary">
                  — {b}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
        <div className="container-apl mt-10">
          <Button href="/register/franchise">Franchise Registration</Button>
        </div>
      </div>
    </>
  );
}
