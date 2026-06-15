import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const VALID_PLAYER_ID = /^APL-\d{4,5}$/i;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const playerId = (url.searchParams.get("player_id") || "").trim().toUpperCase();

  if (!VALID_PLAYER_ID.test(playerId)) {
    return NextResponse.json({ error: "Enter a valid Player ID, for example APL-4821." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Status lookup is temporarily unavailable." }, { status: 503 });
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  }) as any;

  const { data, error } = await supabase
    .from("players")
    .select("player_id, application_status, created_at")
    .eq("player_id", playerId)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: "Unable to verify application status right now." }, { status: 502 });
  }

  if (!data) {
    return NextResponse.json({ error: "No application was found for this Player ID." }, { status: 404 });
  }

  return NextResponse.json({
    player_id: data.player_id,
    application_status: data.application_status || "UNDER REVIEW",
    created_at: data.created_at
  });
}
