import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/service";
import { logAdminAction } from "@/lib/admin-audit";

const VALID = ["APPROVED", "REJECTED", "UNDER REVIEW", "PENDING VERIFICATION"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.reason === "forbidden" ? 403 : 401 });
  }

  const { id } = await params;
  const { application_status } = await request.json();

  if (!VALID.includes(application_status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const db = createServiceClient();
  const { data, error } = await db.from("players").update({ application_status }).eq("id", id).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAdminAction({
    adminEmail: auth.user.email!,
    action: `status:${application_status}`,
    entityType: "player",
    entityId: id,
    details: data.player_id || undefined
  });

  return NextResponse.json({ player: data });
}
