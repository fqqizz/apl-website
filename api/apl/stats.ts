import { methodNotAllowed, sendJson } from "../_utils/http";
import { supabaseGet } from "../_utils/supabase-rest";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const [players, franchises] = await Promise.all([
      supabaseGet("players?select=id"),
      supabaseGet("franchises?select=id"),
    ]);
    return sendJson(res, 200, {
      players: players.configured && players.response.ok && Array.isArray(players.data) ? players.data.length : 0,
      franchises: franchises.configured && franchises.response.ok && Array.isArray(franchises.data) ? franchises.data.length : 0,
      season: 1,
    });
  } catch {
    return sendJson(res, 200, { players: 0, franchises: 0, season: 1 });
  }
}

