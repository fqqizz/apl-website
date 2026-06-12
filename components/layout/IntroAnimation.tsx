"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useIntroComplete } from "@/components/layout/IntroProvider";

export default function IntroAnimation() {
  const completeIntro = useIntroComplete();
  const [step, setStep] = useState(0); // 0: pinhole circle, 1: expanding frame, 2: logo, 3: text, 4: bloom, 5: exit
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Timeline animation states
    const tCircle = window.setTimeout(() => setStep(1), 400); // Step 1: 0–0.4s
    const tLogo = window.setTimeout(() => setStep(2), 1000);   // Step 2: 0.4–1.0s, Step 3: 1.0–1.6s
    const tText = window.setTimeout(() => setStep(3), 1600);   // Step 4: 1.6–2.2s
    const tBloom = window.setTimeout(() => setStep(4), 2200);  // Step 5: 2.2–2.8s
    const tRelease = window.setTimeout(() => {
      setStep(5);
      completeIntro();
    }, 2800); // Step 6: 2.8–3.2s
    const tHide = window.setTimeout(() => setVisible(false), 3200);

    return () => {
      window.clearTimeout(tCircle);
      window.clearTimeout(tLogo);
      window.clearTimeout(tText);
      window.clearTimeout(tBloom);
      window.clearTimeout(tRelease);
      window.clearTimeout(tHide);
    };
  }, [completeIntro]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {step < 5 && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#000000] select-none pointer-events-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative flex items-center justify-center w-full h-full">
            {step === 0 && (
              <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: [0.1, 1.2, 1], opacity: [0, 1, 0.8] }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-4 h-4 rounded-full border border-apl-blue shadow-[0_0_15px_rgba(26,107,255,0.8)]"
              />
            )}

            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="relative flex flex-col items-center justify-center p-8 overflow-visible"
              >
                {/* Full screen viewport soft glow to prevent boundaries */}
                <div 
                  className="fixed inset-0 pointer-events-none opacity-20 filter blur-[140px] bg-[radial-gradient(circle_at_center,rgba(26,107,255,0.45)_0%,transparent_60%)]" 
                />

                {/* Step 5: Full viewport electric blue pulse */}
                <AnimatePresence>
                  {step >= 4 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="fixed inset-0 pointer-events-none filter blur-[150px] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.5)_0%,transparent_65%)]"
                    />
                  )}
                </AnimatePresence>

                {/* Step 3: Fully saturated original Navy APL logo */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <AnimatePresence>
                    {step >= 2 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8"
                      >
                        <Image
                          src="/apl-logo.png"
                          alt="APL Logo"
                          width={140}
                          height={140}
                          priority
                          className="h-28 w-auto mix-blend-normal object-contain filter-none"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step 4: RISE ABOVE brand statement text */}
                  <div className="flex flex-col items-center text-center">
                    {step >= 3 && (
                      <>
                        <motion.span
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                          className="text-white block font-display tracking-[0.15em] font-extrabold uppercase leading-none"
                          style={{
                            fontSize: "clamp(50px, 9vw, 80px)",
                            fontFamily: "var(--font-display), Impact, Anton, sans-serif"
                          }}
                        >
                          RISE
                        </motion.span>
                        <motion.span
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                          className="text-white block font-display tracking-[0.15em] font-extrabold uppercase leading-none mt-1"
                          style={{
                            fontSize: "clamp(50px, 9vw, 80px)",
                            fontFamily: "var(--font-display), Impact, Anton, sans-serif"
                          }}
                        >
                          ABOVE.
                        </motion.span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
