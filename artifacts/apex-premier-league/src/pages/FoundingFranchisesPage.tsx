

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import { Building2, ShieldCheck, MapPin } from "lucide-react";
import { motion } from "framer-motion";

type Franchise = {
  team_name: string | null;
  owner_name: string;
  team_area: string;
};

export default function FoundingFranchisesPage() {
  const [franchises, setFranchises] = useState<Franchise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/apl/founding-wall")
      .then((r) => r.json())
      .then((data) => {
        setFranchises(data.franchises || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="pb-24 bg-[#0a1628] text-white min-h-screen">
      <PageHeader
        label="FOUNDING FRANCHISES"
        title="OWNERS & CLUBS"
        description="Meet the approved founding franchises who command the clubs of APL Season One."
        gold
      />

      <div className="container-apl mt-12 max-w-4xl px-4">
        {loading ? (
          <div className="text-center py-12 text-apl-text-muted animate-pulse">
            Loading founding franchises...
          </div>
        ) : franchises.length === 0 ? (
          <div className="glass-card p-12 text-center border border-apl-border">
            <Building2 className="mx-auto text-apl-text-muted mb-4" size={40} />
            <h3 className="text-lg font-semibold text-white">No Approved Franchises Yet</h3>
            <p className="mt-2 text-sm text-apl-text-secondary">Be part of the exclusive cohort. Apply to own a franchise.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {franchises.map((f, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.08, 0.8) }}
                className="glass-card p-6 border border-apl-gold-dim bg-gradient-to-br from-apl-navy-light/40 to-transparent relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-4 opacity-15">
                  <ShieldCheck size={28} className="text-apl-gold" />
                </div>
                <h3 className="text-lg font-bold text-white tracking-wide">{f.team_name || "Club Name Pending"}</h3>
                <p className="mt-1 text-xs text-apl-gold uppercase font-semibold tracking-wider">Owner: {f.owner_name}</p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-apl-text-secondary">
                  <MapPin size={13} className="text-apl-blue" />
                  <span>Representing {f.team_area}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
