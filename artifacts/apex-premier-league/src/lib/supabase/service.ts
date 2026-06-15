import { createClient } from "@supabase/supabase-js";
/** Server-only client for admin mutations (bypasses RLS). */
export function createServiceClient() {
  const url = import.meta.env.VITE_SUPABASE_URL || "";
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
