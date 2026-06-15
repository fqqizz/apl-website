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
  const { data, error } = await db
    .from("players")
    .select("id, full_name, player_id, email, payment_status, order_id, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const payments = (data || []).map((p) => ({
    id: p.id,
    playerName: p.full_name,
    playerId: p.player_id,
    email: p.email,
    amount: LEAGUE.playerRegistrationFeeInr,
    paymentStatus: p.payment_status,
    date: p.created_at,
    orderId: p.order_id
  }));

  const revenue = payments.filter((p) => p.paymentStatus === "completed").reduce((sum, p) => sum + p.amount, 0);

  return NextResponse.json({ payments, revenue });
}
