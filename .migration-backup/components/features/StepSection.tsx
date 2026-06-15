"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MOTION } from "@/lib/motion";
import SectionLabel from "@/components/ui/SectionLabel";

export type Step = {
  step: number;
  title: string;
  body: string;
  image: string;
};

export default function StepSection({ steps }: { steps: Step[] }) {
  return (
    <section className="section-pad bg-apl-navy">
      <div className="container-apl">
        <SectionLabel gold={false}>HOW IT WORKS</SectionLabel>
        <div className="mt-14 space-y-24">
          {steps.map((step, index) => {
            const flip = index % 2 === 1;
            return (
              <motion.div
                key={step.step}
                {...MOTION.sectionEnter}
                className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${flip ? "lg:[&>*:first-child]:order-2" : ""}`}
              >
                <div className="space-y-4">
                  <p className="text-label text-apl-blue">Step {step.step}</p>
                  <h3 className="text-display-md text-apl-white">{step.title}</h3>
                  <p className="max-w-lg text-body-lg text-apl-text-secondary">{step.body}</p>
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-apl">
                  <Image src={step.image} alt={step.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-apl-navy/50 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
