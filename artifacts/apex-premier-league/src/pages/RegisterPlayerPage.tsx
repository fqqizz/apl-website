
import PageHeader from "@/components/layout/PageHeader";
import PlayerRegistrationForm from "@/components/forms/PlayerRegistrationForm";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";



export default function RegisterPlayerPage() {
  return (
    <>
      <BreadcrumbJsonLd pageName="Player Registration" path="/register/player" />
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
    </>
  );
}
