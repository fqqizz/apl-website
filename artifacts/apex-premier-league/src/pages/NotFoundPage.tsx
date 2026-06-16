import { Link } from 'wouter';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--apl-navy)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center"
      >
        <div className="mb-8 select-none" aria-hidden>
          <PenaltyBall />
        </div>

        <p
          className="font-display"
          style={{
            fontFamily: "var(--font-display), Impact, sans-serif",
            fontSize: "clamp(5rem, 18vw, 12rem)",
            lineHeight: 0.9,
            letterSpacing: "0.04em",
            color: "rgba(255,255,255,0.06)"
          }}
        >
          404
        </p>

        <h1
          className="mt-5 font-display"
          style={{
            fontFamily: "var(--font-display), Impact, sans-serif",
            fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
            letterSpacing: "0.04em",
            color: "white"
          }}
        >
          PAGE MISSED THE PENALTY.
        </h1>

        <p
          className="mt-4 max-w-sm text-body-lg"
          style={{ color: "rgba(255,255,255,0.4)", fontWeight: 300 }}
        >
          This page doesn't exist — but APL Season One does. Don't miss your spot.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <Link
            href="/register/player"
            className="btn-primary w-full sm:w-auto text-center"
          >
            Register Now
          </Link>
          <Link
            href="/"
            className="btn-secondary w-full sm:w-auto text-center"
          >
            Go Home
          </Link>
        </div>

        <div className="mt-12">
          <img
            src="/apl-logo.png"
            alt="APL"
            width={40}
            height={40}
            className="h-9 w-auto mx-auto"
            style={{ opacity: 0.2 }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function PenaltyBall() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="mx-auto">
      <circle cx="32" cy="32" r="28" fill="white" opacity="0.06" />
      <circle cx="32" cy="32" r="20" fill="white" opacity="0.08" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="7" fill="white" opacity="0.9" />
      <path d="M32 12 L36 24 L32 21 L28 24 Z" fill="rgba(212,175,55,0.7)" />
    </svg>
  );
}
