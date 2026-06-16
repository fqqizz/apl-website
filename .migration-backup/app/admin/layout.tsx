import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata(
  "Admin | Apex Premier League",
  "APL administration area — not indexed by search engines."
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
