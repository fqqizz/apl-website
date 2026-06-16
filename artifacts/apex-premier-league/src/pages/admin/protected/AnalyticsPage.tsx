
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-fetch";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";

type Stats = {
  totalPlayers: number;
  totalFranchises: number;
  totalRevenue: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  statusBreakdown: { status: string; count: number }[];
  areaBreakdown: { area: string; count: number }[];
  recentRegistrations: { date: string; count: number }[];
};

const STATUS_COLORS: Record<string, string> = {
  "UNDER REVIEW": "#1a6bff",
  "APPROVED": "#10b981",
  "REJECTED": "#ef4444",
  "PENDING VERIFICATION": "#f59e0b",
};

const PIE_COLORS = ["#1a6bff", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

export default function AdminAnalyticsPage() {
  return (
    <AdminAuthGuard>
      <AnalyticsContent />
    </AdminAuthGuard>
  );
}

function AnalyticsContent() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Fetch base stats
        const statsRes = await adminFetch("/api/admin/stats");
        const statsData = await statsRes.json();

        // Fetch players for breakdown analysis
        const playersRes = await adminFetch("/api/admin/players?page=1");
        const playersData = await playersRes.json();
        const players = playersData.players || [];

        // Fetch payments
        const paymentsRes = await adminFetch("/api/admin/payments");
        const paymentsData = await paymentsRes.json();
        const payments = paymentsData.payments || [];

        // Status breakdown
        const statusMap = new Map<string, number>();
        for (const p of players) {
          const s = p.application_status || "UNDER REVIEW";
          statusMap.set(s, (statusMap.get(s) || 0) + 1);
        }
        const statusBreakdown = Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }));

        // Area breakdown (top 8)
        const areaMap = new Map<string, number>();
        for (const p of players) {
          const a = p.area || "Unknown";
          areaMap.set(a, (areaMap.get(a) || 0) + 1);
        }
        const areaBreakdown = Array.from(areaMap.entries())
          .map(([area, count]) => ({ area, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);

        // Recent registrations (last 14 days)
        const dateMap = new Map<string, number>();
        const now = new Date();
        for (let i = 13; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          dateMap.set(d.toISOString().slice(0, 10), 0);
        }
        for (const p of players) {
          const d = new Date(p.created_at).toISOString().slice(0, 10);
          if (dateMap.has(d)) {
            dateMap.set(d, (dateMap.get(d) || 0) + 1);
          }
        }
        const recentRegistrations = Array.from(dateMap.entries()).map(([date, count]) => ({
          date: new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
          count,
        }));

        // Payment breakdown
        const completedPayments = payments.filter((p: any) => p.paymentStatus === "completed").length;
        const pendingPayments = payments.filter((p: any) => p.paymentStatus === "pending").length;
        const failedPayments = payments.filter((p: any) => p.paymentStatus === "failed").length;

        setStats({
          totalPlayers: statsData.totalPlayers || 0,
          totalFranchises: statsData.totalFranchises || 0,
          totalRevenue: paymentsData.revenue || 0,
          completedPayments,
          pendingPayments,
          failedPayments,
          statusBreakdown,
          areaBreakdown,
          recentRegistrations,
        });
      } catch {
        // Handle silently
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#1a6bff]/20 border-t-[#1a6bff]" />
          <p className="mt-3 text-sm text-apl-text-muted">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <p className="text-apl-text-muted">Unable to load analytics data.</p>;
  }

  const paymentPieData = [
    { name: "Completed", value: stats.completedPayments },
    { name: "Pending", value: stats.pendingPayments },
    { name: "Failed", value: stats.failedPayments },
  ].filter(d => d.value > 0);

  return (
    <div>
      <h1 className="text-2xl font-medium text-apl-navy">Analytics</h1>
      <p className="mt-1 text-sm text-apl-text-muted">Registration and payment insights</p>

      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wide text-apl-text-muted">Total Players</p>
          <p className="mt-2 text-3xl font-semibold text-apl-navy">{stats.totalPlayers}</p>
        </div>
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wide text-apl-text-muted">Total Franchises</p>
          <p className="mt-2 text-3xl font-semibold text-apl-navy">{stats.totalFranchises}</p>
        </div>
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wide text-apl-text-muted">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-600">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="admin-card">
          <p className="text-xs uppercase tracking-wide text-apl-text-muted">Completed Payments</p>
          <p className="mt-2 text-3xl font-semibold text-apl-blue">{stats.completedPayments}</p>
        </div>
      </div>

      {/* Charts row */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Registration trend */}
        <div className="admin-card">
          <h3 className="text-sm font-semibold text-apl-navy">Registrations (Last 14 Days)</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.recentRegistrations}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,22,40,0.06)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#5a6a7e" }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#5a6a7e" }} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(10,22,40,0.08)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="count" stroke="#1a6bff" strokeWidth={2} dot={{ r: 3, fill: "#1a6bff" }} name="Registrations" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status breakdown pie */}
        <div className="admin-card">
          <h3 className="text-sm font-semibold text-apl-navy">Application Status</h3>
          <div className="mt-4 h-64 flex items-center justify-center">
            {stats.statusBreakdown.length === 0 ? (
              <p className="text-sm text-apl-text-muted">No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="status"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {stats.statusBreakdown.map((entry, idx) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Area breakdown bar chart */}
      <div className="mt-6 admin-card">
        <h3 className="text-sm font-semibold text-apl-navy">Registrations by Area (Top 8)</h3>
        <div className="mt-4 h-72">
          {stats.areaBreakdown.length === 0 ? (
            <p className="text-sm text-apl-text-muted py-8 text-center">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.areaBreakdown} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(10,22,40,0.06)" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#5a6a7e" }} />
                <YAxis type="category" dataKey="area" tick={{ fontSize: 11, fill: "#5a6a7e" }} width={75} />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid rgba(10,22,40,0.08)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#1a6bff" radius={[0, 4, 4, 0]} name="Players" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Payment breakdown */}
      <div className="mt-6 admin-card">
        <h3 className="text-sm font-semibold text-apl-navy">Payment Status Distribution</h3>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-emerald-50 p-4 text-center">
            <p className="text-2xl font-bold text-emerald-700">{stats.completedPayments}</p>
            <p className="mt-1 text-xs font-medium text-emerald-600">Completed</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 text-center">
            <p className="text-2xl font-bold text-amber-700">{stats.pendingPayments}</p>
            <p className="mt-1 text-xs font-medium text-amber-600">Pending</p>
          </div>
          <div className="rounded-lg bg-red-50 p-4 text-center">
            <p className="text-2xl font-bold text-red-700">{stats.failedPayments}</p>
            <p className="mt-1 text-xs font-medium text-red-600">Failed</p>
          </div>
        </div>
      </div>
    </div>
  );
}
