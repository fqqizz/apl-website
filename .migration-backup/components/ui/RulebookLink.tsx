import { Download } from "lucide-react";
import { RULEBOOK_URL } from "@/lib/apl-constants";

export default function RulebookLink({
  className = "",
  label = "Download Rulebook"
}: {
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={RULEBOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-secondary inline-flex items-center gap-2 ${className}`}
    >
      <Download size={16} />
      {label}
    </a>
  );
}
