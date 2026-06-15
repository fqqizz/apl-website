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
    t(() => setLogoIn(true), 60);
    t(() => setTextIn(true), 680);
    t(() => setShineIn(true), 1050);
    t(() => { setPhase("exit"); completeIntro(); }, 2500);
    t(() => setPhase("done"), 3000);
    return () => timers.current.forEach(clearTimeout);
  }, [completeIntro]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none pointer-events-none"
      style={{ background: "#ffffff" }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 52%, rgba(7,17,29,0.038) 0%, transparent 68%)"
        }}
      />

      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {logoIn && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.84, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
              style={{ borderRadius: 6 }}
            >
              <img
                src="/apl-logo.png"
                alt="APL"
                width={100}
                height={100}
                className="h-[82px] w-auto block"
                style={{ imageRendering: "crisp-edges" }}
              />
              <AnimatePresence>
                {shineIn && (
                  <motion.div
                    key="shine"
                    initial={{ x: "-110%" }}
                    animate={{ x: "220%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.37, 0, 0.63, 1] }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(92deg, transparent 18%, rgba(255,255,255,0.15) 38%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.15) 62%, transparent 80%)",
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 flex flex-col items-center gap-2.5"
            >
              <motion.p
                initial={{ letterSpacing: "0.06em", opacity: 0 }}
                animate={{ letterSpacing: "0.32em", opacity: 1 }}
                transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: "0.6rem",
                  fontWeight: 500,
                  color: "#07111D",
                  textTransform: "uppercase"
                }}
              >
                APEX PREMIER LEAGUE
              </motion.p>
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  width: "24px",
                  height: "1px",
                  background: "linear-gradient(90deg, transparent, #D4AF37, transparent)",
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
