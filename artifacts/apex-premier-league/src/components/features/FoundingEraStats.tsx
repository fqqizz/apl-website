

import { useEffect, useState } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function FoundingEraStats() {
  const [stats, setStats] = useState({ players: 0, franchises: 0 });

  useEffect(() => {
    fetch("/api/apl/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => undefined);
  }, []);

  return (
    <div className="grid gap-8 sm:grid-cols-3">
      <div>
        <div className="flex items-baseline gap-2">
          <AnimatedCounter value={stats.players || 0} />
          <span className="text-xl md:text-2xl font-light text-apl-text-secondary">/ 288</span>
        </div>
        <p className="mt-2 text-label text-apl-text-muted">Players Registered</p>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <AnimatedCounter value={stats.franchises || 0} />
          <span className="text-xl md:text-2xl font-light text-apl-text-secondary">/ 16</span>
        </div>
        <p className="mt-2 text-label text-apl-text-muted">Franchises Applied</p>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <AnimatedCounter value={1} />
        </div>
        <p className="mt-2 text-label text-apl-text-muted">Season Starting</p>
      </div>
    </div>
  );
}
