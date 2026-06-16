

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { Search, Download } from "lucide-react";

type Payment = {
  id: string;
  playerName: string;
  playerId: string | null;
  email: string;
  amount: number;
  paymentStatus: string;
  date: string;
  orderId: string | null;
};

export default function AdminPaymentsPage() {
  return (
    <AdminAuthGuard>
      <PaymentsContent />
    </AdminAuthGuard>
  );
}

function PaymentsContent() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filtered, setFiltered] = useState<Payment[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    adminFetch("/api/admin/payments")
      .then((r) => r.json())
      .then((d) => {
        setPayments(d.payments || []);
        setRevenue(d.revenue || 0);
      });
  }, []);

  useEffect(() => {
    let rows = payments;
    if (statusFilter) {
      rows = rows.filter(p => p.paymentStatus === statusFilter);
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      rows = rows.filter(p =>
        (p.playerName || "").toLowerCase().includes(needle) ||
        (p.playerId || "").toLowerCase().includes(needle) ||
        (p.email || "").toLowerCase().includes(needle) ||
        (p.orderId || "").toLowerCase().includes(needle)
      );
    }
    setFiltered(rows);
  }, [payments, q, statusFilter]);

  const exportCSV = () => {
    if (filtered.length === 0) return;
    const headers = ["Player", "Player ID", "Email", "Amount", "Status", "Order ID", "Date"];
    const csvRows = [
      headers.join(","),
      ...filtered.map(p => [
        `"${p.playerName}"`,
        p.playerId || "",
        `"${p.email}"`,
        p.amount,
        p.paymentStatus,
        p.orderId || "",
        new Date(p.date).toLocaleDateString("en-IN"),
      ].join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `APL-Payments-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const completedCount = payments.filter(p => p.paymentStatus === "completed").length;
  const pendingCount = payments.filter(p => p.paymentStatus === "pending").length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium text-apl-navy">Payments</h1>
          <p className="mt-1 text-sm text-apl-text-muted">{payments.length} total transactions</p>
        </div>
        <button type="button" onClick={exportCSV} className="admin-btn-ghost">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Revenue cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wide text-apl-text-muted">Total Revenue</p>
          <p className="mt-2 text-2xl font-medium text-apl-navy">₹{revenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wide text-apl-text-muted">Completed Payments</p>
          <p className="mt-2 text-2xl font-medium text-emerald-600">{completedCount}</p>
        </div>
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wide text-apl-text-muted">Pending Payments</p>
          <p className="mt-2 text-2xl font-medium text-amber-600">{pendingCount}</p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-apl-text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search player, email, order..." className="admin-field !pl-10" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-field sm:w-48">
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-black/5 bg-white">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Player ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Order ID</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm text-apl-text-muted">
                  No payments found
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.playerName}</td>
                  <td className="font-mono text-xs">{p.playerId || "—"}</td>
                  <td>₹{p.amount}</td>
                  <td>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${
                      p.paymentStatus === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : p.paymentStatus === "failed" ? "bg-red-50 text-red-700 border border-red-100"
                      : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="max-w-[120px] truncate font-mono text-xs">{p.orderId || "—"}</td>
                  <td>{new Date(p.date).toLocaleDateString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
