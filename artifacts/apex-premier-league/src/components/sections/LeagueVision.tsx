import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

export default function LeagueVision() {
  return (
    <section id="vision" className="section-pad" style={{ background: "#ffffff" }}>
      <div className="container-apl">
        <div className="grid gap-16 md:grid-cols-[1fr_1fr] md:gap-20 lg:gap-28 items-start">

          {/* Left — editorial headline block */}
          <motion.div {...MOTION.sectionEnter}>
            <p
              className="text-label"
              style={{ color: "var(--apl-gold)", letterSpacing: "0.22em" }}
            >
              THE MISSION
            </p>

            <h2
              className="text-display-md mt-5"
              style={{
                color: "var(--apl-navy)",
                lineHeight: 1.04,
                maxWidth: "22ch"
              }}
            >
              Football deserves better.
              <br />
              So does Kashmir.
            </h2>

            <div
              className="mt-4"
              style={{ width: "40px", height: "2px", background: "var(--apl-gold)", borderRadius: "2px" }}
            />

            <p
              className="mt-8 text-body-lg"
              style={{ color: "#3d4f66", maxWidth: "42ch" }}
            >
              Season One is only the beginning. APL is the long-term structure Kashmir&apos;s football has been waiting for.
            </p>
          </motion.div>

          {/* Right — two prose paragraphs */}
          <motion.div
            {...MOTION.sectionEnter}
            transition={{ ...MOTION.sectionEnter.transition, delay: 0.12 }}
            className="space-y-7"
            style={{ paddingTop: "clamp(0px, 3vw, 2.5rem)" }}
          >
            <p className="text-body-lg" style={{ color: "#3d4f66" }}>
              Kashmir has never lacked football talent. What it has lacked is a long-term structure capable of
              connecting players, franchises, competition, visibility, and opportunity under one professional ecosystem.
            </p>
            <p className="text-body-lg" style={{ color: "#3d4f66" }}>
              Apex Premier League was created with a simple vision: to build a platform where talented footballers
              can compete, grow, gain recognition, and become part of something larger than a single tournament.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="/about"
                className="text-label transition-colors"
                style={{
                  color: "var(--apl-navy)",
                  letterSpacing: "0.1em",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                  fontSize: "0.78rem"
                }}
              >
                Our Story →
              </a>
              <a
                href="/vision"
                className="text-label transition-colors"
                style={{
                  color: "var(--apl-navy)",
                  letterSpacing: "0.1em",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                  fontSize: "0.78rem",
                  opacity: 0.55
                }}
              >
                Full Vision →
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
