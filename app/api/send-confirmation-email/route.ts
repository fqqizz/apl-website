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
        <html>
          <body style="margin:0;background:#0a1628;padding:32px 16px;font-family:'Segoe UI',system-ui,sans-serif;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.25);">
              <tr>
                <td style="background:linear-gradient(135deg,#0a1628 0%,#1a6bff 100%);padding:28px 24px;text-align:center;">
                  <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.7);">Apex Premier League</p>
                  <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:600;letter-spacing:0.02em;">Registration Confirmed</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:28px 24px 8px;">
                  <p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#3d4f66;">Hello ${safeName},</p>
                  <p style="margin:0;font-size:15px;line-height:1.7;color:#5a6a7e;">Your player registration for <strong style="color:#0a1628;">${LEAGUE.season}</strong> has been received. Payment is confirmed and your application is now under APL committee review.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px;">
                  <table role="presentation" width="100%" style="background:#f4f6fa;border-radius:12px;border:1px solid #e8ecf2;">
                    <tr><td style="padding:18px 20px;">
                      <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#5a6a7e;">Your Player ID</p>
                      <p style="margin:0;font-size:28px;font-weight:700;color:#1a6bff;font-family:monospace;">${safePlayerId}</p>
                      <p style="margin:16px 0 6px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#5a6a7e;">Payment</p>
                      <p style="margin:0;font-size:15px;color:#0a1628;text-transform:capitalize;">${safePaymentStatus} · ₹${LEAGUE.playerRegistrationFeeInr}</p>
                      <p style="margin:16px 0 6px;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#5a6a7e;">Submitted</p>
                      <p style="margin:0;font-size:15px;color:#0a1628;">${submittedAt}</p>
                    </td></tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 24px 24px;">
                  <p style="margin:0 0 16px;font-size:14px;line-height:1.7;color:#5a6a7e;">Check your status anytime at <a href="${SITE_URL}/status" style="color:#1a6bff;">${SITE_URL}/status</a> using your Player ID.</p>
                  <p style="margin:0;font-size:13px;color:#5a6a7e;">Support: ${CONTACT_PHONE} · <a href="mailto:contact@apexpremiereleague.in" style="color:#1a6bff;">contact@apexpremiereleague.in</a></p>
                </td>
              </tr>
              <tr>
                <td style="background:#f4f6fa;padding:16px 24px;border-top:1px solid #e8ecf2;font-size:11px;color:#5a6a7e;text-align:center;">
                  © ${new Date().getFullYear()} Apex Premier League · ${LEAGUE.franchises} Franchises · ${LEAGUE.players} Players
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
