"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useIntroComplete } from "@/components/layout/IntroProvider";

const easeIn = [0.22, 1, 0.36, 1] as const;
const easeOut = [0.4, 0, 0.2, 1] as const;

/** Logo-only splash — one smooth cinematic beat, then fade out. */
export default function IntroAnimation() {
  const completeIntro = useIntroComplete();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const release = window.setTimeout(() => {
      completeIntro();
    }, 2000);

    const hide = window.setTimeout(() => {
      setVisible(false);
    }, 2600);

    return () => {
      window.clearTimeout(release);
      window.clearTimeout(hide);
    };
  }, [completeIntro]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-splash fixed inset-0 z-[200] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: easeOut }}
          aria-hidden={!visible}
        >
          <motion.div
            className="intro-splash-glow pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: easeIn }}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 1.15, ease: easeIn }}
            className="relative z-10"
          >
            <Image
              src="/apl-logo.png"
              alt="Apex Premier League"
              width={140}
              height={140}
              priority
              className="intro-splash-logo h-28 w-auto md:h-36"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
