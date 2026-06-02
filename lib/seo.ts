import type { Metadata } from "next";

export const SITE_URL = "https://apexpremiereleague.in";
export const SITE_NAME = "Apex Premier League";

export const DEFAULT_KEYWORDS = [
  "Apex Premier League",
  "APL Kashmir",
  "Football League Kashmir",
  "Football League Baramulla",
  "Football Registration Kashmir",
  "Football Franchise Kashmir",
  "Kashmiri Football League",
  "Football Opportunities Kashmir",
  "Youth Football Kashmir",
  "North Kashmir Football"
];

type PageMeta = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
};

export function createMetadata({
  title,
  description,
  path,
  ogImage = "/og/home.jpg",
  keywords = DEFAULT_KEYWORDS
}: PageMeta): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage]
    },
    robots: { index: true, follow: true },
    icons: { icon: "/apl-logo.png" }
  };
}
