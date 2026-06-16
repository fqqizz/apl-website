import { methodNotAllowed, sendJson } from "../_utils/http";
import { supabaseGet } from "../_utils/supabase-rest";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const result = await supabaseGet("announcements?is_active=eq.true&select=text,is_active&order=created_at.desc&limit=1");
    const announcement = result.configured && result.response.ok && Array.isArray(result.data) ? result.data[0] || null : null;
    return sendJson(res, 200, { announcement });
  } catch {
    return sendJson(res, 200, { announcement: null });
  }
}

