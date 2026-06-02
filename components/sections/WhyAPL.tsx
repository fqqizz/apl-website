"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";

export default function WhyAPL() {
  return (
    <section className="relative overflow-hidden section-pad">
      <Image
        src="/images/editorial-dribble.png"
        alt=""
        fill
        className="object-cover opacity-20 mix-blend-luminosity"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-apl-navy-mid/92" />
      <div className="container-apl relative z-10 max-w-3xl">
        <motion.div {...MOTION.sectionEnter}>
          <SectionLabel className="justify-center">WHY APL EXISTS</SectionLabel>
          <h2 className="text-display-lg mt-6 text-center text-apl-white">Why APL Exists</h2>
          <p className="mt-4 text-center text-body-lg text-apl-gold">
            Building Structure For Kashmiri Football
          </p>
          <div className="mt-10 space-y-6 text-center">
            <p className="text-body-lg text-apl-text-secondary">
              Kashmir has never lacked football talent.
            </p>
            <p className="text-body-lg text-apl-text-secondary">
              What it has lacked is structure, visibility, long-term planning, and a unified competitive ecosystem.
            </p>
            <p className="text-body-lg text-apl-text-secondary">
              APL was created to connect players, franchises, competition, media, and opportunity under one
              professional platform.
            </p>
            <p className="text-label text-apl-gold">Season One is the first chapter of a much larger vision.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
