import { createTimeout, env, methodNotAllowed, readJson, sendJson, serverFetch } from "../_utils/http";

function buildEmail(playerName: string, playerId: string, extras?: {
  position?: string;
  area?: string;
  orderId?: string;
}) {
  const pos = extras?.position || "Player";
  const area = extras?.area || "";
  const orderId = extras?.orderId || "";
  const year = new Date().getFullYear();

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07111D;font-family:'Helvetica Neue',Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:40px 20px">

  <!-- Header -->
  <div style="text-align:center;padding:32px 0 24px">
    <div style="display:inline-block;padding:10px 20px;border:1px solid rgba(212,175,55,0.3);border-radius:8px;background:rgba(212,175,55,0.08)">
      <span style="font-size:13px;letter-spacing:0.3em;color:#D4AF37;font-weight:700">APEX PREMIER LEAGUE</span>
    </div>
  </div>

  <!-- Main Card -->
  <div style="background:linear-gradient(180deg,#0f1f33 0%,#0c1927 100%);border:1px solid rgba(212,175,55,0.2);border-radius:20px;overflow:hidden">

    <!-- Success Banner -->
    <div style="background:linear-gradient(135deg,rgba(212,175,55,0.12) 0%,rgba(16,185,129,0.08) 100%);padding:32px 32px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06)">
      <div style="display:inline-block;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#10B981,#059669);line-height:56px;text-align:center">
        <span style="color:white;font-size:28px">✓</span>
      </div>
      <h1 style="margin:16px 0 4px;font-size:26px;font-weight:700;color:#ffffff">Registration Confirmed</h1>
      <p style="margin:0;font-size:14px;color:#94a3b8">Welcome to the league, ${playerName}.</p>
    </div>

    <!-- Player ID Section -->
    <div style="padding:28px 32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06)">
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.25em;color:#64748b;text-transform:uppercase;font-weight:600">Your Official Player ID</p>
      <div style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05));border:2px solid rgba(212,175,55,0.35);border-radius:12px">
        <span style="font-size:36px;letter-spacing:0.12em;color:#D4AF37;font-weight:800">${playerId}</span>
      </div>
    </div>

    <!-- Details Grid -->
    <div style="padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.06)">
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:10px 0;font-size:13px;color:#64748b;width:40%">Full Name</td>
          <td style="padding:10px 0;font-size:14px;color:#e2e8f0;font-weight:600;text-align:right">${playerName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;font-size:13px;color:#64748b;border-top:1px solid rgba(255,255,255,0.04)">Position</td>
          <td style="padding:10px 0;font-size:14px;color:#e2e8f0;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.04)">${pos}</td>
        </tr>
        ${area ? `<tr>
          <td style="padding:10px 0;font-size:13px;color:#64748b;border-top:1px solid rgba(255,255,255,0.04)">Area</td>
          <td style="padding:10px 0;font-size:14px;color:#e2e8f0;font-weight:600;text-align:right;border-top:1px solid rgba(255,255,255,0.04)">${area}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:10px 0;font-size:13px;color:#64748b;border-top:1px solid rgba(255,255,255,0.04)">Payment</td>
          <td style="padding:10px 0;font-size:14px;color:#10B981;font-weight:700;text-align:right;border-top:1px solid rgba(255,255,255,0.04)">₹249 — Paid ✓</td>
        </tr>
        ${orderId ? `<tr>
          <td style="padding:10px 0;font-size:13px;color:#64748b;border-top:1px solid rgba(255,255,255,0.04)">Reference</td>
          <td style="padding:10px 0;font-size:12px;color:#94a3b8;font-family:monospace;text-align:right;border-top:1px solid rgba(255,255,255,0.04)">${orderId}</td>
        </tr>` : ""}
      </table>
    </div>

    <!-- Next Steps -->
    <div style="padding:24px 32px">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.15em;color:#64748b;text-transform:uppercase;font-weight:600">What Happens Next</p>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:8px 12px 8px 0;vertical-align:top;width:28px">
            <span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:rgba(212,175,55,0.12);color:#D4AF37;text-align:center;line-height:24px;font-size:12px;font-weight:700">1</span>
          </td>
          <td style="padding:8px 0;font-size:13px;color:#94a3b8;line-height:1.5">Our team reviews your application within 24-48 hours.</td>
        </tr>
        <tr>
          <td style="padding:8px 12px 8px 0;vertical-align:top">
            <span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:rgba(212,175,55,0.12);color:#D4AF37;text-align:center;line-height:24px;font-size:12px;font-weight:700">2</span>
          </td>
          <td style="padding:8px 0;font-size:13px;color:#94a3b8;line-height:1.5">You'll be assigned to a franchise and notified via email.</td>
        </tr>
        <tr>
          <td style="padding:8px 12px 8px 0;vertical-align:top">
            <span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:rgba(212,175,55,0.12);color:#D4AF37;text-align:center;line-height:24px;font-size:12px;font-weight:700">3</span>
          </td>
          <td style="padding:8px 0;font-size:13px;color:#94a3b8;line-height:1.5">Check your status anytime at <a href="https://apexpremiereleague.in/status" style="color:#D4AF37;text-decoration:none">apexpremiereleague.in/status</a></td>
        </tr>
      </table>
    </div>
  </div>

  <!-- Footer -->
  <div style="text-align:center;padding:28px 0 0">
    <p style="margin:0 0 8px;font-size:12px;color:#475569">© ${year} Apex Premier League. All rights reserved.</p>
    <p style="margin:0;font-size:11px;color:#334155">
      <a href="https://apexpremiereleague.in" style="color:#64748b;text-decoration:none">apexpremiereleague.in</a>
      &nbsp;&middot;&nbsp;
      <a href="https://apexpremiereleague.in/contact" style="color:#64748b;text-decoration:none">Contact Us</a>
    </p>
  </div>

</div>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  const { playerName, playerId, email, position, area, orderId } = await readJson(req);
  if (!playerName || !playerId || !email) return sendJson(res, 400, { error: "Missing required fields." });

  const resendKey = env("RESEND_API_KEY");
  if (!resendKey) return sendJson(res, 200, { success: true, emailSkipped: true });

  try {
    const timeout = createTimeout(9000);
    const response = await serverFetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Apex Premier League <contact@apexpremiereleague.in>",
        to: [String(email)],
        subject: `Welcome to APL — Your Player ID is ${String(playerId)}`,
        html: buildEmail(String(playerName), String(playerId), {
          position: position ? String(position) : undefined,
          area: area ? String(area) : undefined,
          orderId: orderId ? String(orderId) : undefined,
        }),
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
