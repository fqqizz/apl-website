import { Link } from 'wouter';

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" }
];

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Vision", href: "/vision" },
  { label: "Register as Player", href: "/register/player" },
  { label: "Franchise Ownership", href: "/register/franchise" },
  { label: "Check Status", href: "/status" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" }
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--apl-navy)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="container-apl py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <img src="/apl-logo.png" alt="Apex Premier League" width={52} height={52} className="h-11 w-auto" />
            <p
              className="mt-5 text-body-md max-w-xs"
              style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7 }}
            >
              Kashmir's first professional franchise football league.
            </p>
            <div className="mt-5 flex gap-5">
              <a
                href="https://www.instagram.com/apexpremiereleague/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-label transition-colors"
                style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61590707155897"
                target="_blank"
                rel="noopener noreferrer"
                className="text-label transition-colors"
                style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                Facebook
              </a>
            </div>
          </div>

          <div>
            <p className="text-label mb-5" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>Navigation</p>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-md transition-colors"
                    style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "white")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-label mb-5" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>Contact</p>
            <div className="space-y-3">
              <a
                href="tel:+918491900407"
                className="block text-body-md transition-colors"
                style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              >
                +91 8491900407
              </a>
              <a
                href="mailto:contact@apexpremiereleague.in"
                className="block text-body-md transition-colors"
                style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.88rem" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              >
                contact@apexpremiereleague.in
              </a>
              <a
                href="https://chat.whatsapp.com/HkftiaGm5GS3Kk4eYyrlUF"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-label transition-colors"
                style={{ color: "var(--apl-gold)", letterSpacing: "0.08em", fontSize: "0.72rem" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                WhatsApp Community →
              </a>
            </div>

            <div className="mt-8">
              <p className="text-label mb-4" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em" }}>Legal</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {legalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-label transition-colors"
                    style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", letterSpacing: "0.08em" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
            © 2025 Apex Premier League · All Rights Reserved
          </p>
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
