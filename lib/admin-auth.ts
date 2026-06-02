import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function getSessionUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
}

export async function isAdminEmail(email: string): Promise<boolean> {
  const service = createServiceClient() as unknown as {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<{ data: { id: string } | null; error: Error | null }>;
        };
      };
    };
  };

  const trimmed = email.trim();
  for (const candidate of [trimmed.toLowerCase(), trimmed]) {
    const { data, error } = await service.from("admins").select("id").eq("email", candidate).maybeSingle();
    if (!error && data) return true;
  }
  return false;
}

export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user?.email) return { ok: false as const, reason: "unauthenticated" as const };
  const admin = await isAdminEmail(user.email);
  if (!admin) return { ok: false as const, reason: "forbidden" as const, user };
  return { ok: true as const, user };
}
