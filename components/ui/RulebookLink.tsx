import { Download } from "lucide-react";
import { RULEBOOK_URL } from "@/lib/apl-constants";

export default function RulebookLink({ className = "" }: { className?: string }) {
  return (
    <a
      href={RULEBOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-secondary inline-flex ${className}`}
    >
      <Download size={16} />
      Download Rulebook
    </a>
  );
}
