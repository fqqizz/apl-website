import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60; // Cache for 1 minute

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ players: [], franchises: [] });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false }
  });

  const [playersRes, franchisesRes] = await Promise.all([
    supabase
      .from("players")
      .select("full_name, position, area")
      .eq("payment_status", "completed")
      .eq("application_status", "APPROVED")
      .order("created_at", { ascending: true }),
    supabase
      .from("franchises")
      .select("team_name, owner_name, team_area")
      .eq("approval_status", "approved")
      .order("created_at", { ascending: true })
  ]);

  return NextResponse.json({
    players: playersRes.data || [],
    franchises: franchisesRes.data || []
  });
}
