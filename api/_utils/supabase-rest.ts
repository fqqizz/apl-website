import { env, serverFetch } from "./http";

type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceKey: string;
};

export function getSupabaseConfig(): SupabaseConfig | null {
  const url = env("SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL") || env("VITE_SUPABASE_URL");
  const anonKey = env("SUPABASE_ANON_KEY") || env("NEXT_PUBLIC_SUPABASE_ANON_KEY") || env("VITE_SUPABASE_ANON_KEY");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY") || anonKey;
  if (!url || !anonKey) return null;
  return { url: url.replace(/\/$/, ""), anonKey, serviceKey };
}

export async function supabaseGet(path: string, signal?: any) {
  const config = getSupabaseConfig();
  if (!config) return { configured: false as const };

  const key = config.serviceKey || config.anonKey;
  const response = await serverFetch(`${config.url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
    signal,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  return { configured: true as const, response, data };
}

export async function supabaseInsert(table: string, payload: unknown, signal?: any) {
  const config = getSupabaseConfig();
  if (!config) return { configured: false as const };

  const response = await serverFetch(`${config.url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
    signal,
  });
  const text = await response.text();
  return { configured: true as const, response, data: text ? JSON.parse(text) : null };
}

export async function supabaseRequest(path: string, init: any = {}, useService = true) {
  const config = getSupabaseConfig();
  if (!config) return { configured: false as const };

  const key = useService ? config.serviceKey : config.anonKey;
  const response = await serverFetch(`${config.url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  return { configured: true as const, response, data: text ? JSON.parse(text) : null };
}
