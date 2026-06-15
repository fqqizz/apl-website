type SectionLabelProps = {
  children: React.ReactNode;
  gold?: boolean;
  light?: boolean;
  className?: string;
};

export default function SectionLabel({ children, gold = true, light, className = "" }: SectionLabelProps) {
  const color = gold ? "text-apl-gold" : light ? "text-apl-text-secondary" : "text-apl-blue";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className={`accent-line shrink-0 ${gold ? "" : "opacity-80"}`} />
      <p className={`text-label ${color}`}>{children}</p>
    </div>
  );
}
