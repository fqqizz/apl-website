import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";
import { LEAGUE, SITE_URL, CONTACT_PHONE } from "@/lib/apl-constants";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function sendWithRetry(payload: Parameters<typeof resend.emails.send>[0], attempts = 2) {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await resend.emails.send(payload);
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw lastError;
}

export async function POST(request: Request) {
  try {
    const { playerName, playerId, email, paymentStatus } = await request.json();

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Email service is not configured" }, { status: 503 });
    }

    if (!playerName || !playerId || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const safeName = escapeHtml(String(playerName));
    const safePlayerId = escapeHtml(String(playerId));
    const safePaymentStatus = escapeHtml(String(paymentStatus || "completed"));
    const logoUrl = `${SITE_URL}/apl-logo.png`;
    const submittedAt = new Date().toLocaleString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

    await sendWithRetry({
      from: "Apex Premier League <contact@apexpremiereleague.in>",
      to: [String(email)],
      subject: `APL Registration Confirmed — ${String(playerId)}`,
      html: `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>APL Registration Confirmed</title>
          </head>
          <body style="margin:0;padding:0;background:#060d18;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#060d18;padding:32px 16px;">
              <tr>
                <td align="center">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,0.45);">
                    <tr>
                      <td style="background:linear-gradient(160deg,#0a1628 0%,#123a7a 55%,#1a6bff 100%);padding:36px 28px;text-align:center;">
                        <img src="${logoUrl}" alt="Apex Premier League" width="72" height="72" style="display:block;margin:0 auto 16px;border-radius:12px;" />
                        <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.65);">Apex Premier League</p>
                        <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:600;letter-spacing:0.02em;">Registration Confirmed</h1>
                        <p style="margin:12px 0 0;font-size:14px;color:rgba(255,255,255,0.85);">${LEAGUE.season}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:32px 28px 8px;">
                        <p style="margin:0 0 8px;font-size:15px;color:#5a6a7e;">Player</p>
                        <p style="margin:0 0 20px;font-size:22px;font-weight:600;color:#0a1628;">${safeName}</p>
                        <p style="margin:0;font-size:15px;line-height:1.75;color:#3d4f66;">
                          Thank you for registering with Apex Premier League. Your application is recorded and your payment has been received.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:12px 28px 8px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f7fc;border-radius:14px;border:1px solid #e2e8f0;">
                          <tr>
                            <td style="padding:22px 24px;">
                              <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#5a6a7e;font-weight:600;">Your Player ID</p>
                              <p style="margin:0;font-size:32px;font-weight:700;color:#1a6bff;font-family:ui-monospace,Consolas,monospace;letter-spacing:0.04em;">${safePlayerId}</p>
                              <hr style="margin:20px 0;border:none;border-top:1px solid #dde4ee;" />
                              <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#5a6a7e;font-weight:600;">Payment confirmation</p>
                              <p style="margin:0;font-size:15px;color:#0a1628;text-transform:capitalize;">${safePaymentStatus} · ₹${LEAGUE.playerRegistrationFeeInr}</p>
                              <p style="margin:16px 0 6px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#5a6a7e;font-weight:600;">Submission date</p>
                              <p style="margin:0;font-size:15px;color:#0a1628;">${submittedAt}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:20px 28px 28px;">
                        <p style="margin:0 0 10px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#1a6bff;font-weight:600;">Next steps</p>
                        <ol style="margin:0;padding-left:20px;font-size:14px;line-height:1.85;color:#3d4f66;">
                          <li>Save your Player ID — you will need it for status updates.</li>
                          <li>Your application enters APL committee review.</li>
                          <li>Track status anytime at <a href="${SITE_URL}/status" style="color:#1a6bff;text-decoration:none;font-weight:500;">${SITE_URL}/status</a>.</li>
                          <li>Approved players proceed toward Season One squad and fixture communication.</li>
                        </ol>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:0 28px 32px;">
                        <p style="margin:0;font-size:14px;line-height:1.7;color:#5a6a7e;">
                          <strong style="color:#0a1628;">Support:</strong> ${CONTACT_PHONE} ·
                          <a href="mailto:contact@apexpremiereleague.in" style="color:#1a6bff;text-decoration:none;">contact@apexpremiereleague.in</a>
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="background:#0a1628;padding:24px 28px;text-align:center;">
                        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.5);">Apex Premier League</p>
                        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.7);line-height:1.6;">
                          Kashmir&apos;s Football Movement · ${LEAGUE.franchises} Franchises · ${LEAGUE.players} Players<br/>
                          © ${new Date().getFullYear()} <a href="${SITE_URL}" style="color:#7eb4ff;text-decoration:none;">apexpremiereleague.in</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
  }
}
