import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Apex Premier League | Kashmir Football League",
  description:
    "Apex Premier League (APL) is a premium football league platform from Kashmir focused on football culture, competition, youth talent, and professional league experiences.",
  keywords: [
    "Apex Premier League",
    "APL Football",
    "Kashmir Football",
    "Baramulla Football",
    "Football League Kashmir",
    "Football Tournament Baramulla"
  ],
  metadataBase: new URL("https://apexpremiereleague.in"),
  openGraph: {
    title: "Apex Premier League",
    description: "Kashmir's Premier Football Competition.",
    url: "https://apexpremiereleague.in",
    siteName: "APL",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630
      }
    ]
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
