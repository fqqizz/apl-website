

import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";
import GlassCard from "@/components/ui/GlassCard";
import RulebookLink from "@/components/ui/RulebookLink";

const cards = [
  {
    label: "STRUCTURED PLAY",
    title: "A real league format",
    body: "Official franchises, player registrations, and competitive fixtures — a season built for football, not a one-off tournament."
  },
  {
    label: "PLAYER FIRST",
    title: "Your football identity",
    body: "Every registered player receives a unique Player ID — your official APL identity for status, selection, and league records."
  },
  {
    label: "FRANCHISE OWNERSHIP",
    title: "Own the history",
    body: "Founding franchise spots are limited. Owners build club identity, squads, and matchday presence within APL standards."
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
        <motion.div {...MOTION.sectionEnter} className="mt-14 flex flex-col items-center text-center">
          <p className="text-body-md text-apl-text-secondary">Official regulations for Season One</p>
          <RulebookLink className="mt-5" label="Download Official Rulebook" />
        </motion.div>
      </div>
    </section>
  );
}
