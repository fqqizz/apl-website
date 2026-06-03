import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/service";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.reason === "forbidden" ? 403 : 401 });
  }

  const db = createServiceClient();
  const { data, error } = await db.from("announcements").select("*").order("created_at", { ascending: false }).limit(1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ announcement: data?.[0] || null });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: auth.reason === "forbidden" ? 403 : 401 });
  }

  const { text, is_active } = await request.json();

  if (!text || !text.trim()) {
    return NextResponse.json({ error: "Announcement text is required." }, { status: 400 });
  }

  const db = createServiceClient();

  // First, check if there is an existing record
  const { data: existing } = await db.from("announcements").select("id").limit(1);

  let error;
  if (existing && existing.length > 0) {
    const { error: updateError } = await db
      .from("announcements")
      .update({ text: text.trim(), is_active })
      .eq("id", existing[0].id);
    error = updateError;
  } else {
    const { error: insertError } = await db
      .from("announcements")
      .insert([{ text: text.trim(), is_active }]);
    error = insertError;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
