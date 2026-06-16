import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
    // Logo appears first
    t(() => setLogoIn(true), 120);
    // Text reveals after logo settles
    t(() => setTextIn(true), 1050);
    // Hold, then exit
    t(() => { setPhase("exit"); completeIntro(); }, 2700);
    t(() => setPhase("done"), 3300);
    return () => timers.current.forEach(clearTimeout);
  }, [completeIntro]);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center select-none pointer-events-none overflow-hidden"
      style={{ background: "#ffffff" }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Subtle radial glow — dark centre, echoes the APL navy */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 44% at 50% 52%, rgba(7,17,29,0.07) 0%, transparent 72%)"
        }}
      />

      <div className="relative flex flex-col items-center gap-0">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.84, filter: "blur(10px)" }}
          animate={logoIn
            ? { opacity: 1, scale: 1, filter: "blur(0px)" }
            : { opacity: 0, scale: 0.84, filter: "blur(10px)" }}
          transition={{
            type: "spring",
            stiffness: 110,
            damping: 22,
            mass: 0.95
          }}
          style={{ willChange: "transform, opacity, filter", transform: "translateZ(0)" }}
        >
          <img
            src="/apl-logo.png"
            alt="Apex Premier League"
            width={128}
            height={128}
            className="h-28 w-auto block"
            draggable={false}
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
          animate={textIn
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 12, filter: "blur(6px)" }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 20,
            mass: 0.9
          }}
          className="mt-7 flex flex-col items-center gap-3"
          style={{ willChange: "transform, opacity, filter" }}
        >
          <p
            style={{
              fontFamily: "var(--font-display), Impact, sans-serif",
              fontSize: "clamp(1.1rem, 4vw, 1.45rem)",
              fontWeight: 400,
              letterSpacing: "0.28em",
              color: "rgba(7,17,29,0.82)",
              textTransform: "uppercase",
              lineHeight: 1
            }}
          >
            APEX PREMIER LEAGUE
          </p>
          <div
            style={{
              width: "32px",
              height: "1px",
              background: "rgba(7,17,29,0.12)",
              borderRadius: "0.5px"
            }}
          />
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: "0.7rem",
              fontWeight: 500,
              letterSpacing: "0.12em",
              color: "rgba(7,17,29,0.38)",
              textTransform: "uppercase"
            }}
          >
            RISE ABOVE.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
