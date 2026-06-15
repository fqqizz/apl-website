import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

const stats = [
  { value: "16", suffix: "", label: "Franchise Teams" },
  { value: "288", suffix: "+", label: "Registered Players" },
  { value: "83", suffix: "", label: "Scheduled Matches" },
  { value: "12", suffix: " Wk", label: "Season Duration" },
  { value: "₹5L", suffix: "", label: "Prize Pool" },
  { value: "83", suffix: "", label: "Man of the Match Awards" }
];

export default function LeagueStats() {
  return (
    <section className="section-pad" style={{ background: "#F5F5F5" }}>
      <div className="container-apl">
        <motion.div {...MOTION.sectionEnter} className="text-center mb-14">
          <p
            className="text-label"
            style={{ color: "var(--apl-gold)", letterSpacing: "0.2em" }}
          >
            BY THE NUMBERS
          </p>
          <h2
            className="text-display-md mt-4"
            style={{ color: "var(--apl-navy)" }}
          >
            Season One at a Glance
          </h2>
        </motion.div>

        <motion.div
          {...MOTION.staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 gap-px"
          style={{ background: "rgba(7,17,29,0.08)", borderRadius: "16px", overflow: "hidden" }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              {...MOTION.staggerChild}
              className="flex flex-col items-center justify-center text-center px-8 py-10"
              style={{ background: "#F5F5F5" }}
            >
              <p
                className="font-display leading-none"
                style={{
                  fontFamily: "var(--font-display), Impact, sans-serif",
                  fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
                  letterSpacing: "0.02em",
                  color: "var(--apl-navy)"
                }}
              >
                {stat.value}
                <span
                  style={{
                    fontSize: "clamp(1.2rem, 2vw, 1.8rem)",
                    color: "var(--apl-gold)",
                    fontFamily: "var(--font-body), sans-serif",
                    fontWeight: 400
                  }}
                >
                  {stat.suffix}
                </span>
              </p>
              <p
                className="mt-2 text-label"
                style={{ color: "rgba(7,17,29,0.5)", letterSpacing: "0.1em" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
