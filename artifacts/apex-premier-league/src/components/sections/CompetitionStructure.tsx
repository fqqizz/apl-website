import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

const phases = [
  {
    number: "01",
    name: "Group Stage",
    description: "16 franchise teams split into groups. Round-robin fixtures determine who advances to the next phase.",
    detail: "Round Robin"
  },
  {
    number: "02",
    name: "Elite League Phase",
    description: "Top teams from the group stage compete in an elevated format. Every point matters at this stage.",
    detail: "Points Table"
  },
  {
    number: "03",
    name: "Playoffs",
    description: "The best teams clash in high-stakes knockout rounds. One loss and your season is over.",
    detail: "Knockout"
  },
  {
    number: "04",
    name: "Grand Final",
    description: "Two franchises. One trophy. Season One's champion earns a permanent place in APL history.",
    detail: "Championship"
  }
];

export default function CompetitionStructure() {
  return (
    <section className="section-pad" style={{ background: "var(--apl-navy)" }}>
      <div className="container-apl">
        <motion.div {...MOTION.sectionEnter} className="mb-16">
          <p
            className="text-label"
            style={{ color: "var(--apl-gold)", letterSpacing: "0.2em" }}
          >
            COMPETITION FORMAT
          </p>
          <h2
            className="text-display-md mt-4 max-w-xl"
            style={{ color: "white" }}
          >
            How the Season Unfolds
          </h2>
          <p
            className="mt-4 text-body-lg max-w-lg"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            A structured 12-week competition designed for the highest level of competitive football in Kashmir.
          </p>
        </motion.div>

        <div className="relative">
          <div
            className="hidden md:block absolute left-[calc(50%-0.5px)] top-0 bottom-0 w-px"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.3) 10%, rgba(212,175,55,0.3) 90%, transparent)" }}
          />

          <div className="space-y-6 md:space-y-0">
            {phases.map((phase, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={phase.name}
                  initial={{ opacity: 0, x: isLeft ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                  className={`relative md:grid md:grid-cols-2 md:gap-16 md:items-center ${
                    i > 0 ? "md:mt-12" : ""
                  }`}
                >
                  <div className={`${isLeft ? "md:text-right md:order-1" : "md:order-2"} mb-4 md:mb-0`}>
                    <div
                      className={`flex items-center gap-3 mb-3 ${isLeft ? "md:justify-end" : ""}`}
                    >
                      <span
                        className="text-label"
                        style={{ color: "rgba(212,175,55,0.6)", letterSpacing: "0.15em" }}
                      >
                        {phase.detail}
                      </span>
                    </div>
                    <div
                      className="inline-block px-5 py-4 rounded-2xl"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.07)"
                      }}
                    >
                      <p
                        className="text-body-md font-medium"
                        style={{ color: "white" }}
                      >
                        {phase.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full z-10`}
                    style={{
                      background: "var(--apl-navy)",
                      border: "2px solid rgba(212,175,55,0.5)"
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display), sans-serif",
                        fontSize: "0.75rem",
                        color: "var(--apl-gold)",
                        letterSpacing: "0.05em"
                      }}
                    >
                      {phase.number}
                    </span>
                  </div>

                  <div className={`${isLeft ? "md:order-2" : "md:order-1 md:text-right"}`}>
                    <div className={`flex items-baseline gap-3 ${isLeft ? "" : "md:justify-end"}`}>
                      <span
                        style={{
                          fontFamily: "var(--font-display), sans-serif",
                          fontSize: "clamp(2rem, 4vw, 2.8rem)",
                          letterSpacing: "0.04em",
                          color: "rgba(255,255,255,0.12)"
                        }}
                      >
                        {phase.number}
                      </span>
                      <h3
                        className="text-display-md"
                        style={{ color: "white" }}
                      >
                        {phase.name}
                      </h3>
                    </div>
                    <div
                      className={`mt-1 h-px w-12 ${isLeft ? "" : "md:ml-auto"}`}
                      style={{ background: "var(--apl-gold)", opacity: 0.6 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
