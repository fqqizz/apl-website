export default function ApexMascot({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <circle cx="32" cy="32" r="30" fill="#1A6BFF" opacity="0.12" />
      <circle cx="32" cy="34" r="18" fill="#0A1628" />
      <circle cx="26" cy="30" r="2.5" fill="#fff" />
      <circle cx="38" cy="30" r="2.5" fill="#fff" />
      <path d="M26 38 Q32 42 38 38" stroke="#1A6BFF" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M32 8 L36 18 L32 16 L28 18 Z" fill="#1A6BFF" />
      <circle cx="32" cy="52" r="6" fill="#fff" stroke="#0A1628" strokeWidth="1.5" />
      <path d="M28 52 L32 48 L36 52" stroke="#0A1628" strokeWidth="1" fill="none" />
    </svg>
  );
}
