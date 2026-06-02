"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MOTION } from "@/lib/motion";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import MarqueeStrip from "@/components/features/MarqueeStrip";

const headline = ["KASHMIR'S", "FOOTBALL", "MOVEMENT", "STARTS HERE."];

export default function Hero() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 180]);
  const textY = useTransform(scrollY, [0, 600], [0, 60]);

  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <Image
          src="/images/hero-action.png"
          alt="Football action"
          fill
          priority
          className="object-cover mix-blend-luminosity"
          sizes="100vw"
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="grain-overlay" />
      </motion.div>

      <motion.div style={{ y: textY }} className="relative z-10 flex min-h-[100dvh] flex-col">
        <div className="container-apl flex flex-1 flex-col items-center justify-center px-4 pb-32 pt-28 text-center md:pt-36">
          <SectionLabel className="justify-center">APEX PREMIER LEAGUE · SEASON ONE</SectionLabel>

          <h1 className="mt-8 max-w-4xl">
            {headline.map((word, i) => (
              <motion.span
                key={word}
                {...MOTION.heroReveal}
                transition={{ ...MOTION.heroReveal.transition, delay: i * 0.1 }}
                className="text-display-xl block text-apl-white"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl text-body-lg text-apl-text-secondary"
          >
            APL is the first structured football league from the valley — built for players who deserve a real stage,
            franchises built to last, and a community that believes football belongs here.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <Button href="/register/player">Join as Player</Button>
            <Button href="/register/franchise" variant="secondary">
              Own a Franchise
            </Button>
            <Button href="/status" variant="ghost">
              Check Application
            </Button>
            <Button href="/about" variant="ghost">
              Explore APL
            </Button>
          </motion.div>
        </div>

        <MarqueeStrip />

        <motion.a
          href="#vision"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-apl-text-muted"
          aria-label="Scroll down"
        >
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown size={24} />
          </motion.div>
        </motion.a>
      </motion.div>
    </section>
  );
}
