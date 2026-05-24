import { resend } from "@/lib/resend";
import { NextResponse } from "next/server";

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
      if (attempt < attempts - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      }
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
    const safeEmail = escapeHtml(String(email));

    await sendWithRetry({
      from: "APL <contact@apexpremiereleague.in>",
      to: [safeEmail],
      subject: `APL Registration Confirmed — ${safePlayerId}`,
      html: `
        <!doctype html>
        <html>
          <body style="margin:0;background:#f5f5f5;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#111111;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #eaeaea;border-radius:28px;overflow:hidden;">
              <tr>
                <td style="padding:34px 28px 12px;">
                  <p style="margin:0 0 18px;color:#00029c;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;font-weight:700;">APEX PREMIERE LEAGUE</p>
                  <h1 style="margin:0;color:#111111;font-size:34px;line-height:1.05;font-weight:500;">Registration confirmed.</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 28px 4px;">
                  <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#444444;">Hello ${safeName},</p>
                  <p style="margin:0;font-size:16px;line-height:1.7;color:#444444;">Your APL player registration has been submitted successfully and is now with the APL Committee for review.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 28px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f7f7;border:1px solid #eaeaea;border-radius:22px;">
                    <tr>
                      <td style="padding:20px;">
                        <p style="margin:0 0 8px;color:#777777;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;">Player ID</p>
                        <p style="margin:0;color:#111111;font-size:28px;font-weight:600;">${safePlayerId}</p>
                        <p style="margin:18px 0 8px;color:#777777;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;">Payment Status</p>
                        <p style="margin:0;color:#111111;font-size:16px;text-transform:capitalize;">${safePaymentStatus}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 28px 32px;">
                  <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#555555;">You will receive an email once your registration has been reviewed and approved by the APL Committee.</p>
                  <p style="margin:0;font-size:14px;line-height:1.7;color:#777777;">Support: <a href="mailto:contact@apexpremiereleague.in" style="color:#00029c;text-decoration:none;">contact@apexpremiereleague.in</a></p>
                </td>
              </tr>
              <tr>
                <td style="border-top:1px solid #eaeaea;padding:18px 28px;color:#999999;font-size:12px;">© 2026 APL. Rise Above.</td>
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
