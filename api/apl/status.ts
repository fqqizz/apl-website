import { createTimeout, methodNotAllowed, sendJson } from "../_utils/http";
import { supabaseGet } from "../_utils/supabase-rest";

const VALID_PLAYER_ID = /^APL-\d{4,5}$/i;

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  const playerId = String(req.query.player_id || "").trim().toUpperCase();
  if (!VALID_PLAYER_ID.test(playerId)) {
    return sendJson(res, 400, { error: "Enter a valid Player ID, for example APL-4821." });
  }

  try {
    const timeout = createTimeout(8000);
    const result = await supabaseGet(
      `players?player_id=eq.${encodeURIComponent(playerId)}&select=player_id,application_status,created_at&limit=1`,
      timeout.signal,
    );
    timeout.clear();

    if (!result.configured) {
      return sendJson(res, 503, { error: "Status lookup is temporarily unavailable. Database is not configured." });
    }
    if (!result.response.ok) {
      return sendJson(res, 502, { error: "Unable to verify application status right now." });
    }

    const row = Array.isArray(result.data) ? result.data[0] : null;
    if (!row) return sendJson(res, 404, { error: "No application was found for this Player ID." });

    return sendJson(res, 200, {
      player_id: row.player_id,
      application_status: row.application_status || "UNDER REVIEW",
      created_at: row.created_at,
    });
  } catch {
    return sendJson(res, 504, { error: "Status lookup is taking too long. Please try again." });
  }
}
