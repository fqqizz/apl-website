"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_CATEGORIES } from "@/lib/faq-content";
import RulebookLink from "@/components/ui/RulebookLink";

export default function FAQAccordion({ showRulebook = false }: { showRulebook?: boolean }) {
  const [openKey, setOpenKey] = useState<string | null>("0-0");

  return (
    <div className="space-y-10">
      {showRulebook && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-apl bg-apl-glass p-5">
          <div>
            <p className="text-body-md text-apl-white">Official APL Rulebook</p>
            <p className="mt-1 text-body-md text-apl-text-secondary">Format, eligibility, conduct, and league policies.</p>
          </div>
          <RulebookLink />
        </div>
      )}
      {FAQ_CATEGORIES.map((cat, ci) => (
        <div key={cat.title}>
          <h2 className="text-label text-apl-gold">{cat.title}</h2>
          <div className="mt-4 space-y-2">
            {cat.items.map((item, qi) => {
              const key = `${ci}-${qi}`;
              const open = openKey === key;
              return (
                <div key={key} className="glass-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenKey(open ? null : key)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="text-body-md text-apl-white">{item.q}</span>
                    <ChevronDown size={18} className={`shrink-0 transition ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && <p className="border-t border-apl px-5 pb-5 text-body-md leading-relaxed text-apl-text-secondary">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
