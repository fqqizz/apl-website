import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const router = Router();

function createSupabaseClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function createServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function noSupabase(res: any) {
  return res.status(503).json({ error: "Database not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables." });
}

const VALID_PLAYER_ID = /^APL-\d{4,5}$/i;
const PLAYER_REGISTRATION_FEE = 249;

// GET /api/apl/status?player_id=APL-1234
router.get("/status", async (req, res) => {
  const playerId = ((req.query.player_id as string) || "").trim().toUpperCase();
  if (!VALID_PLAYER_ID.test(playerId)) {
    return res.status(400).json({ error: "Enter a valid Player ID, for example APL-4821." });
  }
  const supabase = createSupabaseClient();
  if (!supabase) return noSupabase(res);
  const { data, error } = await (supabase as any)
    .from("players")
    .select("player_id, application_status, created_at")
    .eq("player_id", playerId)
    .maybeSingle();
  if (error) return res.status(502).json({ error: "Unable to verify application status right now." });
  if (!data) return res.status(404).json({ error: "No application was found for this Player ID." });
  return res.json({
    player_id: data.player_id,
    application_status: data.application_status || "UNDER REVIEW",
    created_at: data.created_at,
  });
});

// GET /api/apl/announcement
router.get("/announcement", async (_req, res) => {
  const supabase = createSupabaseClient();
  if (!supabase) return res.json({ announcement: null });
  const { data, error } = await supabase
    .from("announcements")
    .select("text, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1);
  if (error) return res.json({ announcement: null });
  return res.json({ announcement: (data as any[])?.[0] || null });
});

// GET /api/apl/stats
router.get("/stats", async (_req, res) => {
  const supabase = createSupabaseClient();
  if (!supabase) return res.json({ players: 0, franchises: 0, season: 1 });
  const [playersRes, franchisesRes] = await Promise.all([
    supabase.from("players").select("id", { count: "exact", head: true }),
    supabase.from("franchises").select("id", { count: "exact", head: true }),
  ]);
  return res.json({
    players: (playersRes as any).count ?? 0,
    franchises: (franchisesRes as any).count ?? 0,
    season: 1,
  });
});

// GET /api/apl/founding-wall
router.get("/founding-wall", async (_req, res) => {
  const supabase = createSupabaseClient();
  if (!supabase) return res.json({ players: [], franchises: [] });
  const [playersRes, franchisesRes] = await Promise.all([
    supabase.from("players").select("full_name, position, area").eq("payment_status", "completed").eq("application_status", "APPROVED").order("created_at", { ascending: true }),
    supabase.from("franchises").select("team_name, owner_name, team_area").eq("approval_status", "approved").order("created_at", { ascending: true }),
  ]);
  return res.json({
    players: (playersRes.data as any[]) || [],
    franchises: (franchisesRes.data as any[]) || [],
  });
});

// POST /api/apl/contact
router.post("/contact", async (req, res) => {
  const { name, email, phone, subject, message } = req.body || {};
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({ error: "Please fill in all required fields." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  const supabase = createServiceClient();
  try {
    if (supabase) await (supabase as any).from("contact_submissions").insert([{
      name: String(name), email: String(email),
      phone: phone ? String(phone) : null,
      subject: String(subject), message: String(message), is_read: false,
    }]);
  } catch {}
  if (!process.env.RESEND_API_KEY) {
    return res.json({ success: true });
  }
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "APL Contact <contact@apexpremiereleague.in>",
        to: ["contact@apexpremiereleague.in"],
        reply_to: String(email),
        subject: `[APL Contact] ${String(subject)}`,
        html: `<p><strong>${String(name)}</strong> (${String(email)})</p><p>${String(message).replace(/\n/g, "<br/>")}</p>`,
      }),
    });
  } catch {}
  return res.json({ success: true });
});

// POST /api/apl/payments/create
router.post("/payments/create", async (req, res) => {
  try {
    const { email, phone, name } = req.body || {};
    const amount = PLAYER_REGISTRATION_FEE;
    if (!email || !phone || !name) return res.status(400).json({ error: "Missing required fields" });
    const orderId = `APL_${Date.now()}_${uuidv4().split("-")[0]}`;
    const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://apexpremiereleague.in";
    const cashfreeEnvironment = (process.env.CASHFREE_ENVIRONMENT || "PRODUCTION").toUpperCase();
    const isSandbox = cashfreeEnvironment === "TEST" || cashfreeEnvironment === "SANDBOX";
    const cashfreeHost = isSandbox ? "sandbox" : "api";
    const cashfreeAppId = process.env.CASHFREE_APP_ID || "";
    const cashfreeSecret = process.env.CASHFREE_SECRET_KEY || "";
    if (!cashfreeAppId || !cashfreeSecret) {
      return res.status(500).json({ error: "Payment gateway not configured." });
    }
    const cashfreePayload = {
      order_id: orderId, order_amount: amount, order_currency: "INR",
      customer_details: { customer_id: uuidv4(), customer_email: email, customer_phone: phone, customer_name: name },
      order_meta: {
        return_url: `${baseUrl}/payment-callback?order_id={order_id}`,
        notify_url: `${baseUrl}/api/apl/payments/webhook`,
      },
    };
    const cfRes = await fetch(`https://${cashfreeHost}.cashfree.com/pg/orders`, {
      method: "POST",
      headers: { accept: "application/json", "Content-Type": "application/json", "x-api-version": "2022-09-01", "x-client-id": cashfreeAppId, "x-client-secret": cashfreeSecret },
      body: JSON.stringify(cashfreePayload),
      signal: AbortSignal.timeout(15000),
    });
    const responseData = await cfRes.json() as any;
    if (!cfRes.ok) return res.status(cfRes.status).json(responseData);
    return res.json({ orderId, ...responseData, paymentSessionId: responseData.payment_session_id || responseData.order_id, paymentLink: responseData.payment_link || null });
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/apl/payments/verify?order_id=...
router.get("/payments/verify", async (req, res) => {
  const orderId = req.query.order_id as string;
  if (!orderId) return res.status(400).json({ error: "Missing order_id" });
  const cashfreeEnvironment = (process.env.CASHFREE_ENVIRONMENT || "PRODUCTION").toUpperCase();
  const isSandbox = cashfreeEnvironment === "TEST" || cashfreeEnvironment === "SANDBOX";
  const cashfreeHost = isSandbox ? "sandbox" : "api";
  const cashfreeAppId = process.env.CASHFREE_APP_ID || "";
  const cashfreeSecret = process.env.CASHFREE_SECRET_KEY || "";
  if (!cashfreeAppId || !cashfreeSecret) return res.status(500).json({ error: "Payment gateway not configured." });
  try {
    const cfRes = await fetch(`https://${cashfreeHost}.cashfree.com/pg/orders/${orderId}`, {
      method: "GET",
      headers: { accept: "application/json", "x-api-version": "2022-09-01", "x-client-id": cashfreeAppId, "x-client-secret": cashfreeSecret },
      signal: AbortSignal.timeout(15000),
    });
    const responseData = await cfRes.json();
    if (!cfRes.ok) return res.status(cfRes.status).json(responseData);
    return res.json(responseData);
  } catch {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/apl/payments/webhook
router.post("/payments/webhook", async (_req, res) => {
  return res.json({ status: "received" });
});

// POST /api/apl/send-confirmation-email
router.post("/send-confirmation-email", async (req, res) => {
  const { playerName, playerId, email, paymentStatus } = req.body || {};
  if (!playerName || !playerId || !email) return res.status(400).json({ error: "Missing required fields" });
  if (!process.env.RESEND_API_KEY) return res.json({ success: true });
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Apex Premier League <contact@apexpremiereleague.in>",
        to: [String(email)],
        subject: `APL Registration Confirmed — ${String(playerId)}`,
        html: `<h2>Welcome to APL, ${String(playerName)}!</h2><p>Your Player ID: <strong>${String(playerId)}</strong></p><p>Payment: ${String(paymentStatus || "completed")}</p>`,
      }),
    });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to send email" });
  }
});

// POST /api/apl/apex-ai
router.post("/apex-ai", async (req, res) => {
  const messages = (req.body?.messages || []) as Array<{ role: string; content: string }>;
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser?.content) return res.status(400).json({ error: "No message provided" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          system: `You are Apex AI, the official assistant of the Apex Premier League (APL) — Kashmir's first professional franchise football league. Be warm, knowledgeable, and confident. APL: 16 franchises, 288 players, 12-week season, founded 2025, Season 1 in 2026, Baramulla, North Kashmir. Registration fee: ₹249. Website: apexpremiereleague.in. Tagline: Rise Above.`,
          messages: messages.filter((m) => m.role === "user" || m.role === "assistant"),
          max_tokens: 512, temperature: 0.4,
        }),
      });
      if (response.ok) {
        const data = await response.json() as any;
        const reply = data.content?.[0]?.text?.trim();
        if (reply) return res.json({ reply });
      }
    } catch {}
  }
  return res.json({ reply: "Hey! I'm Apex AI — your guide to everything APL. Ask me about registrations, franchises, the season format, or anything APL-related!" });
});

export default router;
