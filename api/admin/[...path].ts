import { readJson, sendJson, serverFetch } from "../_utils/http";
import { getSupabaseConfig, supabaseRequest } from "../_utils/supabase-rest";

const LEAGUE_PLAYER_FEE = 249;

function asArray(value: unknown) {
  return Array.isArray(value) ? value : value ? [String(value)] : [];
}

function normalizeEmail(email: unknown) {
  return String(email || "").trim().toLowerCase();
}

function encodeValue(value: string) {
  return encodeURIComponent(value);
}

async function requireAdmin(req: any, res: any) {
  const config = getSupabaseConfig();
  if (!config) {
    sendJson(res, 503, { error: "Database not configured." });
    return null;
  }

  const authHeader = String(req.headers?.authorization || "");
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }

  const userResponse = await serverFetch(`${config.url}/auth/v1/user`, {
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!userResponse.ok) {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }

  const user = await userResponse.json();
  const email = normalizeEmail(user.email);
  if (!email) {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }

  const admins = await supabaseRequest("admins?select=email", {}, true);
  if (!admins.configured || !admins.response.ok) {
    sendJson(res, 503, { error: "Admin lookup is unavailable." });
    return null;
  }

  const isAdmin = Array.isArray(admins.data) && admins.data.some((row: any) => normalizeEmail(row.email) === email);
  if (!isAdmin) {
    sendJson(res, 403, { error: "Forbidden" });
    return null;
  }

  return { email };
}

function okOrError(res: any, result: any, body: (data: any) => unknown) {
  if (!result.configured) return sendJson(res, 503, { error: "Database not configured." });
  if (!result.response.ok) return sendJson(res, 500, { error: result.data?.message || result.data?.error || "Database request failed." });
  return sendJson(res, 200, body(result.data));
}

async function getRows(path: string) {
  return supabaseRequest(path, {}, true);
}

function filterText(rows: any[], q: string, keys: string[]) {
  const needle = q.trim().toLowerCase();
  if (!needle) return rows;
  return rows.filter((row) => keys.some((key) => String(row[key] || "").toLowerCase().includes(needle)));
}

async function handleStats(res: any) {
  const [playersRes, franchisesRes, latestPlayersRes, latestFranchisesRes, latestContactsRes] = await Promise.all([
    getRows("players?select=application_status,payment_status,created_at"),
    getRows("franchises?select=approval_status,created_at"),
    getRows("players?select=id,full_name,player_id,application_status,created_at&order=created_at.desc&limit=5"),
    getRows("franchises?select=id,owner_name,team_name,approval_status,created_at&order=created_at.desc&limit=5"),
    getRows("contact_submissions?select=id,name,subject,is_read,created_at&order=created_at.desc&limit=5"),
  ]);
  if (!playersRes.configured || !playersRes.response.ok) return okOrError(res, playersRes, () => ({}));
  if (!franchisesRes.configured || !franchisesRes.response.ok) return okOrError(res, franchisesRes, () => ({}));

  const players = Array.isArray(playersRes.data) ? playersRes.data : [];
  const franchises = Array.isArray(franchisesRes.data) ? franchisesRes.data : [];
  const paid = players.filter((p: any) => p.payment_status === "completed");
  return sendJson(res, 200, {
    totalPlayers: players.length,
    approvedPlayers: players.filter((p: any) => p.application_status === "APPROVED").length,
    pendingPlayers: players.filter((p: any) => ["UNDER REVIEW", "PENDING VERIFICATION"].includes(p.application_status || "")).length,
    rejectedPlayers: players.filter((p: any) => p.application_status === "REJECTED").length,
    franchiseApplications: franchises.length,
    approvedFranchises: franchises.filter((f: any) => f.approval_status === "approved").length,
    pendingFranchises: franchises.filter((f: any) => f.approval_status === "pending").length,
    totalRegistrations: players.length + franchises.length,
    revenue: paid.length * LEAGUE_PLAYER_FEE,
    latestPlayers: latestPlayersRes.configured && latestPlayersRes.response.ok ? latestPlayersRes.data || [] : [],
    latestFranchises: latestFranchisesRes.configured && latestFranchisesRes.response.ok ? latestFranchisesRes.data || [] : [],
    latestContacts: latestContactsRes.configured && latestContactsRes.response.ok ? latestContactsRes.data || [] : [],
  });
}

async function handlePlayers(req: any, res: any, id?: string) {
  if (req.method === "PATCH" && id) {
    const body = await readJson(req);
    const status = body.application_status;
    if (!["APPROVED", "REJECTED", "UNDER REVIEW", "PENDING VERIFICATION"].includes(status)) return sendJson(res, 400, { error: "Invalid status" });
    const result = await supabaseRequest(`players?id=eq.${encodeValue(id)}&select=*`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ application_status: status }),
    });
    return okOrError(res, result, (data) => ({ player: Array.isArray(data) ? data[0] : data }));
  }

  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
  const page = Math.max(1, Number(req.query?.page || 1));
  const status = String(req.query?.status || "");
  const q = String(req.query?.q || "");
  const filter = status ? `&application_status=eq.${encodeValue(status)}` : "";
  const result = await getRows(`players?select=*&order=created_at.desc${filter}`);
  return okOrError(res, result, (data) => {
    const rows = filterText(Array.isArray(data) ? data : [], q, ["full_name", "email", "player_id", "contact_number", "area"]);
    const limit = 20;
    const total = rows.length;
    return { players: rows.slice((page - 1) * limit, page * limit), total, page, pages: Math.ceil(total / limit) };
  });
}

async function handleFranchises(req: any, res: any, id?: string) {
  if (req.method === "PATCH" && id) {
    const body = await readJson(req);
    const status = body.approval_status;
    if (!["pending", "approved", "rejected"].includes(status)) return sendJson(res, 400, { error: "Invalid status" });
    const result = await supabaseRequest(`franchises?id=eq.${encodeValue(id)}&select=*`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ approval_status: status }),
    });
    return okOrError(res, result, (data) => ({ franchise: Array.isArray(data) ? data[0] : data }));
  }

  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
  const status = String(req.query?.status || "");
  const q = String(req.query?.q || "");
  const filter = status ? `&approval_status=eq.${encodeValue(status)}` : "";
  const result = await getRows(`franchises?select=*&order=created_at.desc${filter}`);
  return okOrError(res, result, (data) => ({ franchises: filterText(Array.isArray(data) ? data : [], q, ["owner_name", "email", "team_name", "team_area"]) }));
}

async function handleContact(req: any, res: any, id?: string) {
  if (req.method === "PATCH" && id) {
    const body = await readJson(req);
    const result = await supabaseRequest(`contact_submissions?id=eq.${encodeValue(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ is_read: Boolean(body.is_read) }),
    });
    return okOrError(res, result, () => ({ success: true }));
  }
  if (req.method === "DELETE" && id) {
    const result = await supabaseRequest(`contact_submissions?id=eq.${encodeValue(id)}`, { method: "DELETE" });
    return okOrError(res, result, () => ({ success: true }));
  }
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
  const q = String(req.query?.q || "");
  const result = await getRows("contact_submissions?select=*&order=created_at.desc");
  return okOrError(res, result, (data) => ({ submissions: filterText(Array.isArray(data) ? data : [], q, ["name", "email", "subject", "message"]) }));
}

async function handleAnnouncement(req: any, res: any) {
  if (req.method === "GET") {
    const result = await getRows("announcements?select=*&order=created_at.desc&limit=1");
    return okOrError(res, result, (data) => ({ announcement: Array.isArray(data) ? data[0] || null : null }));
  }
  if (req.method === "POST") {
    const body = await readJson(req);
    const text = String(body.text || "").trim();
    if (!text) return sendJson(res, 400, { error: "Announcement text is required." });
    const existing = await getRows("announcements?select=id&limit=1");
    if (!existing.configured || !existing.response.ok) return okOrError(res, existing, () => ({}));
    const current = Array.isArray(existing.data) ? existing.data[0] : null;
    const result = current
      ? await supabaseRequest(`announcements?id=eq.${encodeValue(current.id)}`, { method: "PATCH", body: JSON.stringify({ text, is_active: Boolean(body.is_active) }) })
      : await supabaseRequest("announcements", { method: "POST", body: JSON.stringify([{ text, is_active: Boolean(body.is_active) }]) });
    return okOrError(res, result, () => ({ success: true }));
  }
  return sendJson(res, 405, { error: "Method not allowed." });
}

async function handlePayments(req: any, res: any) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed." });
  const result = await getRows("players?select=id,full_name,player_id,email,payment_status,order_id,created_at&order=created_at.desc");
  return okOrError(res, result, (data) => {
    const payments = (Array.isArray(data) ? data : []).map((p: any) => ({
      id: p.id,
      playerName: p.full_name,
      playerId: p.player_id,
      email: p.email,
      amount: LEAGUE_PLAYER_FEE,
      paymentStatus: p.payment_status,
      date: p.created_at,
      orderId: p.order_id,
    }));
    return { payments, revenue: payments.filter((p: any) => p.paymentStatus === "completed").reduce((sum: number, p: any) => sum + p.amount, 0) };
  });
}

export default async function handler(req: any, res: any) {
  const auth = await requireAdmin(req, res);
  if (!auth) return;

  const parts = asArray(req.query?.path);
  const resource = parts[0] || "";
  const id = parts[1];

  try {
    if (resource === "stats") return handleStats(res);
    if (resource === "players") return handlePlayers(req, res, id);
    if (resource === "franchises") return handleFranchises(req, res, id);
    if (resource === "contact") return handleContact(req, res, id);
    if (resource === "announcement") return handleAnnouncement(req, res);
    if (resource === "payments") return handlePayments(req, res);
    return sendJson(res, 404, { error: "Not found." });
  } catch {
    return sendJson(res, 500, { error: "Admin API request failed." });
  }
}
