/**
 * Supabase Client Configuration
 * Initialize and export the Supabase client for frontend use
 * Uses anonymous key (NEXT_PUBLIC_* variables) for client-side operations
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
