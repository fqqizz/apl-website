import { CONTACT_EMAIL, CONTACT_PHONE, LEAGUE, SITE_URL } from "@/lib/apl-constants";
import { FAQ_CATEGORIES } from "@/lib/faq-content";
import { SITE_NAME } from "@/lib/seo";

export const ORG_ID = `${SITE_URL}/#organization`;
export const SPORTS_ORG_ID = `${SITE_URL}/#sportsorganization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationSchema = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: "APL",
  url: SITE_URL,
  logo: `${SITE_URL}/apl-logo.png`,
  image: `${SITE_URL}/og/home.jpg`,
  description:
    "Apex Premier League (APL) is Kashmir's franchise-based professional football league connecting players, franchises, and competitive opportunity.",
  email: CONTACT_EMAIL,
  telephone: CONTACT_PHONE.replace(/\s/g, ""),
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Jammu and Kashmir, India"
  },
  sameAs: ["https://www.instagram.com/upsurge.ai/"]
};

export const sportsOrganizationSchema = {
  "@type": "SportsOrganization",
  "@id": SPORTS_ORG_ID,
  name: SITE_NAME,
  alternateName: "APL",
  url: SITE_URL,
  sport: "Football",
  description: "Franchise-based football league in Kashmir with 16 franchises and 288 registered players for Season One.",
  location: {
    "@type": "Place",
    name: LEAGUE.location,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Baramulla",
      addressRegion: "Jammu and Kashmir",
      addressCountry: "IN"
    }
  },
  parentOrganization: { "@id": ORG_ID }
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: "Official website of Apex Premier League — player registration, franchise ownership, and Season One updates.",
  inLanguage: "en-IN",
  publisher: { "@id": ORG_ID }
};

export function globalSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, sportsOrganizationSchema, websiteSchema]
  };
}

type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.path === "/" ? SITE_URL : `${SITE_URL}${crumb.path}`
    }))
  };
}

export function pageBreadcrumb(pageName: string, path: string) {
  return breadcrumbSchema([
    { name: "Home", path: "/" },
    { name: pageName, path }
  ]);
}

export function faqPageSchema() {
  const mainEntity = FAQ_CATEGORIES.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a
      }
    }))
  );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity
  };
}

export function contactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Apex Premier League",
    url: `${SITE_URL}/contact`,
    description: "Contact APL for player registration, franchise ownership, and league support.",
    mainEntity: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: SITE_URL,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: CONTACT_PHONE.replace(/\s/g, ""),
          email: CONTACT_EMAIL,
          availableLanguage: ["English", "Hindi", "Urdu"],
          areaServed: "IN"
        }
      ]
    }
  };
}
