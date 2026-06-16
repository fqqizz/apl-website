import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIntroComplete } from "@/components/layout/IntroProvider";

export default function IntroAnimation() {
  const completeIntro = useIntroComplete();
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");
  const [logoIn, setLogoIn] = useState(false);
  const [textIn, setTextIn] = useState(false);
  const [shineIn, setShineIn] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.current.push(id);
    };
    t(() => setLogoIn(true), 80);
    t(() => setShineIn(true), 900);
    t(() => setTextIn(true), 1020);
    t(() => { setPhase("exit"); completeIntro(); }, 2800);
    t(() => setPhase("done"), 3350);
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
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
              style={{ borderRadius: 8 }}
            >
              <img
                src="/apl-logo.png"
                alt="APL"
                width={120}
                height={120}
                className="h-[112px] w-auto block"
                draggable={false}
              />

              <AnimatePresence>
                {shineIn && (
                  <motion.div
                    key="shine"
                    initial={{ x: "-130%" }}
                    animate={{ x: "240%" }}
                    transition={{ duration: 1.05, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(105deg, transparent 22%, rgba(255,255,255,0.18) 38%, rgba(255,255,255,0.62) 50%, rgba(255,255,255,0.18) 62%, transparent 78%)",
                      mixBlendMode: "overlay",
                      pointerEvents: "none"
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {textIn && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-col items-center gap-3"
            >
              <motion.p
                initial={{ letterSpacing: "0.04em", opacity: 0 }}
                animate={{ letterSpacing: "0.34em", opacity: 1 }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.58rem",
                  fontWeight: 500,
                  color: "rgba(7,17,29,0.55)",
                  textTransform: "uppercase"
                }}
              >
                APEX PREMIER LEAGUE
              </motion.p>

              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: "28px",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.7), transparent)",
                  transformOrigin: "center"
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
