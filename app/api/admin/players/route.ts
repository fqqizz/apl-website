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
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = 20;

  const db = createServiceClient();
  let query = db.from("players").select("*", { count: "exact" }).order("created_at", { ascending: false });

  if (status) query = query.eq("application_status", status);

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let rows = data || [];
  if (q) {
    rows = rows.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.player_id?.toLowerCase().includes(q) ||
        p.contact_number?.includes(q) ||
        p.area?.toLowerCase().includes(q)
    );
  }

  const total = q || status ? rows.length : count || rows.length;
  const start = (page - 1) * limit;
  const paged = rows.slice(start, start + limit);

  return NextResponse.json({ players: paged, total, page, pages: Math.ceil(total / limit) });
}
