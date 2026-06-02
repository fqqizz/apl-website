"use client";

import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassCard from "@/components/ui/GlassCard";

const cards = [
  {
    label: "STRUCTURED PLAY",
    title: "A real league format",
    body: "Official franchises, player registrations, competitive matches. A real league format — not a tournament."
  },
  {
    label: "PLAYER FIRST",
    title: "Your football identity",
    body: "Every registered player gets a unique Player ID. Your football identity. Official. Permanent."
  },
  {
    label: "FRANCHISE OWNERSHIP",
    title: "Own the history",
    body: "Own a piece of Kashmiri football history. Founding franchise spots are limited and exclusive."
  }
];

export default function Standards() {
  return (
    <section className="section-pad bg-apl-navy">
      <div className="container-apl">
        <motion.div {...MOTION.sectionEnter}>
          <SectionLabel gold={false}>APL STANDARDS</SectionLabel>
        </motion.div>
        <motion.div {...MOTION.staggerContainer} className="mt-12 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <motion.div key={card.label} {...MOTION.staggerChild}>
              <GlassCard>
                <div className="accent-line mb-4" />
                <p className="text-label text-apl-gold">{card.label}</p>
                <h3 className="text-display-md mt-4 text-apl-white">{card.title}</h3>
                <p className="mt-3 text-body-md text-apl-text-secondary">{card.body}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
