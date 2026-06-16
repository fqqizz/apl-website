import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { MOTION } from "@/lib/motion";
import { useIntroReady } from "@/components/layout/IntroProvider";
import Button from "@/components/ui/Button";
import SectionLabel from "@/components/ui/SectionLabel";
import MarqueeStrip from "@/components/features/MarqueeStrip";

const headline = ["BUILDING THE", "FUTURE OF", "FOOTBALL IN", "NORTH KASHMIR."];
const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const introReady = useIntroReady();

  return (
    <section className="relative overflow-hidden" style={{ minHeight: "100dvh" }}>
      <div className="absolute inset-0">
        <img
          src="/images/hero-football.jpg"
          alt="Football action"
          className="h-full w-full object-cover"
          style={{ objectPosition: "center 34%" }}
          fetchPriority="high"
          decoding="async"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(7,17,29,0.26) 0%, rgba(7,17,29,0.56) 34%, rgba(7,17,29,0.82) 68%, #07111D 100%)"
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 100%, rgba(212,175,55,0.05) 0%, transparent 65%)"
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col" style={{ minHeight: "100dvh" }}>
        <div
          className="container-apl flex flex-1 flex-col items-center justify-center px-5 text-center"
          style={{
            paddingTop: "clamp(5rem, 12vw, 8rem)",
            paddingBottom: "clamp(3rem, 7vw, 4.75rem)"
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: 0.5, ease }}
          >
            <SectionLabel className="justify-center">
              APEX PREMIER LEAGUE · SEASON ONE · NORTH KASHMIR
            </SectionLabel>
          </motion.div>

          <h1
            className="mt-4 max-w-4xl w-full"
            style={{ lineHeight: 0.88 }}
          >
            {headline.map((line, i) => (
              <motion.span
                key={line}
                initial={MOTION.heroReveal.initial}
                animate={introReady ? MOTION.heroReveal.animate : MOTION.heroReveal.initial}
                transition={{
                  ...MOTION.heroReveal.transition,
                  delay: introReady ? 0.06 + i * 0.065 : 0
                }}
                className="text-display-xl block text-apl-white"
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: introReady ? 0.36 : 0, duration: 0.65, ease }}
            className="mt-4 max-w-sm"
            style={{
              color: "rgba(255,255,255,0.48)",
              fontFamily: "var(--font-body), sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.875rem, 2.2vw, 1rem)",
              lineHeight: 1.75
            }}
          >
            The valley's football movement, built for players who are ready to be seen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={introReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ delay: introReady ? 0.48 : 0, duration: 0.6, ease }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-[280px] mx-auto sm:max-w-none sm:w-auto"
          >
            <Button href="/register/player" className="w-full sm:w-auto justify-center">
              Register Now
            </Button>
            <Button
              href="/register/franchise"
              variant="secondary"
              className="w-full sm:w-auto justify-center"
            >
              Explore Franchises
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={introReady ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: introReady ? 0.68 : 0, duration: 0.5, ease }}
            className="mt-4"
          >
            <a
              href="/status"
              style={{
                color: "rgba(255,255,255,0.26)",
                fontSize: "0.7rem",
                letterSpacing: "0.04em",
                fontFamily: "var(--font-body), sans-serif"
              }}
            >
              Already registered? Check your status →
            </a>
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={introReady ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: introReady ? 0.62 : 0, duration: 0.5, ease }}
        >
          <MarqueeStrip />
        </motion.div>

        <a
          href="#vision"
          className="absolute left-1/2 -translate-x-1/2 motion-safe:animate-bounce-subtle"
          style={{ bottom: "5.5rem", color: "rgba(255,255,255,0.22)" }}
          aria-label="Scroll down"
        >
          <ChevronDown size={18} />
        </a>
      </div>
    </section>
  );
}
