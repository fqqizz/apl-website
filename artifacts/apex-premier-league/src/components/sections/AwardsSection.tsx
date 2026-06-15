import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

const mainAwards = [
  { name: "Champions Trophy", desc: "Season One champions" },
  { name: "Runner-Up Trophy", desc: "Finalist recognition" },
  { name: "Golden Boot", desc: "Top scorer of the season" },
  { name: "Golden Glove", desc: "Best goalkeeper" },
  { name: "Player of the Tournament", desc: "Season's outstanding performer" },
  { name: "Young Player Award", desc: "Best emerging talent" }
];

const secondaryAwards = [
  "Best Defender",
  "Best Midfielder",
  "Best Forward",
  "Best Coach",
  "Goal of the Season",
  "Fans' Player of the Season",
  "Fair Play Award",
  "Most Improved Player"
];

export default function AwardsSection() {
  return (
    <section className="section-pad" style={{ background: "var(--apl-navy-mid)" }}>
      <div className="container-apl">
        <motion.div {...MOTION.sectionEnter} className="text-center mb-16">
          <p
            className="text-label"
            style={{ color: "var(--apl-gold)", letterSpacing: "0.2em" }}
          >
            AWARDS & RECOGNITION
          </p>
          <h2
            className="text-display-md mt-4"
            style={{ color: "white" }}
          >
            What You Can Win
          </h2>
          <p
            className="mt-4 text-body-lg max-w-lg mx-auto"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            Season One recognises excellence across every position, every role, and every moment.
          </p>
        </motion.div>

        <motion.div
          {...MOTION.staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {mainAwards.map((award) => (
            <motion.div
              key={award.name}
              {...MOTION.staggerChild}
              className="group relative overflow-hidden rounded-2xl p-6"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "border-color 0.3s ease, background 0.3s ease"
              }}
              whileHover={{
                borderColor: "rgba(212,175,55,0.3)",
                background: "rgba(255,255,255,0.05)"
              }}
            >
              <div
                className="mb-3 h-px w-8"
                style={{ background: "var(--apl-gold)", opacity: 0.7 }}
              />
              <h3
                className="text-body-md font-semibold"
                style={{ color: "white", letterSpacing: "0.01em" }}
              >
                {award.name}
              </h3>
              <p
                className="mt-1.5 text-body-md"
                style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.82rem" }}
              >
                {award.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-8 flex flex-wrap gap-2.5 justify-center"
        >
          {secondaryAwards.map((award) => (
            <span
              key={award}
              className="px-4 py-2 rounded-full text-label"
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.5)",
                letterSpacing: "0.08em",
                fontSize: "0.7rem"
              }}
            >
              {award}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
