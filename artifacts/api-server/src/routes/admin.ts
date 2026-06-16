import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();

const LEAGUE_PLAYER_FEE = 249;

function createServiceClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function requireAdmin(req: Request, res: Response): Promise<{ ok: true; email: string } | { ok: false }> {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return { ok: false };
  }
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!url || !anonKey) {
    res.status(503).json({ error: "Database not configured." });
    return { ok: false };
  }
  const authClient = createClient(url, anonKey, { auth: { persistSession: false } });
  const { data: { user }, error } = await authClient.auth.getUser(token);
  if (error || !user?.email) {
    res.status(401).json({ error: "Unauthorized" });
    return { ok: false };
  }
  const db = createServiceClient() as any;
  const { data: admins } = await db.from("admins").select("email");
  const isAdmin = (admins || []).some((a: any) => a.email?.toLowerCase() === user.email!.toLowerCase());
  if (!isAdmin) {
    res.status(403).json({ error: "Forbidden" });
    return { ok: false };
  }
  return { ok: true, email: user.email };
}

// GET /api/admin/stats
router.get("/stats", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const db = createServiceClient() as any;
  const [playersRes, franchisesRes, latestPlayersRes, latestFranchisesRes, latestContactsRes] = await Promise.all([
    db.from("players").select("application_status, payment_status, created_at"),
    db.from("franchises").select("approval_status, created_at"),
    db.from("players").select("id, full_name, player_id, application_status, created_at").order("created_at", { ascending: false }).limit(5),
    db.from("franchises").select("id, owner_name, team_name, approval_status, created_at").order("created_at", { ascending: false }).limit(5),
    db.from("contact_submissions").select("id, name, subject, is_read, created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  const list = playersRes.data || [];
  const approved = list.filter((p: any) => p.application_status === "APPROVED").length;
  const pending = list.filter((p: any) => ["UNDER REVIEW", "PENDING VERIFICATION"].includes(p.application_status || "")).length;
  const rejected = list.filter((p: any) => p.application_status === "REJECTED").length;
  const paid = list.filter((p: any) => p.payment_status === "completed");
  const revenue = paid.length * LEAGUE_PLAYER_FEE;
  const flist = franchisesRes.data || [];
  const fApproved = flist.filter((f: any) => f.approval_status === "approved").length;
  const fPending = flist.filter((f: any) => f.approval_status === "pending").length;
  return res.json({
    totalPlayers: list.length, approvedPlayers: approved, pendingPlayers: pending, rejectedPlayers: rejected,
    franchiseApplications: flist.length, approvedFranchises: fApproved, pendingFranchises: fPending,
    totalRegistrations: list.length + flist.length, revenue,
    latestPlayers: latestPlayersRes.data || [], latestFranchises: latestFranchisesRes.data || [], latestContacts: latestContactsRes.data || [],
  });
});

// GET /api/admin/players
router.get("/players", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const q = ((req.query.q as string) || "").trim().toLowerCase();
  const status = (req.query.status as string) || "";
  const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
  const limit = 20;
  const db = createServiceClient() as any;
  let query = db.from("players").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (status) query = query.eq("application_status", status);
  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  let rows = data || [];
  if (q) {
    rows = rows.filter((p: any) =>
      p.full_name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) ||
      p.player_id?.toLowerCase().includes(q) || p.contact_number?.includes(q) || p.area?.toLowerCase().includes(q)
    );
  }
  const total = q || status ? rows.length : count || rows.length;
  const paged = rows.slice((page - 1) * limit, page * limit);
  return res.json({ players: paged, total, page, pages: Math.ceil(total / limit) });
});

// PATCH /api/admin/players/:id
router.patch("/players/:id", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const { id } = req.params;
  const { application_status } = req.body || {};
  const VALID = ["APPROVED", "REJECTED", "UNDER REVIEW", "PENDING VERIFICATION"];
  if (!VALID.includes(application_status)) return res.status(400).json({ error: "Invalid status" });
  const db = createServiceClient() as any;
  const { data, error } = await db.from("players").update({ application_status }).eq("id", id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ player: data });
});

// GET /api/admin/franchises
router.get("/franchises", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const q = ((req.query.q as string) || "").trim().toLowerCase();
  const status = (req.query.status as string) || "";
  const db = createServiceClient() as any;
  let query = db.from("franchises").select("*").order("created_at", { ascending: false });
  if (status) query = query.eq("approval_status", status);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  let rows = data || [];
  if (q) {
    rows = rows.filter((f: any) =>
      f.owner_name?.toLowerCase().includes(q) || f.email?.toLowerCase().includes(q) ||
      f.team_name?.toLowerCase().includes(q) || f.team_area?.toLowerCase().includes(q)
    );
  }
  return res.json({ franchises: rows });
});

// PATCH /api/admin/franchises/:id
router.patch("/franchises/:id", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const { id } = req.params;
  const { approval_status } = req.body || {};
  const VALID = ["pending", "approved", "rejected"];
  if (!VALID.includes(approval_status)) return res.status(400).json({ error: "Invalid status" });
  const db = createServiceClient() as any;
  const { data, error } = await db.from("franchises").update({ approval_status }).eq("id", id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ franchise: data });
});

// GET /api/admin/contact
router.get("/contact", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const q = (req.query.q as string) || "";
  const db = createServiceClient() as any;
  let query = db.from("contact_submissions").select("*").order("created_at", { ascending: false });
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,subject.ilike.%${q}%,message.ilike.%${q}%`);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ submissions: data || [] });
});

// PATCH /api/admin/contact/:id
router.patch("/contact/:id", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const { id } = req.params;
  const { is_read } = req.body || {};
  const db = createServiceClient() as any;
  const { error } = await db.from("contact_submissions").update({ is_read }).eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

// DELETE /api/admin/contact/:id
router.delete("/contact/:id", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const { id } = req.params;
  const db = createServiceClient() as any;
  const { error } = await db.from("contact_submissions").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

// GET /api/admin/announcement
router.get("/announcement", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const db = createServiceClient() as any;
  const { data, error } = await db.from("announcements").select("*").order("created_at", { ascending: false }).limit(1);
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ announcement: data?.[0] || null });
});

// POST /api/admin/announcement
router.post("/announcement", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const { text, is_active } = req.body || {};
  if (!text?.trim()) return res.status(400).json({ error: "Announcement text is required." });
  const db = createServiceClient() as any;
  const { data: existing } = await db.from("announcements").select("id").limit(1);
  let error;
  if (existing && existing.length > 0) {
    const { error: e } = await db.from("announcements").update({ text: text.trim(), is_active }).eq("id", existing[0].id);
    error = e;
  } else {
    const { error: e } = await db.from("announcements").insert([{ text: text.trim(), is_active }]);
    error = e;
  }
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true });
});

// GET /api/admin/payments
router.get("/payments", async (req, res) => {
  const auth = await requireAdmin(req, res);
  if (!auth.ok) return;
  const db = createServiceClient() as any;
  const { data, error } = await db.from("players").select("id, full_name, player_id, email, payment_status, order_id, created_at").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  const payments = (data || []).map((p: any) => ({
    id: p.id, playerName: p.full_name, playerId: p.player_id, email: p.email,
    amount: LEAGUE_PLAYER_FEE, paymentStatus: p.payment_status, date: p.created_at, orderId: p.order_id,
  }));
  const revenue = payments.filter((p: any) => p.paymentStatus === "completed").reduce((sum: number, p: any) => sum + p.amount, 0);
  return res.json({ payments, revenue });
});

export default router;
