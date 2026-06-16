/**
 * Supabase Client Configuration
 * Initialize and export the Supabase client for frontend use
 * Uses anonymous key (NEXT_PUBLIC_* variables) for client-side operations
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient<Database>>);
