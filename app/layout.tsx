import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { bodyFont, displayFont } from "@/lib/fonts";
import { createRootMetadata } from "@/lib/seo";
import SiteLayout from "@/components/layout/SiteLayout";
import GlobalSeoSchemas from "@/components/seo/GlobalSeoSchemas";

export const metadata: Metadata = createRootMetadata();

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <head>
        <GlobalSeoSchemas />
      </head>
      <body className="font-body antialiased">
        <SiteLayout>{children}</SiteLayout>
        <Analytics />
      </body>
    </html>
  );
}
