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
          <div className="mt-8 space-y-6 text-center">
            <p className="text-body-xl text-apl-text-secondary">
              Kashmir has always produced football talent.
            </p>
            <p className="text-body-lg text-apl-text-secondary">
              What it lacked was structure, visibility, and a long-term ecosystem.
            </p>
            <p className="text-body-lg text-apl-text-secondary">
              APL was created to bring players, franchises, competition, media, and opportunity into one professionally
              managed platform.
            </p>
            <p className="text-label text-apl-gold">Season One is only the beginning.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
