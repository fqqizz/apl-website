"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";

const faqs = [
  {
    q: "How long does registration take?",
    a: "Applications are reviewed within a few business days after payment and document verification."
  },
  {
    q: "Can I register from outside Baramulla?",
    a: "Yes. APL welcomes players from across Kashmir who meet league standards."
  },
  {
    q: "Is the registration fee refundable?",
    a: "See our refund policy for details on eligible cases and committee review."
  }
];

export default function FAQPreview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="section-pad bg-apl-navy">
      <div className="container-apl max-w-3xl">
        <motion.div {...MOTION.sectionEnter}>
          <SectionLabel gold={false}>FAQ</SectionLabel>
          <h2 className="text-display-md mt-6 text-apl-white">Common questions</h2>
          <div className="mt-8 space-y-2">
            {faqs.map((item, i) => (
              <div key={item.q} className="glass-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-body-md text-apl-white">{item.q}</span>
                  <ChevronDown size={18} className={`shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
                </button>
                {open === i && <p className="border-t border-apl px-5 pb-5 pt-0 text-body-md text-apl-text-secondary">{item.a}</p>}
              </div>
            ))}
          </div>
          <Link href="/faq" className="mt-6 inline-block text-body-md text-apl-blue hover:text-apl-blue-bright">
            See all FAQs →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
