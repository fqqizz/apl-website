"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";

export type Step = {
  number: string;
  title: string;
  body: string;
  image: string;
};

export default function StepSection({ steps }: { steps: Step[] }) {
  return (
    <section className="section-pad bg-apl-navy">
      <div className="container-apl">
        <SectionLabel gold={false}>HOW IT WORKS</SectionLabel>
        <div className="mt-16 space-y-20">
          {steps.map((step, index) => {
            const fromLeft = index % 2 === 0;
            return (
              <motion.div
                key={step.number}
                {...MOTION.sectionEnter}
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${fromLeft ? "" : "lg:[&>*:first-child]:order-2"}`}
              >
                <div className="relative">
                  <span className="pointer-events-none absolute -left-2 -top-8 text-display-xl text-apl-white/10 md:-left-4">
                    {step.number}
                  </span>
                  <div className="accent-line mb-4" />
                  <h3 className="text-display-md text-apl-white">{step.title}</h3>
                  <p className="mt-4 max-w-lg text-body-lg text-apl-text-secondary">{step.body}</p>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-apl">
                  <Image src={step.image} alt={step.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-apl-navy/60 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
