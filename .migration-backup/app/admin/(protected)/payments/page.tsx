"use client";

import { useEffect, useState } from "react";

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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    fetch("/api/admin/payments")
      .then((r) => r.json())
      .then((d) => {
        setPayments(d.payments || []);
        setRevenue(d.revenue || 0);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-medium text-apl-navy">Payments</h1>
      <p className="mt-2 text-sm text-apl-text-muted">
        Total revenue from completed registrations: <strong className="text-apl-navy">₹{revenue.toLocaleString("en-IN")}</strong>
      </p>
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
            {payments.map((p) => (
              <tr key={p.id}>
                <td>{p.playerName}</td>
                <td className="font-mono text-xs">{p.playerId || "—"}</td>
                <td>₹{p.amount}</td>
                <td className="capitalize">{p.paymentStatus}</td>
                <td className="max-w-[120px] truncate font-mono text-xs">{p.orderId || "—"}</td>
                <td>{new Date(p.date).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
