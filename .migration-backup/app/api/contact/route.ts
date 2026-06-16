import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { CONTACT_EMAIL } from "@/lib/apl-constants";
import { createServiceClient } from "@/lib/supabase/service";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: "Contact service is temporarily unavailable." }, { status: 503 });
    }

    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safePhone = escapeHtml(String(phone || "Not provided"));
    const safeSubject = escapeHtml(String(subject));
    const safeMessage = escapeHtml(String(message)).replace(/\n/g, "<br/>");

    try {
      const supabaseAdmin = createServiceClient();
      await supabaseAdmin.from("contact_submissions").insert([
        {
          name: String(name),
          email: String(email),
          phone: phone ? String(phone) : null,
          subject: String(subject),
          message: String(message),
          is_read: false
        }
      ]);
    } catch (dbErr) {
      console.error("Supabase contact store failed:", dbErr);
    }

    await resend.emails.send({
      from: "APL Contact <contact@apexpremiereleague.in>",
      to: [CONTACT_EMAIL],
      replyTo: String(email),
      subject: `[APL Contact] ${String(subject)}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
          <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#1a6bff;font-weight:600;">New contact message</p>
          <h2 style="margin:12px 0 0;font-size:22px;color:#0a1628;">${safeSubject}</h2>
          <p style="margin:20px 0 8px;font-size:13px;color:#5a6a7e;">From</p>
          <p style="margin:0;color:#0a1628;"><strong>${safeName}</strong><br/>${safeEmail}<br/>${safePhone}</p>
          <p style="margin:24px 0 8px;font-size:13px;color:#5a6a7e;">Message</p>
          <p style="margin:0;line-height:1.7;color:#0a1628;">${safeMessage}</p>
        </div>
      `
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send message. Please call +91 8491900407." }, { status: 502 });
  }
}
