import type { Metadata } from "next";
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
      <div className="container-apl max-w-2xl">
        <PlayerRegistrationForm />
      </div>
    </div>
  );
}
