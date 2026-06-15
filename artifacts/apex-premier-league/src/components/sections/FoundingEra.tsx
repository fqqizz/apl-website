import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import FoundingEraStats from "@/components/features/FoundingEraStats";
import Button from "@/components/ui/Button";

export default function FoundingEra() {
  return (
    <section
      className="section-pad relative overflow-hidden"
      style={{ background: "var(--apl-navy-mid)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 80% 50%, rgba(212,175,55,0.04) 0%, transparent 65%)"
        }}
      />
      <div className="container-apl relative z-10">
        <motion.div {...MOTION.sectionEnter}>
          <p
            className="text-label"
            style={{ color: "var(--apl-gold)", letterSpacing: "0.2em" }}
          >
            FOUNDING ERA
          </p>
          <h2
            className="text-display-md mt-5 max-w-2xl"
            style={{ color: "white" }}
          >
            The first ones in will be remembered.
          </h2>

          <div className="mt-12">
            <FoundingEraStats />
          </div>

          <p
            className="mt-10 max-w-xl text-body-lg"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Founding players receive permanent recognition. Founding franchise owners get priority placement. The first season of APL will not be repeated.
          </p>

          <div className="mt-8">
            <Button href="/register/player">Secure Your Spot</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
