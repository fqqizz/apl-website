import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";

const stats = [
  { value: "16",  suffix: "",      label: "Franchise Teams" },
  { value: "288", suffix: "+",     label: "Registered Players" },
  { value: "83",  suffix: "",      label: "Scheduled Matches" },
  { value: "12",  suffix: " Wk",   label: "Season Duration" },
  { value: "₹5L", suffix: "",      label: "Prize Pool" },
  { value: "83",  suffix: "",      label: "Man of the Match Awards" }
];

export default function LeagueStats() {
  return (
    <section className="section-pad" style={{ background: "var(--apl-navy)" }}>
      <div className="container-apl">

        <motion.div {...MOTION.sectionEnter} className="text-center mb-16">
          <p
            className="text-label"
            style={{ color: "var(--apl-gold)", letterSpacing: "0.22em" }}
          >
            BY THE NUMBERS
          </p>
          <h2
            className="text-display-md mt-4"
            style={{ color: "var(--apl-white)", lineHeight: 1.04 }}
          >
            Season One at a Glance
          </h2>
        </motion.div>

        <motion.div
          {...MOTION.staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "20px",
            overflow: "hidden"
          }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...MOTION.staggerChild}
              className="flex flex-col items-center justify-center text-center px-6 py-10 md:px-10 md:py-12 relative"
              style={{
                borderRight: (i % 2 !== 1 && i % 3 !== 2) ? "1px solid rgba(255,255,255,0.06)" : undefined,
                borderBottom: i < stats.length - (stats.length % 2 === 0 ? 2 : 1) ? "1px solid rgba(255,255,255,0.06)" : undefined
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display), Impact, sans-serif",
                  fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                  color: "var(--apl-white)"
                }}
              >
                {stat.value}
                {stat.suffix && (
                  <span
                    style={{
                      fontSize: "clamp(1rem, 1.8vw, 1.6rem)",
                      color: "var(--apl-gold)",
                      fontFamily: "var(--font-body), sans-serif",
                      fontWeight: 300,
                      letterSpacing: "0.01em"
                    }}
                  >
                    {stat.suffix}
                  </span>
                )}
              </p>
              <p
                className="mt-2 text-label"
                style={{
                  color: "rgba(255,255,255,0.38)",
                  letterSpacing: "0.12em",
                  fontSize: "0.68rem"
                }}
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
