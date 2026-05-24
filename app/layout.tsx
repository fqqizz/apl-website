import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Apex Premiere League | Kashmir Football League",
  description:
    "Apex Premiere League (APL) is a premium football league platform from Kashmir focused on football culture, competition, youth talent, and professional league experiences.",
  keywords: [
    "Apex Premiere League",
    "APL Football",
    "Kashmir Football",
    "Baramulla Football",
    "Football League Kashmir",
    "Football Tournament Baramulla"
  ],
  metadataBase: new URL("https://apexpremiereleague.in"),
  openGraph: {
    title: "Apex Premiere League",
    description: "Kashmir's Premiere Football Competition.",
    url: "https://apexpremiereleague.in",
    siteName: "APL",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Apex Premiere League",
    description: "A premium football league platform for culture, competition, and regional talent.",
    images: ["/og-image.jpg"]
  },
  alternates: {
    canonical: "https://apexpremiereleague.in"
  },
  icons: {
    icon: "/apl-logo.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
