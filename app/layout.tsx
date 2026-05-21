import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "APEX PREMIER LEAGUE | Rise Above.",
  description:
    "APEX PREMIER LEAGUE is a premium football culture platform built around franchises, players, media, and youth development.",
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
      <body>{children}</body>
    </html>
  );
}
