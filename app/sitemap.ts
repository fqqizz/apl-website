import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/register/player", priority: 0.95, changeFrequency: "weekly" },
  { path: "/register/franchise", priority: 0.95, changeFrequency: "weekly" },
  { path: "/status", priority: 0.9, changeFrequency: "weekly" },
  { path: "/about", priority: 0.85, changeFrequency: "monthly" },
  { path: "/vision", priority: 0.85, changeFrequency: "monthly" },
  { path: "/founding-players", priority: 0.85, changeFrequency: "monthly" },
  { path: "/franchises", priority: 0.85, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  { path: "/refund-policy", priority: 0.5, changeFrequency: "yearly" }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority
  }));
}
