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
  latestPlayers: { id: string; full_name: string; player_id: string | null; application_status: string; created_at: string }[];
  latestFranchises: { id: string; owner_name: string; team_name: string | null; approval_status: string; created_at: string }[];
  latestContacts: { id: string; name: string; subject: string; is_read: boolean; created_at: string }[];
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
        ["Approved Players", stats.approvedPlayers],
        ["Pending Players", stats.pendingPlayers],
        ["Rejected Players", stats.rejectedPlayers],
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

      {/* Recent Registrations Widget */}
      {stats && (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Latest 5 Players */}
          <div className="admin-card">
            <div className="flex justify-between items-center border-b border-black/5 pb-3">
              <h2 className="text-sm font-semibold text-apl-navy">Latest 5 Players</h2>
              <Link href="/admin/players" className="text-xs text-apl-blue hover:underline">View all</Link>
            </div>
            <ul className="mt-4 space-y-3.5">
              {stats.latestPlayers.length === 0 ? (
                <li className="text-xs text-apl-text-muted">No players registered yet</li>
              ) : (
                stats.latestPlayers.map((p) => (
                  <li key={p.id} className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-medium text-apl-navy">{p.full_name}</p>
                      <p className="text-[10px] text-apl-text-muted font-mono">{p.player_id || "No ID generated"}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      p.application_status === "APPROVED" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : p.application_status === "REJECTED"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {p.application_status}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Latest 5 Franchises */}
          <div className="admin-card">
            <div className="flex justify-between items-center border-b border-black/5 pb-3">
              <h2 className="text-sm font-semibold text-apl-navy">Latest 5 Franchises</h2>
              <Link href="/admin/franchises" className="text-xs text-apl-blue hover:underline">View all</Link>
            </div>
            <ul className="mt-4 space-y-3.5">
              {stats.latestFranchises.length === 0 ? (
                <li className="text-xs text-apl-text-muted">No franchises applied yet</li>
              ) : (
                stats.latestFranchises.map((f) => (
                  <li key={f.id} className="flex justify-between items-center text-xs">
                    <div>
                      <p className="font-medium text-apl-navy">{f.owner_name}</p>
                      <p className="text-[10px] text-apl-text-muted">{f.team_name || "Team name pending"}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize ${
                      f.approval_status === "approved" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : f.approval_status === "rejected"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {f.approval_status}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Latest 5 Contact Messages */}
          <div className="admin-card">
            <div className="flex justify-between items-center border-b border-black/5 pb-3">
              <h2 className="text-sm font-semibold text-apl-navy">Latest 5 Contacts</h2>
              <Link href="/admin/contact" className="text-xs text-apl-blue hover:underline">View all</Link>
            </div>
            <ul className="mt-4 space-y-3.5">
              {stats.latestContacts.length === 0 ? (
                <li className="text-xs text-apl-text-muted">No contact messages yet</li>
              ) : (
                stats.latestContacts.map((c) => (
                  <li key={c.id} className="flex justify-between items-center text-xs">
                    <div className="max-w-[70%]">
                      <p className={`truncate text-apl-navy ${!c.is_read ? "font-semibold" : "font-normal opacity-70"}`}>{c.name}</p>
                      <p className="text-[10px] text-apl-text-muted truncate">{c.subject}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      c.is_read 
                        ? "bg-gray-100 text-gray-600" 
                        : "bg-blue-50 text-blue-700 border border-blue-100 font-semibold animate-pulse"
                    }`}>
                      {c.is_read ? "Read" : "New"}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/admin/players" className="admin-btn-primary">
          Manage players
        </Link>
        <Link href="/admin/franchises" className="admin-btn-ghost">
          Manage franchises
        </Link>
        <Link href="/admin/announcements" className="admin-btn-ghost">
          Manage Announcements
        </Link>
      </div>
    </div>
  );
}
