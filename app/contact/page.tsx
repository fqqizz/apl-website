import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact | Apex Premier League",
  description: "Contact APL for registration, franchise, and league enquiries.",
  path: "/contact"
});

export default function ContactPage() {
  return (
    <div className="pb-20">
      <PageHeader label="CONTACT" title="SPEAK WITH APL" description="Registration, franchise ownership, and league information." />
      <div className="container-apl max-w-xl">
        <div className="glass-card space-y-6 p-8">
          <a href="tel:+918491900407" className="flex items-center gap-3 text-body-lg text-apl-white hover:text-apl-blue">
            <Phone size={20} />
            +91 8491900407
          </a>
          <a href="mailto:contact@apexpremiereleague.in" className="flex items-center gap-3 text-body-lg text-apl-text-secondary hover:text-apl-white">
            <Mail size={20} />
            contact@apexpremiereleague.in
          </a>
          <p className="text-body-md text-apl-text-muted">Baramulla, North Kashmir · Season One</p>
        </div>
      </div>
    </div>
  );
}
