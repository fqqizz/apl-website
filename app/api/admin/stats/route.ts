import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/service";
import { LEAGUE } from "@/lib/apl-constants";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.reason === "forbidden" ? 403 : 401 });
  }

  const db = createServiceClient();
  const { data: players } = await db.from("players").select("application_status, payment_status, created_at");
  const { data: franchises } = await db.from("franchises").select("approval_status, created_at");

  const list = players || [];
  const approved = list.filter((p) => p.application_status === "APPROVED").length;
  const pending = list.filter((p) => ["UNDER REVIEW", "PENDING VERIFICATION"].includes(p.application_status || "")).length;
  const rejected = list.filter((p) => p.application_status === "REJECTED").length;
  const paid = list.filter((p) => p.payment_status === "completed");
  const revenue = paid.length * LEAGUE.playerRegistrationFeeInr;

  const flist = franchises || [];
  const fApproved = flist.filter((f) => f.approval_status === "approved").length;
  const fPending = flist.filter((f) => f.approval_status === "pending").length;

  const recent = [...list.map((p) => ({ type: "player" as const, at: p.created_at, label: "Player registration" })), ...flist.map((f) => ({ type: "franchise" as const, at: f.created_at, label: "Franchise application" }))]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return NextResponse.json({
    totalPlayers: list.length,
    approvedPlayers: approved,
    pendingPlayers: pending,
    rejectedPlayers: rejected,
    franchiseApplications: flist.length,
    approvedFranchises: fApproved,
    pendingFranchises: fPending,
    totalRegistrations: list.length + flist.length,
    revenue,
    recent
  });
}
