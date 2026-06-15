"use client";

import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

export default function RegistrationCTA() {
  return (
    <section className="section-pad bg-apl-navy-mid">
      <div className="container-apl grid gap-6 md:grid-cols-2">
        <motion.div {...MOTION.sectionEnter}>
          <GlassCard>
            <p className="text-label text-apl-gold">FOR PLAYERS</p>
            <h3 className="text-display-md mt-4 text-apl-white">Your official APL debut starts with registration.</h3>
            <p className="mt-4 text-body-md text-apl-text-secondary">
              Join as a founding player. Get your Player ID. Compete in Season One.
            </p>
            <div className="mt-6">
              <Button href="/register/player">Register as Player</Button>
            </div>
          </GlassCard>
        </motion.div>
        <motion.div {...MOTION.sectionEnter} transition={{ ...MOTION.sectionEnter.transition, delay: 0.1 }}>
          <GlassCard>
            <p className="text-label text-apl-gold">FOR FRANCHISE OWNERS</p>
            <h3 className="text-display-md mt-4 text-apl-white">Own Kashmir&apos;s next great football club.</h3>
            <p className="mt-4 text-body-md text-apl-text-secondary">
              Franchise ownership is limited. Founding spots include exclusive benefits.
            </p>
            <div className="mt-6">
              <Button href="/register/franchise">Explore Franchise Ownership</Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
