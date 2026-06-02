import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Vision", href: "/vision" },
  { label: "Register", href: "/register/player" },
  { label: "Status", href: "/status" },
  { label: "FAQ", href: "/faq" }
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" }
];

export default function Footer() {
  return (
    <footer className="relative border-t border-apl bg-apl-navy">
      <div className="section-gradient-overlay absolute inset-0 pointer-events-none" />
      <div className="container-apl relative section-pad !pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/apl-logo.png" alt="Apex Premier League" width={56} height={56} className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-body-md text-apl-text-secondary">
              The home of Kashmiri football. Season One — built for players, franchises, and the valley.
            </p>
          </div>
          <div>
            <p className="text-label text-apl-text-muted">Quick Links</p>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-md text-apl-text-secondary hover:text-apl-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-label text-apl-text-muted">Legal</p>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-body-md text-apl-text-secondary hover:text-apl-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-label text-apl-text-muted">Contact</p>
            <a href="tel:+918491900407" className="mt-4 block text-body-md text-apl-blue hover:text-apl-blue-bright">
              +91 8491900407
            </a>
            <Link href="/contact" className="mt-2 block text-body-md text-apl-text-secondary hover:text-apl-white">
              Contact form →
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-apl pt-8 md:flex-row">
          <p className="text-body-md text-apl-text-muted">© 2025 Apex Premier League · All Rights Reserved</p>
          <a
            href="https://www.instagram.com/upsurge.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="upsurge-credit"
          >
            Built by Upsurge
          </a>
        </div>
      </div>
    </footer>
  );
}
