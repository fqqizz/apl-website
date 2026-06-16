

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Users, Award, Shield } from "lucide-react";
import { motion } from "framer-motion";

type Player = {
  full_name: string;
  position: string;
  area: string;
};

export default function FoundingPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/apl/founding-wall")
      .then((r) => r.json())
      .then((data) => {
        setPlayers(data.players || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="pb-24 bg-[#0a1628] text-white min-h-screen">
      <PageHeader
        label="FOUNDING PLAYERS"
        title="THE FOUNDING WALL"
        description="Meet the official verified roster of athletes secured for APL Season One."
      />

      <div className="container-apl mt-12 max-w-4xl px-4">
        {loading ? (
          <div className="text-center py-12 text-apl-text-muted animate-pulse">
            Loading founding roster...
          </div>
        ) : players.length === 0 ? (
          <div className="glass-card p-12 text-center border border-apl-border">
            <Users className="mx-auto text-apl-text-muted mb-4" size={40} />
            <h3 className="text-lg font-semibold text-white">No Players Registered Yet</h3>
            <p className="mt-2 text-sm text-apl-text-secondary">Be among the first to secure your Player ID and join the wall.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {players.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.8) }}
                className="glass-card p-5 border border-apl-border bg-gradient-to-br from-apl-navy-mid to-transparent relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Shield size={24} className="text-apl-blue-bright" />
                </div>
                <h3 className="text-base font-bold text-white tracking-wide truncate">{p.full_name}</h3>
                <p className="mt-1 text-xs text-apl-text-secondary font-medium tracking-wider uppercase">{p.position}</p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-apl-gold">
                  <Award size={12} />
                  <span>{p.area}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
