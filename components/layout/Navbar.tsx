"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Vision", href: "/vision" },
  { label: "Franchises", href: "/franchises" },
  { label: "FAQ", href: "/faq" }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-apl bg-apl-navy/90 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="container-apl flex h-16 items-center justify-between md:h-[4.5rem]">
          <Link href="/" className="flex items-center gap-2" aria-label="Apex Premier League home">
            <Image src="/apl-logo.png" alt="Apex Premier League" width={48} height={48} priority className="h-9 w-auto" />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-label text-apl-text-secondary transition hover:text-apl-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button href="/status" variant="ghost">
              Check Status
            </Button>
            <Button href="/register/player">Register Now</Button>
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            className="grid size-11 place-items-center rounded-md border border-apl text-apl-text-secondary md:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-apl-navy/98 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center justify-between px-5 pt-5">
              <Image src="/apl-logo.png" alt="Apex Premier League" width={48} height={48} className="h-9 w-auto" />
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="grid size-11 place-items-center rounded-md border border-apl"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-5 pt-12">
              {navLinks.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 text-display-md text-apl-white"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8 flex flex-col gap-3">
                <Button href="/status" variant="secondary" className="w-full justify-center">
                  Check Status
                </Button>
                <Button href="/register/player" className="w-full justify-center">
                  Register Now
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
