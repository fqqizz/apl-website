"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const INTRO_KEY = "apl-intro-seen";

export default function IntroAnimation() {
  const [phase, setPhase] = useState<"logo" | "line1" | "line2" | "done">("logo");
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(INTRO_KEY)) {
      setPhase("done");
      return;
    }
    setShow(true);
    const t1 = window.setTimeout(() => setPhase("line1"), 500);
    const t2 = window.setTimeout(() => setPhase("line2"), 1100);
    const t3 = window.setTimeout(() => {
      sessionStorage.setItem(INTRO_KEY, "1");
      setPhase("done");
    }, 1900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-apl-navy"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image src="/apl-logo.png" alt="APL" width={80} height={80} className="h-16 w-auto md:h-20" priority />
          </motion.div>
          <AnimatePresence mode="wait">
            {phase !== "logo" && (
              <motion.p
                key="l1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6 text-label text-apl-text-secondary"
              >
                Apex Premier League
              </motion.p>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {phase === "line2" && (
              <motion.p
                key="l2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-body-md text-apl-gold"
              >
                Kashmir&apos;s Football Movement
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
