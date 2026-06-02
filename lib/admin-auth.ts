import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

/** Case-insensitive match against admins.email */
function rowMatchesEmail(rowEmail: unknown, normalized: string) {
  return normalizeEmail(String(rowEmail || "")) === normalized;
}

/**
 * Checks admins table with case-insensitive email match.
 * Prefers service role (bypasses RLS). Falls back to the signed-in user's Supabase session.
 */
export async function isAdminEmail(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  const hasServiceRole = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (hasServiceRole) {
    const service = createServiceClient();
    const { data, error } = await service.from("admins").select("email");
    if (!error && data) {
      return data.some((row) => rowMatchesEmail(row.email, normalized));
    }
    if (error) console.error("[APL Admin] Service role lookup failed:", error.message);
  } else {
    console.warn("[APL Admin] SUPABASE_SERVICE_ROLE_KEY is not set — using session-based admin lookup.");
  }

  const authClient = await createClient();
  const { data: rows, error: authError } = await authClient.from("admins").select("email");
  const sessionRows = (rows ?? []) as { email: string }[];

  if (!authError && sessionRows.length) {
    return sessionRows.some((row) => rowMatchesEmail(row.email, normalized));
  }

  if (authError) console.error("[APL Admin] Session admins lookup failed:", authError.message);

  return false;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user?.email) return { ok: false as const, reason: "unauthenticated" as const };

  const admin = await isAdminEmail(user.email);
  if (!admin) return { ok: false as const, reason: "forbidden" as const, user };

  return { ok: true as const, user };
}
