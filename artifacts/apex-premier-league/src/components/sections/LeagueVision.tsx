

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
          <div className="mt-10 max-w-3xl space-y-6">
            <p className="text-body-lg" style={{ color: "#3d4f66" }}>
              Kashmir has never lacked football talent. What it has lacked is a long-term structure capable of connecting
              players, franchises, competition, visibility, and opportunity under one professional ecosystem.
            </p>
            <p className="text-body-lg" style={{ color: "#3d4f66" }}>
              Apex Premier League was created with a simple vision: to build a platform where talented footballers can
              compete, grow, gain recognition, and become part of something larger than a single tournament.
            </p>
            <p className="text-body-lg" style={{ color: "#3d4f66" }}>
              The goal is not merely to organize matches. The goal is to contribute to a stronger football culture,
              create sustainable opportunities for young players, and establish a competitive league model that can
              continue evolving season after season.
            </p>
            <p className="text-body-lg font-medium" style={{ color: "#1a2b42" }}>
              Season One is only the beginning.
            </p>
          </div>
          <Divider />
        </motion.div>
      </div>
    </section>
  );
}
