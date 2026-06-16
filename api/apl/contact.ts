import { env, methodNotAllowed, readJson, sendJson } from "../_utils/http";
import { supabaseInsert } from "../_utils/supabase-rest";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown) {
  return String(value || "").trim();
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    const body = await readJson(req);
    const name = clean(body.name);
    const email = clean(body.email).toLowerCase();
    const phone = clean(body.phone);
    const subject = clean(body.subject);
    const message = clean(body.message);

    if (!name || !email || !subject || !message) {
      return sendJson(res, 400, { error: "Please fill in all required fields." });
    }
    if (!EMAIL_RE.test(email)) {
      return sendJson(res, 400, { error: "Enter a valid email address." });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    const dbResult = await supabaseInsert(
      "contact_submissions",
      [{ name, email, phone: phone || null, subject, message, is_read: false }],
      controller.signal,
    ).catch(() => null);
    clearTimeout(timeout);

    const resendKey = env("RESEND_API_KEY");
    let emailDelivered = false;
    if (resendKey) {
      const mail = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "APL Contact <contact@apexpremiereleague.in>",
          to: ["contact@apexpremiereleague.in"],
          reply_to: email,
          subject: `[APL Contact] ${subject}`,
          html: `<p><strong>${name}</strong> (${email}${phone ? `, ${phone}` : ""})</p><p>${message.replace(/\n/g, "<br/>")}</p>`,
        }),
        signal: AbortSignal.timeout(9000),
      });
      emailDelivered = mail.ok;
    }

    const dbSaved = Boolean(dbResult?.configured && dbResult.response.ok);
    if (!dbSaved && !emailDelivered) {
      return sendJson(res, 503, { error: "We could not save your message right now. Please call or email APL directly." });
    }

    return sendJson(res, 200, { success: true });
  } catch {
    return sendJson(res, 500, { error: "We could not send your message. Please try again or call us directly." });
  }
}

