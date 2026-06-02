import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 300;

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ players: 0, franchises: 0 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });

  const [playersRes, franchisesRes] = await Promise.all([
    supabase.from("players").select("id", { count: "exact", head: true }),
    supabase.from("franchises").select("id", { count: "exact", head: true })
  ]);

  return NextResponse.json({
    players: playersRes.count ?? 0,
    franchises: franchisesRes.count ?? 0,
    season: 1
  });
}
