
import PageHeader from "@/components/layout/PageHeader";
import FranchiseRegistrationForm from "@/components/forms/FranchiseRegistrationForm";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";



export default function RegisterFranchisePage() {
  return (
    <>
      <BreadcrumbJsonLd pageName="Franchise Ownership" path="/register/franchise" />
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
    </>
  );
}
