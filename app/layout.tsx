import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { bodyFont, displayFont } from "@/lib/fonts";
import { createMetadata } from "@/lib/seo";
import SiteLayout from "@/components/layout/SiteLayout";
import JsonLd from "@/components/seo/JsonLd";

export const metadata: Metadata = createMetadata({
  title: "Apex Premier League — Kashmir's Official Football League",
  description:
    "APL is the first structured professional football league from the Kashmir Valley. Register as a player, own a franchise, or follow Season One.",
  path: "/"
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: "Apex Premier League",
  alternateName: "APL",
  url: "https://apexpremiereleague.in",
  description: "The first structured professional football league from the Kashmir Valley",
  sport: "Football",
  areaServed: { "@type": "Place", name: "Kashmir, India" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91-8491900407",
    contactType: "Customer Support"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <head>
        <JsonLd data={organizationSchema} />
      </head>
      <body className="font-body antialiased">
        <SiteLayout>{children}</SiteLayout>
        <Analytics />
      </body>
    </html>
  );
}
