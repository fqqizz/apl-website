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
        className="object-cover opacity-25 mix-blend-luminosity"
        sizes="100vw"
        aria-hidden
      />
      <div className="hero-gradient absolute inset-0 bg-apl-navy-mid/90" />
      <div className="container-apl relative z-10 max-w-3xl text-center">
        <motion.div {...MOTION.sectionEnter}>
          <SectionLabel className="justify-center">THE REASON</SectionLabel>
          <h2 className="text-display-lg mt-8 text-apl-white">
            &ldquo;There was no league.
            <br />
            So we built one.&rdquo;
          </h2>
          <p className="mt-8 text-body-lg text-apl-text-secondary">
            APL was built because Kashmir&apos;s football community deserved more than informal tournaments. It deserved a
            structure, an identity, and a future. That future is Season One.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
