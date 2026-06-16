import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIntroComplete } from "@/components/layout/IntroProvider";

export default function IntroAnimation() {
  const completeIntro = useIntroComplete();
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");
  const [logoIn, setLogoIn] = useState(false);
  const [textIn, setTextIn] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.current.push(id);
    };
    t(() => setLogoIn(true), 80);
    t(() => setTextIn(true), 980);
    t(() => { setPhase("exit"); completeIntro(); }, 2600);
    t(() => setPhase("done"), 3150);
    return () => timers.current.forEach(clearTimeout);
  }, [completeIntro]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none pointer-events-none"
      style={{ background: "#ffffff" }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 38% at 50% 52%, rgba(7,17,29,0.055) 0%, transparent 70%)"
        }}
      />

      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {logoIn && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ type: "spring", stiffness: 120, damping: 24, mass: 0.9 }}
              className="relative"
              style={{ borderRadius: 8, willChange: "transform, opacity, filter", transform: "translateZ(0)" }}
            >
              <img
                src="/apl-logo.png"
                alt="APL"
                width={120}
                height={120}
                className="h-[112px] w-auto block"
                draggable={false}
              />

            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {textIn && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 22, mass: 0.8 }}
              className="mt-8 flex flex-col items-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ type: "spring", stiffness: 90, damping: 20 }}
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.58rem",
                  fontWeight: 500,
                  letterSpacing: "0.34em",
                  color: "rgba(7,17,29,0.55)",
                  textTransform: "uppercase"
                }}
              >
                APEX PREMIER LEAGUE
              </motion.p>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
