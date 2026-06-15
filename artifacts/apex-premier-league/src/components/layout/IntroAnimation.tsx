import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIntroComplete } from "@/components/layout/IntroProvider";

export default function IntroAnimation() {
  const completeIntro = useIntroComplete();
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [shineActive, setShineActive] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.current.push(id);
      return id;
    };

    t(() => setLogoVisible(true), 80);
    t(() => setShineActive(true), 950);
    t(() => setTextVisible(true), 700);
    t(() => {
      setPhase("exit");
      completeIntro();
    }, 2200);
    t(() => setPhase("done"), 2700);

    return () => timers.current.forEach(clearTimeout);
  }, [completeIntro]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white select-none pointer-events-none"
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 30% at 50% 50%, rgba(0,0,0,0.04) 0%, transparent 70%)"
        }}
      />

      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {logoVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="relative overflow-hidden"
              style={{ borderRadius: 8 }}
            >
              <img
                src="/apl-logo.png"
                alt="APL"
                width={100}
                height={100}
                className="h-[88px] w-auto block"
              />
              <AnimatePresence>
                {shineActive && (
                  <motion.div
                    key="shine"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                      duration: 0.7,
                      ease: [0.4, 0, 0.2, 1]
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.55) 50%, transparent 80%)",
                      pointerEvents: "none"
                    }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {textVisible && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 flex flex-col items-center gap-2"
            >
              <p
                style={{
                  fontFamily: "var(--font-body), sans-serif",
                  letterSpacing: "0.3em",
                  fontSize: "0.62rem",
                  fontWeight: 500,
                  color: "#07111D",
                  textTransform: "uppercase"
                }}
              >
                APEX PREMIER LEAGUE
              </p>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: 0.55,
                  delay: 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
                style={{
                  width: "28px",
                  height: "1.5px",
                  background: "#D4AF37",
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
