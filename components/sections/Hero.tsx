"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MOTION } from "@/lib/motion";
import { useIntroReady } from "@/components/layout/IntroProvider";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import MarqueeStrip from "@/components/features/MarqueeStrip";

const headline = ["KASHMIR'S", "FOOTBALL", "MOVEMENT", "STARTS HERE."];
const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const introReady = useIntroReady();

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
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease }}
          >
            <SectionLabel className="justify-center">APEX PREMIER LEAGUE · SEASON ONE</SectionLabel>
          </motion.div>

          <h1 className="mt-8 max-w-4xl">
            {headline.map((word, i) => (
              <motion.span
                key={word}
                initial={MOTION.heroReveal.initial}
                animate={introReady ? MOTION.heroReveal.animate : MOTION.heroReveal.initial}
                transition={{
                  ...MOTION.heroReveal.transition,
                  delay: introReady ? 0.08 + i * 0.07 : 0
                }}
                className="text-display-xl block text-apl-white"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: introReady ? 0.38 : 0, duration: 0.6, ease }}
            className="mt-6 max-w-2xl text-body-lg text-apl-text-secondary"
          >
            The first structured football league from the valley — 16 franchises, 288 players, one founding season.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: introReady ? 0.48 : 0, duration: 0.6, ease }}
            className="mt-8 flex flex-wrap items-center justify-center gap-2"
          >
            <Button href="/register/player">Join as Player</Button>
            <Button href="/register/franchise" variant="secondary">
              Own a Franchise
            </Button>
            <Button href="/status" variant="ghost">
              Check Application
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={introReady ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: introReady ? 0.55 : 0, duration: 0.5, ease }}
        >
          <MarqueeStrip />
        </motion.div>

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
