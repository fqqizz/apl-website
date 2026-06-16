import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata, createNoIndexMetadata, SEO_PAGES } from "@/lib/seo";

export const metadata: Metadata = {
  ...createMetadata(SEO_PAGES.notFound),
  ...createNoIndexMetadata(SEO_PAGES.notFound.title, SEO_PAGES.notFound.description)
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-apl-navy px-4 text-center text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(212,175,55,0.14),transparent_34%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(255,255,255,0.08),transparent)]" />
      <div className="relative z-10">
        <MotionBall />
      </div>
      <p className="relative z-10 text-sm font-medium uppercase tracking-[0.32em] text-apl-gold">404</p>
      <h1 className="relative z-10 mt-5 max-w-3xl text-display-md">Looks like this page missed the penalty.</h1>
      <p className="relative z-10 mt-5 max-w-md text-body-lg text-apl-text-secondary">
        The match moved on, but you still have a clear path back into Apex Premier League.
      </p>
      <div className="relative z-10 mt-10 flex w-full max-w-sm flex-col justify-center gap-3 sm:max-w-none sm:flex-row">
        <Link href="/register/player" className="btn-primary">
          Register Now
        </Link>
        <Link href="/" className="btn-secondary">
          Go Home
        </Link>
      </div>
      <Image src="/apl-logo.png" alt="" width={48} height={48} className="relative z-10 mt-16 h-10 w-auto opacity-50" aria-hidden />
    </div>
  );
}

function MotionBall() {
  return (
    <div className="mb-8" aria-hidden>
      <svg width="88" height="88" viewBox="0 0 88 88" className="mx-auto drop-shadow-2xl">
        <circle cx="44" cy="44" r="38" fill="rgba(255,255,255,0.05)" stroke="rgba(212,175,55,0.25)" />
        <circle cx="44" cy="44" r="22" fill="white" stroke="#D4AF37" strokeWidth="2" />
        <path d="M44 23 L49 38 L44 35 L39 38 Z" fill="#111111" />
        <path d="M26 48 C35 56 53 56 62 48" fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
