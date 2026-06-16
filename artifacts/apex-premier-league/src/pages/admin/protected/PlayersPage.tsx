

import { useCallback, useEffect, useState } from "react";
import { PlayerStatusBadge } from "@/components/admin/StatusBadge";
import { Search, X, Download } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

type Player = {
  id: string;
  full_name: string;
  age: number;
  position: string;
  preferred_foot: string;
  area: string;
  contact_number: string;
  email: string;
  instagram: string | null;
  payment_status: string;
  application_status: string;
  player_id: string | null;
  order_id: string | null;
  photo_url: string | null;
  id_url: string | null;
  created_at: string;
};

export default function AdminPlayersPage() {
  return (
    <AdminAuthGuard>
      <PlayersContent />
    </AdminAuthGuard>
  );
}

function PlayersContent() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (status) params.set("status", status);
    params.set("page", String(page));
    const res = await adminFetch(`/api/admin/players?${params}`);
    const data = await res.json();
    setPlayers(data.players || []);
    setTotal(data.total || 0);
    setTotalPages(data.pages || 1);
    setLoading(false);
  }, [q, status, page]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const updateStatus = async (id: string, application_status: string) => {
    await adminFetch(`/api/admin/players/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ application_status })
    });
    load();
    if (selected?.id === id) setSelected({ ...selected, application_status });
  };

  const exportCSV = async () => {
    // Fetch all players for export
    const res = await adminFetch("/api/admin/players?page=1");
    const data = await res.json();
    const rows = data.players || [];
    
    if (rows.length === 0) return;

    const headers = ["Player ID", "Name", "Age", "Position", "Preferred Foot", "Area", "Phone", "Email", "Instagram", "Payment Status", "Application Status", "Order ID", "Registered"];
    const csvRows = [
      headers.join(","),
      ...rows.map((p: Player) => [
        p.player_id || "",
        `"${(p.full_name || "").replace(/"/g, '""')}"`,
        p.age,
        `"${p.position}"`,
        `"${p.preferred_foot || ""}"`,
        `"${(p.area || "").replace(/"/g, '""')}"`,
        `"${p.contact_number}"`,
        `"${p.email}"`,
        `"${p.instagram || ""}"`,
        p.payment_status,
        p.application_status,
        p.order_id || "",
        new Date(p.created_at).toLocaleDateString("en-IN"),
      ].join(","))
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `APL-Players-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-apl-navy">Players</h1>
          <p className="mt-1 text-sm text-apl-text-muted">{total} total registrations</p>
        </div>
        <button type="button" onClick={exportCSV} className="admin-btn-ghost">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-apl-text-muted" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search name, ID, email, phone..." className="admin-field !pl-10" />
        </div>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="admin-field sm:w-48">
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
            ) : players.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-apl-text-muted">
                  No players found
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-apl-text-muted">
            Page {page} of {totalPages} · {total} players
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="admin-btn-ghost !text-xs disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="admin-btn-ghost !text-xs disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Player detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {selected.photo_url ? (
                  <img src={selected.photo_url} alt={selected.full_name} className="h-14 w-14 rounded-full object-cover border border-black/10" />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <span className="text-lg font-bold">{selected.full_name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-medium">{selected.full_name}</h2>
                  <p className="font-mono text-sm text-apl-blue">{selected.player_id || "No ID"}</p>
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <dl className="mt-5 grid gap-2.5 text-sm">
              {[
                ["Age", selected.age],
                ["Position", selected.position],
                ["Preferred Foot", selected.preferred_foot],
                ["Area / District", selected.area],
                ["Email", selected.email],
                ["Phone", selected.contact_number],
                ["Instagram", selected.instagram || "—"],
                ["Payment", selected.payment_status],
                ["Order ID", selected.order_id || "—"],
                ["Status", selected.application_status],
                ["Registered", new Date(selected.created_at).toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between border-b border-black/5 pb-2">
                  <dt className="text-apl-text-muted">{label}</dt>
                  <dd className="text-right font-medium max-w-[60%] truncate">{String(value)}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {selected.photo_url && (
                <div>
                  <p className="admin-label mb-2">Photo</p>
                  <img src={selected.photo_url} alt="Player" className="h-40 w-full rounded-lg object-cover" />
                </div>
              )}
              {selected.id_url && (
                <div>
                  <p className="admin-label mb-2">ID Document</p>
                  <img src={selected.id_url} alt="ID" className="h-40 w-full rounded-lg object-cover" />
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {["APPROVED", "REJECTED", "UNDER REVIEW", "PENDING VERIFICATION"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateStatus(selected.id, s)}
                  className={`admin-btn-ghost !text-xs ${selected.application_status === s ? "!border-apl-blue !text-apl-blue font-semibold" : ""}`}
                >
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
