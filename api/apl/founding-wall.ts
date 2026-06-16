import { methodNotAllowed, sendJson } from "../_utils/http";
import { supabaseGet } from "../_utils/supabase-rest";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const [players, franchises] = await Promise.all([
      supabaseGet("players?payment_status=eq.completed&application_status=eq.APPROVED&select=full_name,position,area&order=created_at.asc"),
      supabaseGet("franchises?approval_status=eq.approved&select=team_name,owner_name,team_area&order=created_at.asc"),
    ]);
    return sendJson(res, 200, {
      players: players.configured && players.response.ok && Array.isArray(players.data) ? players.data : [],
      franchises: franchises.configured && franchises.response.ok && Array.isArray(franchises.data) ? franchises.data : [],
    });
  } catch {
    return sendJson(res, 200, { players: [], franchises: [] });
  }
}

