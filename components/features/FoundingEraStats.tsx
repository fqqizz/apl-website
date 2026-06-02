"use client";

import { useEffect, useState } from "react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function FoundingEraStats() {
  const [stats, setStats] = useState({ players: 0, franchises: 0 });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => undefined);
  }, []);

  return (
    <div className="grid gap-8 sm:grid-cols-3">
      <div>
        <AnimatedCounter value={stats.players || 0} />
        <p className="mt-2 text-label text-apl-text-muted">Registered Players</p>
      </div>
      <div>
        <AnimatedCounter value={stats.franchises || 0} />
        <p className="mt-2 text-label text-apl-text-muted">Franchise Applications</p>
      </div>
      <div>
        <AnimatedCounter value={1} />
        <p className="mt-2 text-label text-apl-text-muted">Season Starting</p>
      </div>
    </div>
  );
}
