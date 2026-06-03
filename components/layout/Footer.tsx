import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Vision", href: "/vision" },
  { label: "Founding Players", href: "/founding-players" },
  { label: "Founding Franchises", href: "/founding-franchises" },
  { label: "Partners", href: "/partners" },
  { label: "Player Registration", href: "/register/player" },
  { label: "Franchise Ownership", href: "/register/franchise" },
  { label: "Status Checker", href: "/status" },
  { label: "Contact", href: "/contact" }
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" }
];

export default function Footer() {
  return (
    <footer className="relative border-t border-apl bg-apl-navy">
      <div className="section-gradient-overlay pointer-events-none absolute inset-0" />
      <div className="container-apl relative section-pad !pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image src="/apl-logo.png" alt="Apex Premier League" width={56} height={56} className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-body-md text-apl-text-secondary">
              The home of Kashmiri football. Season One — built for players, franchises, and the valley.
            </p>
            <div className="mt-4 flex gap-4 text-xs">
              <a href="https://www.instagram.com/apexpremiereleague/" target="_blank" rel="noopener noreferrer" className="text-apl-text-muted hover:text-white transition">Instagram</a>
              <a href="https://www.facebook.com/profile.php?id=61590707155897" target="_blank" rel="noopener noreferrer" className="text-apl-text-muted hover:text-white transition">Facebook</a>
            </div>
          </div>
          <div className="lg:col-span-2">
            <p className="text-label text-apl-text-muted">Quick Links</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
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
            <p className="mt-6 text-label text-apl-text-muted">Community</p>
            <a 
              href="https://chat.whatsapp.com/HkftiaGm5GS3Kk4eYyrlUF" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 block text-body-md text-apl-blue hover:text-apl-blue-bright font-semibold"
            >
              Join Community (WhatsApp) →
            </a>
            <p className="mt-4 text-label text-apl-text-muted">Contact</p>
            <a href="tel:+918491900407" className="mt-2 block text-body-md text-apl-text-secondary hover:text-white">
              +91 8491900407
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-apl pt-8 md:flex-row text-xs text-apl-text-muted">
          <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
            <p>© 2025 Apex Premier League · All Rights Reserved</p>
            <p className="text-apl-gold font-medium">Founded by Faaiz Qureshi</p>
          </div>
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
