"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

type Phase = "logo" | "title" | "tagline" | "exit" | "done";

export default function IntroAnimation({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<Phase>("logo");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t1 = window.setTimeout(() => setPhase("title"), 700);
    const t2 = window.setTimeout(() => setPhase("tagline"), 1600);
    const t3 = window.setTimeout(() => setPhase("exit"), 2800);
    const t4 = window.setTimeout(() => {
      setVisible(false);
      setPhase("done");
      document.body.style.overflow = "";
      onComplete?.();
    }, 3600);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  if (phase === "done" && !visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="intro-cinematic fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden bg-apl-navy"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="intro-cinematic-vignette pointer-events-none absolute inset-0" aria-hidden />
          <motion.div
            initial={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.85, ease }}
            className="relative z-10"
          >
            <Image
              src="/apl-logo.png"
              alt="Apex Premier League"
              width={120}
              height={120}
              priority
              className="h-24 w-auto md:h-32"
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {(phase === "title" || phase === "tagline" || phase === "exit") && (
              <motion.h1
                key="title"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.65, ease }}
                className="intro-cinematic-title relative z-10 mt-10 text-center text-apl-white"
              >
                Apex Premier League
              </motion.h1>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {(phase === "tagline" || phase === "exit") && (
              <motion.p
                key="tag"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease }}
                className="intro-cinematic-tagline relative z-10 mt-4 text-center text-apl-gold"
              >
                Kashmir&apos;s Football Movement
              </motion.p>
            )}
          </AnimatePresence>

          {phase === "exit" && (
            <motion.div
              className="pointer-events-none absolute inset-0 bg-apl-navy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.55, ease }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
