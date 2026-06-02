"use client";

import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";
import Divider from "@/components/ui/Divider";

export default function LeagueVision() {
  return (
    <section id="vision" className="section-pad bg-apl-off-white text-apl-navy">
      <div className="container-apl">
        <motion.div {...MOTION.sectionEnter}>
          <SectionLabel gold={false}>THE MISSION</SectionLabel>
          <h2 className="text-display-md mt-6 text-apl-navy">
            Football deserves better.
            <br />
            So does Kashmir.
          </h2>
          <div className="mt-8 max-w-3xl space-y-6">
            <p className="text-body-lg text-apl-text-muted" style={{ color: "#5a6a7e" }}>
              Kashmir has always had football. What it never had was infrastructure — a league that treated players like
              professionals, franchises like investments, and the sport like the culture it already is.
            </p>
            <p className="text-body-lg" style={{ color: "#5a6a7e" }}>
              APL changes that. One season at a time.
            </p>
          </div>
          <Divider />
        </motion.div>
      </div>
    </section>
  );
}
