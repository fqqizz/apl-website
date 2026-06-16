import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

export default function LeagueVision() {
  return (
    <section id="vision" className="section-pad" style={{ background: "#ffffff" }}>
      <div className="container-apl">
        <motion.div {...MOTION.sectionEnter}>
          <p
            className="text-label"
            style={{ color: "var(--apl-gold)", letterSpacing: "0.2em" }}
          >
            THE MISSION
          </p>

          <h2
            className="text-display-md mt-5 max-w-3xl"
            style={{ color: "var(--apl-navy)", lineHeight: 1.05 }}
          >
            Football deserves better.
            <br />
            So does Kashmir.
          </h2>

          <div
            className="mt-2 h-px w-14"
            style={{ background: "var(--apl-gold)" }}
          />

          <div className="mt-10 max-w-2xl space-y-6">
            <p className="text-body-lg" style={{ color: "#3d4f66" }}>
              Kashmir has never lacked football talent. What it has lacked is a long-term structure capable of
              connecting players, franchises, competition, visibility, and opportunity under one professional ecosystem.
            </p>
            <p className="text-body-lg" style={{ color: "#3d4f66" }}>
              Apex Premier League was created with a simple vision: to build a platform where talented footballers
              can compete, grow, gain recognition, and become part of something larger than a single tournament.
            </p>
            <p
              className="text-body-lg font-semibold"
              style={{ color: "var(--apl-navy)" }}
            >
              Season One is only the beginning.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
