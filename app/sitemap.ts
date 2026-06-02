import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const routes = [
  "",
  "/register/player",
  "/register/franchise",
  "/status",
  "/about",
  "/vision",
  "/founding-players",
  "/franchises",
  "/contact",
  "/faq",
  "/privacy",
  "/terms",
  "/refund-policy"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.8
  }));
}
