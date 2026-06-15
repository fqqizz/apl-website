"use client";

import { useCallback, useEffect, useState } from "react";
import { PlayerStatusBadge } from "@/components/admin/StatusBadge";
import { Search, X } from "lucide-react";

type Player = {
  id: string;
  full_name: string;
  age: number;
  position: string;
  area: string;
  contact_number: string;
  email: string;
  payment_status: string;
  application_status: string;
  player_id: string | null;
  photo_url: string | null;
  id_url: string | null;
  created_at: string;
};

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    const res = await fetch(`/api/admin/players?${params}`);
    const data = await res.json();
    setPlayers(data.players || []);
    setLoading(false);
  }, [q, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const updateStatus = async (id: string, application_status: string) => {
    await fetch(`/api/admin/players/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ application_status })
    });
    load();
    if (selected?.id === id) setSelected({ ...selected, application_status });
  };

  return (
    <div>
      <h1 className="text-2xl font-medium text-apl-navy">Players</h1>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-apl-text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, ID, email, phone..." className="admin-field !pl-10" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-field sm:w-48">
          <option value="">All statuses</option>
          <option value="UNDER REVIEW">Under Review</option>
          <option value="PENDING VERIFICATION">Pending Verification</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Player ID</th>
              <th>Name</th>
              <th>Area</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-apl-text-muted">
                  Loading...
                </td>
              </tr>
            ) : (
              players.map((p) => (
                <tr key={p.id}>
                  <td className="font-mono text-xs">{p.player_id || "—"}</td>
                  <td>{p.full_name}</td>
                  <td>{p.area}</td>
                  <td className="capitalize">{p.payment_status}</td>
                  <td>
                    <PlayerStatusBadge status={p.application_status} />
                  </td>
                  <td>
                    <button type="button" onClick={() => setSelected(p)} className="text-xs text-apl-blue hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-medium">{selected.full_name}</h2>
                <p className="font-mono text-sm text-apl-blue">{selected.player_id}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-apl-text-muted">Age / Position</dt>
                <dd>
                  {selected.age} · {selected.position}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-apl-text-muted">Email</dt>
                <dd>{selected.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-apl-text-muted">Phone</dt>
                <dd>{selected.contact_number}</dd>
              </div>
            </dl>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {selected.photo_url && (
                <div>
                  <p className="admin-label mb-2">Photo</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.photo_url} alt="Player" className="h-40 w-full rounded-lg object-cover" />
                </div>
              )}
              {selected.id_url && (
                <div>
                  <p className="admin-label mb-2">ID Document</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.id_url} alt="ID" className="h-40 w-full rounded-lg object-cover" />
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["APPROVED", "REJECTED", "UNDER REVIEW", "PENDING VERIFICATION"].map((s) => (
                <button key={s} type="button" onClick={() => updateStatus(selected.id, s)} className="admin-btn-ghost !text-xs">
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
