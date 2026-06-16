"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useIntroComplete } from "@/components/layout/IntroProvider";

export default function IntroAnimation() {
  const completeIntro = useIntroComplete();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tRelease = window.setTimeout(() => {
      completeIntro();
    }, 2400);
    const tHide = window.setTimeout(() => setVisible(false), 2850);

    return () => {
      window.clearTimeout(tRelease);
      window.clearTimeout(tHide);
    };
  }, [completeIntro]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[200] flex select-none flex-col items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(17,17,17,0.08)_0%,rgba(255,255,255,0)_46%)]" />
          <motion.div
            className="relative flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="relative overflow-hidden rounded-[28px]"
              animate={{ scale: [1, 1.018, 1], opacity: [0.92, 1, 0.98] }}
              transition={{ duration: 2.35, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-y-0 -left-1/2 z-10 w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/75 to-transparent blur-sm"
                initial={{ x: "-90%" }}
                animate={{ x: "340%" }}
                transition={{ delay: 0.72, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
              <Image
                src="/apl-logo.png"
                alt="APL Logo"
                width={148}
                height={148}
                priority
                className="h-28 w-auto object-contain md:h-36"
              />
            </motion.div>
            <motion.p
              className="mt-8 text-[11px] font-medium uppercase tracking-[0.32em] text-[#111111]/45"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              Apex Premier League
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
