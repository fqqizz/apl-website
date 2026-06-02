type BadgeVariant = "gold" | "blue" | "muted";

const styles: Record<BadgeVariant, string> = {
  gold: "bg-apl-gold-dim text-apl-gold border-apl-gold/30",
  blue: "bg-apl-blue-dim text-apl-blue border-apl-border-accent",
  muted: "bg-apl-glass text-apl-text-secondary border-apl-border"
};

export default function Badge({
  children,
  variant = "gold"
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-label ${styles[variant]}`}>
      {children}
    </span>
  );
}
