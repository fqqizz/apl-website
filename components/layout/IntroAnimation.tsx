"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useIntroComplete } from "@/components/layout/IntroProvider";

const easeIn = [0.22, 1, 0.36, 1] as const;
const easeOut = [0.4, 0, 0.2, 1] as const;

/**
 * Premium intro splash — deep charcoal backdrop with radial spotlight,
 * logo fade-in with subtle scale, tagline reveal, then smooth exit.
 * Total duration: ~2.8 seconds.
 */
export default function IntroAnimation() {
  const completeIntro = useIntroComplete();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const release = window.setTimeout(() => {
      completeIntro();
    }, 2200);

    const hide = window.setTimeout(() => {
      setVisible(false);
    }, 2800);

    return () => {
      window.clearTimeout(release);
      window.clearTimeout(hide);
    };
  }, [completeIntro]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-splash fixed inset-0 z-[200] flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          aria-hidden={!visible}
        >
          {/* Particle dust layer */}
          <div className="intro-splash-dust pointer-events-none absolute inset-0" aria-hidden />

          {/* Radial spotlight glow */}
          <motion.div
            className="intro-splash-glow pointer-events-none absolute inset-0"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: easeIn }}
            aria-hidden
          />

          {/* Secondary ambient glow ring */}
          <motion.div
            className="intro-splash-ambient pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: easeIn, delay: 0.2 }}
            aria-hidden
          />

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 1.2, ease: easeIn, delay: 0.3 }}
            className="relative z-10"
          >
            <Image
              src="/apl-logo.png"
              alt="Apex Premier League"
              width={160}
              height={160}
              priority
              className="intro-splash-logo h-28 w-auto md:h-36"
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="intro-splash-tagline relative z-10 mt-6 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: easeIn, delay: 0.9 }}
          >
            Kashmir&apos;s Football Movement
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
