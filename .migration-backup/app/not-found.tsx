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
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-b from-[#eef2f9] to-white px-4 text-center text-apl-navy">
      <MotionBall />
      <p className="text-display-lg text-apl-blue">404</p>
      <h1 className="mt-4 text-display-md">Looks Like You&apos;re Offside</h1>
      <p className="mt-4 max-w-md text-body-lg text-apl-text-muted">
        The page you are looking for doesn&apos;t exist or may have been moved.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
        <Link href="/register/player" className="btn-secondary !border-apl-navy/25 !text-apl-navy">
          Register as Player
        </Link>
        <Link href="/register/franchise" className="btn-secondary !border-apl-navy/25 !text-apl-navy">
          Franchise Ownership
        </Link>
        <Link href="/status" className="btn-ghost !text-apl-navy">
          Check Application Status
        </Link>
      </div>
      <Image src="/apl-logo.png" alt="" width={48} height={48} className="mt-16 h-10 w-auto opacity-40" aria-hidden />
    </div>
  );
}

function MotionBall() {
  return (
    <div className="mb-8 motion-safe:animate-bounce-subtle" aria-hidden>
      <svg width="48" height="48" viewBox="0 0 64 64" className="mx-auto">
        <circle cx="32" cy="32" r="28" fill="#1A6BFF" opacity="0.15" />
        <circle cx="32" cy="32" r="18" fill="white" stroke="#0A1628" strokeWidth="2" />
        <path d="M32 14 L36 24 L32 22 L28 24 Z" fill="#1A6BFF" />
      </svg>
    </div>
  );
}
