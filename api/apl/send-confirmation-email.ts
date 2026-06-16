import { createTimeout, env, methodNotAllowed, readJson, sendJson, serverFetch } from "../_utils/http";

function buildEmail(playerName: string, playerId: string) {
  return `<!doctype html><html><body style="margin:0;background:#07111D;color:#fff;font-family:Arial,sans-serif;padding:40px"><div style="max-width:560px;margin:auto;border:1px solid rgba(212,175,55,.35);border-radius:18px;padding:32px;background:#0c1927"><p style="letter-spacing:.2em;color:#D4AF37;font-size:11px">APEX PREMIER LEAGUE</p><h1 style="margin:10px 0 0;font-size:28px">Your APL Player ID</h1><p style="color:#a8b4c8">Welcome, ${playerName}. Your official Player ID is:</p><p style="font-size:42px;letter-spacing:.12em;color:#D4AF37;font-weight:700">${playerId}</p><p style="color:#a8b4c8">Use this ID to check your application status at apexpremiereleague.in/status.</p></div></body></html>`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const { playerName, playerId, email } = await readJson(req);
  if (!playerName || !playerId || !email) return sendJson(res, 400, { error: "Missing required fields." });

  const resendKey = env("RESEND_API_KEY");
  if (!resendKey) return sendJson(res, 200, { success: true });

  try {
    const timeout = createTimeout(9000);
    const response = await serverFetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Apex Premier League <contact@apexpremiereleague.in>",
        to: [String(email)],
        subject: `Your APL Player ID - ${String(playerId)}`,
        html: buildEmail(String(playerName), String(playerId)),
      }),
      signal: timeout.signal,
    });
    timeout.clear();
    if (!response.ok) return sendJson(res, 502, { error: "Failed to send email." });
    return sendJson(res, 200, { success: true });
  } catch {
    return sendJson(res, 500, { error: "Failed to send email." });
  }
}
