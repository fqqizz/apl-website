"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  totalPlayers: number;
  approvedPlayers: number;
  pendingPlayers: number;
  rejectedPlayers: number;
  franchiseApplications: number;
  approvedFranchises: number;
  totalRegistrations: number;
  revenue: number;
  recent: { type: string; at: string; label: string }[];
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => undefined);
  }, []);

  const cards = stats
    ? [
        ["Total Players", stats.totalPlayers],
        ["Approved", stats.approvedPlayers],
        ["Pending", stats.pendingPlayers],
        ["Rejected", stats.rejectedPlayers],
        ["Franchise Apps", stats.franchiseApplications],
        ["Approved Franchises", stats.approvedFranchises],
        ["Total Registrations", stats.totalRegistrations],
        ["Revenue (₹)", stats.revenue.toLocaleString("en-IN")]
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-medium text-apl-navy">Dashboard</h1>
      <p className="mt-1 text-sm text-apl-text-muted">Season One operations overview</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.length === 0
          ? Array.from({ length: 8 }).map((_, i) => <div key={i} className="admin-card h-24 animate-pulse" />)
          : cards.map(([label, value]) => (
              <div key={label} className="admin-card">
                <p className="text-xs uppercase tracking-wide text-apl-text-muted">{label}</p>
                <p className="mt-2 text-2xl font-medium text-apl-navy">{value}</p>
              </div>
            ))}
      </div>

      <div className="mt-8 admin-card">
        <h2 className="text-sm font-medium text-apl-navy">Recent activity</h2>
        <ul className="mt-4 space-y-3">
          {(stats?.recent || []).map((item, i) => (
            <li key={i} className="flex justify-between gap-4 text-sm">
              <span className="text-apl-navy">{item.label}</span>
              <span className="shrink-0 text-apl-text-muted">
                {new Date(item.at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/players" className="admin-btn-primary">
          Manage players
        </Link>
        <Link href="/admin/franchises" className="admin-btn-ghost">
          Manage franchises
        </Link>
      </div>
    </div>
  );
}
