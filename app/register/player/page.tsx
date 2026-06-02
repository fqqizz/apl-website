import type { Metadata } from "next";
import Image from "next/image";
import PageHeader from "@/components/layout/PageHeader";
import PlayerRegistrationForm from "@/components/forms/PlayerRegistrationForm";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Register as Player | Apex Premier League",
  description: "Join the founding roster of APL. Secure your official Player ID and compete in Season One.",
  path: "/register/player",
  ogImage: "/og/home.jpg"
});

export default function RegisterPlayerPage() {
  return (
    <div className="pb-20">
      <PageHeader
        label="PLAYER REGISTRATION"
        title="REGISTER AS A PLAYER"
        description="Join the founding roster of APL. Secure your Player ID."
      />
      <div className="container-apl grid max-w-5xl gap-10 lg:grid-cols-[1fr_280px] lg:gap-12">
        <PlayerRegistrationForm />
        <div className="relative hidden min-h-[320px] overflow-hidden rounded-xl border border-apl lg:block">
          <Image
            src="/images/editorial-women.png"
            alt="Women's football at APL standard"
            fill
            className="object-cover"
            sizes="280px"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>
      </div>
    </div>
  );
}
