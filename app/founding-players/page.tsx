import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import FoundingEraStats from "@/components/features/FoundingEraStats";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Founding Players | Apex Premier League",
  description: "Join the founding era of APL. Permanent recognition for Season One players.",
  path: "/founding-players"
});

export default function FoundingPlayersPage() {
  return (
    <div className="pb-20">
      <PageHeader
        label="FOUNDING ERA"
        title="THE FIRST ONES IN"
        description="Founding players receive permanent recognition. Your Player ID is your official football identity."
        gold
      />
      <div className="container-apl grid items-center gap-12 lg:grid-cols-2">
        <div>
          <FoundingEraStats />
          <p className="mt-8 max-w-xl text-body-lg text-apl-text-secondary">
            The first season of APL will not be repeated. Founding players are registered permanently in league history —
            not as a gallery, but as the roster that started Kashmir&apos;s structured football era.
          </p>
          <div className="mt-8">
            <Button href="/register/player">Join the Founding Roster</Button>
          </div>
        </div>
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-apl lg:aspect-[4/5]">
          <Image
            src="/images/founding-goalkeeper.png"
            alt="APL founding era goalkeeper on pitch"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
