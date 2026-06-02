"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const categories = [
  {
    title: "Player FAQ",
    items: [
      ["How do I register?", "Visit /register/player, complete the form, and pay ₹249 via secure checkout."],
      ["When do I get my Player ID?", "After payment verification and APL committee review — check /status with your ID."],
      ["Can I play if I'm not from Baramulla?", "Yes. APL welcomes players from across Kashmir."]
    ]
  },
  {
    title: "Franchise FAQ",
    items: [
      ["How many franchises are there?", "Season One has a limited number of official franchise spots."],
      ["What is the approval process?", "Applications are reviewed manually by the APL committee for fit and commitment."],
      ["Can I add branding later?", "Yes. Optional details can be submitted after initial approval."]
    ]
  },
  {
    title: "General FAQ",
    items: [
      ["When does Season One begin?", "Fixture details are announced to registered participants."],
      ["Is the fee refundable?", "See /refund-policy for official refund terms."],
      ["Who do I contact for help?", "Call +91 8491900407 or use Apex AI on any page."]
    ]
  }
] as const;

export default function FAQAccordion() {
  const [openKey, setOpenKey] = useState<string | null>("0-0");

  return (
    <div className="space-y-10">
      {categories.map((cat, ci) => (
        <div key={cat.title}>
          <h2 className="text-label text-apl-gold">{cat.title}</h2>
          <div className="mt-4 space-y-2">
            {cat.items.map(([q, a], qi) => {
              const key = `${ci}-${qi}`;
              const open = openKey === key;
              return (
                <div key={key} className="glass-card overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenKey(open ? null : key)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="text-body-md text-apl-white">{q}</span>
                    <ChevronDown size={18} className={`shrink-0 transition ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && <p className="border-t border-apl px-5 pb-5 text-body-md text-apl-text-secondary">{a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
