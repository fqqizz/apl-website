"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Vision", href: "/vision" },
  { label: "Players", href: "/founding-players" },
  { label: "Franchises", href: "/franchises" },
  { label: "Status", href: "/status" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
        <div
          className={`navbar-glass mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-2 transition-all duration-300 md:px-4 md:py-2.5 ${
            scrolled ? "navbar-glass-scrolled" : ""
          }`}
        >
          <Link href="/" className="shrink-0 pl-1" aria-label="Apex Premier League home">
            <Image src="/apl-logo.png" alt="APL" width={40} height={40} priority className="h-8 w-auto md:h-9" />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link-float">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <Link href="/register/franchise" className="btn-nav-secondary">
              Franchise Ownership
            </Link>
            <Link href="/register/player" className="btn-nav-primary">
              Register
            </Link>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-full border border-white/10 text-apl-text-secondary lg:hidden"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-apl-navy/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-5 pt-6">
              <Image src="/apl-logo.png" alt="APL" width={40} height={40} className="h-8 w-auto" />
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close" className="grid size-10 place-items-center rounded-full border border-apl">
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col px-5 pt-8">
              {navLinks.map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="block border-b border-apl py-4 text-lg text-apl-white">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8 flex flex-col gap-2">
                <Link href="/register/franchise" onClick={() => setMenuOpen(false)} className="btn-secondary w-full justify-center">
                  Franchise Ownership
                </Link>
                <Link href="/register/player" onClick={() => setMenuOpen(false)} className="btn-primary w-full justify-center">
                  Register
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
