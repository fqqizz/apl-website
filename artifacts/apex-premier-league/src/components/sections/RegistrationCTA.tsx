import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import Button from "@/components/ui/Button";

export default function RegistrationCTA() {
  return (
    <section className="section-pad" style={{ background: "var(--apl-navy)" }}>
      <div className="container-apl">
        <motion.div {...MOTION.sectionEnter} className="text-center mb-12">
          <p
            className="text-label"
            style={{ color: "var(--apl-gold)", letterSpacing: "0.2em" }}
          >
            GET INVOLVED
          </p>
          <h2
            className="text-display-md mt-4"
            style={{ color: "white" }}
          >
            Two Paths. One League.
          </h2>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 max-w-4xl mx-auto">
          <motion.div
            {...MOTION.sectionEnter}
            className="relative overflow-hidden rounded-2xl p-8 flex flex-col"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <p
              className="text-label"
              style={{ color: "var(--apl-gold)", letterSpacing: "0.2em" }}
            >
              FOR PLAYERS
            </p>
            <h3
              className="text-display-md mt-5 max-w-xs"
              style={{ color: "white" }}
            >
              Your official APL debut starts here.
            </h3>
            <p
              className="mt-4 text-body-md flex-1"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Join as a founding player. Get your Player ID. Compete in Season One.
            </p>
            <div className="mt-8">
              <Button href="/register/player">Register as Player</Button>
            </div>
          </motion.div>

          <motion.div
            {...MOTION.sectionEnter}
            transition={{ ...MOTION.sectionEnter.transition, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl p-8 flex flex-col"
            style={{
              background: "rgba(212,175,55,0.04)",
              border: "1px solid rgba(212,175,55,0.15)"
            }}
          >
            <p
              className="text-label"
              style={{ color: "var(--apl-gold)", letterSpacing: "0.2em" }}
            >
              FOR FRANCHISE OWNERS
            </p>
            <h3
              className="text-display-md mt-5 max-w-xs"
              style={{ color: "white" }}
            >
              Own Kashmir's next great football club.
            </h3>
            <p
              className="mt-4 text-body-md flex-1"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              Franchise ownership is limited. Founding spots include exclusive benefits.
            </p>
            <div className="mt-8">
              <Button href="/register/franchise">Explore Franchise Ownership</Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
