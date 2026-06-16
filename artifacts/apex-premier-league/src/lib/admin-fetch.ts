import { supabase } from "@/lib/supabase";

async function getAuthHeader(): Promise<Record<string, string>> {
  if (!supabase) return {};
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) return { Authorization: `Bearer ${token}` };
  } catch {
  }
  return {};
}

export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const authHeaders = await getAuthHeader();
  return fetch(input, {
    ...init,
    headers: {
      ...authHeaders,
      ...(init.headers || {})
    }
  });
}
