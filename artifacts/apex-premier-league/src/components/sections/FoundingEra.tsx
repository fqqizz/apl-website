

import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";
import FoundingEraStats from "@/components/features/FoundingEraStats";
import Button from "@/components/ui/Button";

export default function FoundingEra() {
  return (
    <section className="section-pad bg-apl-navy">
      <div className="container-apl">
        <motion.div {...MOTION.sectionEnter}>
          <SectionLabel>FOUNDING ERA</SectionLabel>
          <h2 className="text-display-md mt-6 max-w-2xl text-apl-white">
            The first ones in
            <br />
            will be remembered.
          </h2>

          <div className="mt-12">
            <FoundingEraStats />
          </div>

          <p className="mt-10 max-w-2xl text-body-lg text-apl-text-secondary">
            Founding players receive permanent recognition. Founding franchise owners get placement. The first
            season of APL will not be repeated.
          </p>

          <div className="mt-8">
            <Button href="/register/player">Secure Your Spot</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
