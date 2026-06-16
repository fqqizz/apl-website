import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.reason === "forbidden" ? 403 : 401 });
  }

  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim().toLowerCase();
  const status = url.searchParams.get("status") || "";

  const db = createServiceClient();
  let query = db.from("franchises").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("approval_status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let rows = data || [];
  if (q) {
    rows = rows.filter(
      (f) =>
        f.owner_name?.toLowerCase().includes(q) ||
        f.email?.toLowerCase().includes(q) ||
        f.team_name?.toLowerCase().includes(q) ||
        f.team_area?.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ franchises: rows });
}
