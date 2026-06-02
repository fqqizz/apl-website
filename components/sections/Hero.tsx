"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MOTION } from "@/lib/motion";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import MarqueeStrip from "@/components/features/MarqueeStrip";
import RulebookLink from "@/components/ui/RulebookLink";

const headline = ["KASHMIR'S", "FOOTBALL", "MOVEMENT", "STARTS HERE."];

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <div className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero-action.png"
          alt="Football action"
          fill
          priority
          className="object-cover mix-blend-luminosity"
          sizes="100vw"
        />
        <div className="hero-gradient absolute inset-0" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <div className="container-apl flex flex-1 flex-col items-center justify-center px-4 pb-32 pt-28 text-center md:pt-32">
          <SectionLabel className="justify-center">APEX PREMIER LEAGUE · SEASON ONE</SectionLabel>

          <h1 className="mt-8 max-w-4xl">
            {headline.map((word, i) => (
              <motion.span
                key={word}
                initial={MOTION.heroReveal.initial}
                animate={MOTION.heroReveal.animate}
                transition={{ ...MOTION.heroReveal.transition, delay: 0.15 + i * 0.08 }}
                className="text-display-xl block text-apl-white"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-2xl text-body-lg text-apl-text-secondary"
          >
            The first structured football league from the valley — 16 franchises, 288 players, one founding season.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <Button href="/register/player">Join as Player</Button>
            <Button href="/register/franchise" variant="secondary">
              Own a Franchise
            </Button>
            <Button href="/status" variant="ghost">
              Check Application
            </Button>
            <RulebookLink />
          </motion.div>
        </div>

        <MarqueeStrip />

        <a
          href="#vision"
          className="absolute bottom-24 left-1/2 -translate-x-1/2 text-apl-text-muted motion-safe:animate-bounce-subtle"
          aria-label="Scroll down"
        >
          <ChevronDown size={22} />
        </a>
      </div>
    </section>
  );
}
