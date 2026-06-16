import type { Metadata } from "next";
import { Phone, Mail } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ContactForm from "@/components/features/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { CONTACT_PHONE, CONTACT_PHONE_TEL } from "@/lib/apl-constants";
import { createMetadata, SEO_PAGES } from "@/lib/seo";
import { contactPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = createMetadata(SEO_PAGES.contact);

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema()} />
      <BreadcrumbJsonLd pageName="Contact" path="/contact" />
      <div className="pb-20">
        <PageHeader label="CONTACT" title="SPEAK WITH APL" description="Registration, franchise ownership, and league information." />
        <div className="container-apl grid gap-12 lg:grid-cols-[1fr_280px]">
          <ContactForm />
          <aside className="space-y-6 text-body-md">
            <a href={CONTACT_PHONE_TEL} className="flex items-center gap-3 text-apl-white hover:text-apl-blue">
              <Phone size={18} />
              {CONTACT_PHONE}
            </a>
            <a href="mailto:contact@apexpremiereleague.in" className="flex items-center gap-3 text-apl-text-secondary hover:text-apl-white">
              <Mail size={18} />
              contact@apexpremiereleague.in
            </a>
            <p className="text-apl-text-muted">Baramulla, North Kashmir · Season One</p>
          </aside>
        </div>
      </div>
    </>
  );
}
