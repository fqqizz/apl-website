"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MOTION } from "@/lib/motion";
import { useIntroReady } from "@/components/layout/IntroProvider";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import MarqueeStrip from "@/components/features/MarqueeStrip";

const headline = ["BUILDING THE", "FUTURE OF", "FOOTBALL IN", "NORTH KASHMIR"];
const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const introReady = useIntroReady();

  return (
    <section className="relative min-h-[92dvh] overflow-hidden md:min-h-[100dvh]">
      <div className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero-action.png"
          alt="Football player striking the ball during a competitive match"
          fill
          priority
          className="scale-[1.02] object-cover object-[45%_center]"
          sizes="100vw"
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(212,175,55,0.16),transparent_34%)]" />
      </div>

      <div className="relative z-10 flex min-h-[92dvh] flex-col md:min-h-[100dvh]">
        <div className="container-apl flex flex-1 flex-col items-start justify-center px-4 pb-24 pt-28 text-left md:pb-28 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.5, ease }}
          >
            <SectionLabel>APEX PREMIER LEAGUE / SEASON ONE</SectionLabel>
          </motion.div>

          <h1 className="mt-6 max-w-5xl md:mt-8">
            {headline.map((word, i) => (
              <motion.span
                key={word}
                initial={MOTION.heroReveal.initial}
                animate={introReady ? MOTION.heroReveal.animate : MOTION.heroReveal.initial}
                transition={{
                  ...MOTION.heroReveal.transition,
                  delay: introReady ? 0.08 + i * 0.07 : 0
                }}
                className="hero-headline block text-apl-white"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: introReady ? 0.38 : 0, duration: 0.6, ease }}
            className="mt-5 max-w-xl text-base leading-7 text-white/80 md:mt-6 md:text-lg"
          >
            A franchise-based football ecosystem bringing together players, communities, and businesses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: introReady ? 0.48 : 0, duration: 0.6, ease }}
            className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center"
          >
            <Button href="/register/player" className="w-full justify-center text-sm font-semibold sm:w-auto">
              Register Now
              <ArrowRight size={16} />
            </Button>
            <Button href="/franchises" variant="secondary" className="w-full justify-center text-sm font-semibold sm:w-auto">
              Explore Franchises
            </Button>
            <Button href="/status" variant="ghost" className="w-full justify-center text-xs opacity-90 sm:w-auto">
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
