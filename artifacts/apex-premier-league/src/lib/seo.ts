export const SITE_URL = "https://apexpremiereleague.in";
export const SITE_NAME = "Apex Premier League";

export const DEFAULT_KEYWORDS = [
  "Apex Premier League",
  "APL Kashmir",
  "Kashmir Football League",
  "Football League Kashmir",
  "Football League Baramulla",
  "Football Registration Kashmir",
  "Football Franchise Kashmir",
  "Kashmiri Football League",
  "Football Opportunities Kashmir",
  "Youth Football Kashmir",
  "North Kashmir Football"
];

/** Optimized titles and descriptions for priority pages */
export const SEO_PAGES = {
  home: {
    title: "Apex Premier League (APL) | Kashmir Football League",
    description:
      "Apex Premier League (APL) is Kashmir's franchise football league — 16 teams, 288 players, Season One. Register as a player, own a franchise, or check your application status.",
    path: "/",
    ogImage: "/og/home.jpg"
  },
  playerRegistration: {
    title: "Player Registration | Apex Premier League (APL)",
    description:
      "Register for APL Season One. Submit your details, pay the ₹249 registration fee securely, and receive your official Player ID for Kashmir's structured football league.",
    path: "/register/player",
    ogImage: "/og/home.jpg"
  },
  franchiseOwnership: {
    title: "Franchise Ownership | Apex Premier League (APL)",
    description:
      "Apply for APL franchise ownership in Season One. Limited founding spots across 16 franchises — build club identity and lead Kashmiri football's professional era.",
    path: "/register/franchise",
    ogImage: "/og/home.jpg"
  },
  statusChecker: {
    title: "Application Status Checker | Apex Premier League (APL)",
    description:
      "Check your APL player application status instantly using your official Player ID (APL-####). Track review progress for Season One registration.",
    path: "/status",
    ogImage: "/og/home.jpg"
  },
  about: {
    title: "About APL | Kashmir's Franchise Football League",
    description:
      "Learn about Apex Premier League — why APL was created, how it structures Kashmiri football, and what Season One means for players and franchises.",
    path: "/about",
    ogImage: "/og/home.jpg"
  },
  vision: {
    title: "Vision & Mission | Apex Premier League (APL)",
    description:
      "Explore APL's vision for Kashmiri football: structure, visibility, competitive opportunity, and a long-term ecosystem for players, franchises, and the valley.",
    path: "/vision",
    ogImage: "/og/home.jpg"
  },
  faq: {
    title: "FAQ | Player & Franchise Questions | APL",
    description:
      "Answers about APL player registration, ₹249 fees, Player IDs, franchise applications, Season One schedule, refunds, and league rules.",
    path: "/faq",
    ogImage: "/og/home.jpg"
  },
  contact: {
    title: "Contact APL | Registration & League Support",
    description:
      "Contact Apex Premier League for player registration, franchise ownership, and Season One enquiries. Phone, email, and contact form support.",
    path: "/contact",
    ogImage: "/og/home.jpg"
  },
  foundingPlayers: {
    title: "Founding Players | Apex Premier League Season One",
    description:
      "Join APL's founding player era. Official Player IDs, committee review, and a place in Kashmir's first structured franchise football league.",
    path: "/founding-players",
    ogImage: "/og/home.jpg"
  },
  franchises: {
    title: "APL Franchises | 16 Teams Season One",
    description:
      "Discover the APL franchise ecosystem — 16 founding clubs, ownership opportunities, and professional standards for Season One in Kashmir.",
    path: "/franchises",
    ogImage: "/og/home.jpg"
  },
  privacy: {
    title: "Privacy Policy | Apex Premier League",
    description:
      "Read how Apex Premier League collects, uses, and protects player and franchise registration data.",
    path: "/privacy",
    ogImage: "/og/home.jpg"
  },
  terms: {
    title: "Terms of Service | Apex Premier League",
    description:
      "Terms and conditions for participating in Apex Premier League as a player, franchise owner, or league partner.",
    path: "/terms",
    ogImage: "/og/home.jpg"
  },
  refundPolicy: {
    title: "Refund Policy | Apex Premier League",
    description:
      "Official APL refund policy for player registration fees and franchise payments, including duplicate payment and technical error cases.",
    path: "/refund-policy",
    ogImage: "/og/home.jpg"
  },
  notFound: {
    title: "Page Not Found | Apex Premier League",
    description: "The page you requested could not be found on the Apex Premier League website.",
    path: "/404",
    ogImage: "/og/home.jpg"
  }
} as const;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  keywords?: string[];
};

function absoluteAsset(path: string) {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

export function createMetadata({
  title,
  description,
  path,
  ogImage = "/og/home.jpg",
  keywords = DEFAULT_KEYWORDS
}: PageMeta) {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  const imageUrl = absoluteAsset(ogImage);

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
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${title} — ${SITE_NAME}` }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl]
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: { icon: "/apl-logo.png", apple: "/apl-logo.png" }
  };
}

/** Shared defaults for root layout — pages override title, description, and canonical */
export function createRootMetadata() {
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
      default: SEO_PAGES.home.title,
      template: "%s"
    },
    description: SEO_PAGES.home.description,
    keywords: DEFAULT_KEYWORDS,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: { icon: "/apl-logo.png", apple: "/apl-logo.png" },
    formatDetection: { telephone: true },
    openGraph: {
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website"
    },
    twitter: {
      card: "summary_large_image"
    }
  };
}

export function createNoIndexMetadata(title: string, description: string) {
  return {
    title,
    description,
    robots: { index: false, follow: false, googleBot: { index: false, follow: false } }
  };
}
