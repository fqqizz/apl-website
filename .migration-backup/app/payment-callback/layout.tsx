import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = createNoIndexMetadata(
  "Payment Processing | Apex Premier League",
  "Secure payment confirmation page for APL registration."
);

export default function PaymentCallbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
