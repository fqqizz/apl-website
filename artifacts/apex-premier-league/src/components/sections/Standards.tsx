import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
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
    <section className="section-pad" style={{ background: "var(--apl-navy)" }}>
      <div className="container-apl">
        <motion.div {...MOTION.sectionEnter} className="mb-12">
          <p
            className="text-label"
            style={{ color: "var(--apl-gold)", letterSpacing: "0.2em" }}
          >
            APL STANDARDS
          </p>
          <h2
            className="text-display-md mt-4 max-w-xl"
            style={{ color: "white" }}
          >
            Built on Principle
          </h2>
        </motion.div>

        <motion.div {...MOTION.staggerContainer} className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <motion.div
              key={card.label}
              {...MOTION.staggerChild}
              className="rounded-2xl p-7"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "border-color 0.3s ease, background 0.3s ease"
              }}
              whileHover={{
                borderColor: "rgba(212,175,55,0.25)",
                background: "rgba(255,255,255,0.05)"
              }}
            >
              <div
                className="mb-4 h-px w-8"
                style={{ background: "var(--apl-gold)", opacity: 0.8 }}
              />
              <p
                className="text-label"
                style={{ color: "var(--apl-gold)", letterSpacing: "0.15em", opacity: 0.7 }}
              >
                {card.label}
              </p>
              <h3
                className="text-display-md mt-4"
                style={{ color: "white" }}
              >
                {card.title}
              </h3>
              <p
                className="mt-3 text-body-md"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div {...MOTION.sectionEnter} className="mt-14 flex flex-col items-center text-center">
          <p className="text-body-md" style={{ color: "rgba(255,255,255,0.35)" }}>
            Official regulations for Season One
          </p>
          <RulebookLink className="mt-5" label="Download Official Rulebook" />
        </motion.div>
      </div>
    </section>
  );
}
