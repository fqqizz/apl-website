import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIntroComplete } from "@/components/layout/IntroProvider";

export default function IntroAnimation() {
  const completeIntro = useIntroComplete();
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const tText = window.setTimeout(() => setShowText(true), 650);
    const tExit = window.setTimeout(() => {
      setPhase("exit");
      completeIntro();
    }, 2000);
    const tDone = window.setTimeout(() => setPhase("done"), 2500);
    return () => {
      window.clearTimeout(tText);
      window.clearTimeout(tExit);
      window.clearTimeout(tDone);
    };
  }, [completeIntro]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white select-none pointer-events-none"
          animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 55% 35% at 50% 50%, rgba(0,0,0,0.05) 0%, transparent 70%)"
            }}
          />

          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src="/apl-logo.png"
                alt="APL"
                width={100}
                height={100}
                className="h-[88px] w-auto"
              />
            </motion.div>

            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-6 flex flex-col items-center gap-2"
                >
                  <p
                    style={{
                      fontFamily: "var(--font-body), sans-serif",
                      letterSpacing: "0.28em",
                      fontSize: "0.65rem",
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
                    transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: "32px", height: "1.5px", background: "#D4AF37", transformOrigin: "left" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
    </AnimatePresence>
  );
}
