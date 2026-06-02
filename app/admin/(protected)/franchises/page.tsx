"use client";

import { useCallback, useEffect, useState } from "react";
import { FranchiseStatusBadge } from "@/components/admin/StatusBadge";
import { Search, X } from "lucide-react";

type Franchise = {
  id: string;
  owner_name: string;
  team_name: string | null;
  team_area: string;
  contact_number: string;
  email: string;
  instagram: string | null;
  manager_name: string | null;
  logo_url: string | null;
  approval_status: string;
  created_at: string;
};

export default function AdminFranchisesPage() {
  const [rows, setRows] = useState<Franchise[]>([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Franchise | null>(null);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/franchises?${params}`);
    const data = await res.json();
    setRows(data.franchises || []);
  }, [q]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const updateStatus = async (id: string, approval_status: string) => {
    await fetch(`/api/admin/franchises/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approval_status })
    });
    load();
    if (selected?.id === id) setSelected({ ...selected, approval_status });
  };

  return (
    <div>
      <h1 className="text-2xl font-medium text-apl-navy">Franchises</h1>
      <div className="relative mt-6 max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-apl-text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search owner, team, email..." className="admin-field !pl-10" />
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Owner</th>
              <th>Team</th>
              <th>Area</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f.id}>
                <td>{f.owner_name}</td>
                <td>{f.team_name || "—"}</td>
                <td>{f.team_area}</td>
                <td>
                  <FranchiseStatusBadge status={f.approval_status} />
                </td>
                <td>
                  <button type="button" onClick={() => setSelected(f)} className="text-xs text-apl-blue">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between">
              <h2 className="text-lg font-medium">{selected.owner_name}</h2>
              <button type="button" onClick={() => setSelected(null)}>
                <X size={18} />
              </button>
            </div>
            <p className="mt-2 text-sm text-apl-text-muted">{selected.email}</p>
            {selected.logo_url && (
              <div className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selected.logo_url} alt="Logo" className="mx-auto h-32 w-32 rounded-lg object-contain" />
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              {["approved", "rejected", "pending"].map((s) => (
                <button key={s} type="button" onClick={() => updateStatus(selected.id, s)} className="admin-btn-ghost !text-xs capitalize">
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
