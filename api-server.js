const http = require('http');
const url = require('url');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env files
function loadEnv() {
  const envPaths = [
    '/vercel/share/.env.project',
    path.join(__dirname, '.env.development.local'),
    path.join(__dirname, '.env.local'),
  ];

  for (const envPath of envPaths) {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').replace(/^['"]|['"]$/g, '');
        if (key && !process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

loadEnv();

// Load environment variables
const env = (key) => process.env[key];

// HTTP utilities
const sendJson = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};

const methodNotAllowed = (res, methods) => {
  res.writeHead(405, { 'Allow': methods.join(', ') });
  res.end(JSON.stringify({ error: 'Method not allowed' }));
};

// Supabase utilities
async function serverFetch(urlStr, options = {}) {
  const response = await fetch(urlStr, options);
  return response;
}

function getSupabaseConfig() {
  const url = env("SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL") || env("VITE_SUPABASE_URL");
  const anonKey = env("SUPABASE_ANON_KEY") || env("NEXT_PUBLIC_SUPABASE_ANON_KEY") || env("VITE_SUPABASE_ANON_KEY");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY") || anonKey;
  if (!url || !anonKey) return null;
  return { url: url.replace(/\/$/, ''), anonKey, serviceKey };
}

async function supabaseGet(path, signal) {
  const config = getSupabaseConfig();
  if (!config) return { configured: false };

  const key = config.serviceKey || config.anonKey;
  const response = await serverFetch(`${config.url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
    signal,
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  return { configured: true, response, data };
}

async function supabaseInsert(table, payload, signal) {
  const config = getSupabaseConfig();
  if (!config) return { configured: false };

  const response = await serverFetch(`${config.url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: config.serviceKey,
      Authorization: `Bearer ${config.serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(payload),
    signal,
  });
  const text = await response.text();
  return { configured: true, response, data: text ? JSON.parse(text) : null };
}

// Status handler
async function handleStatus(req, res, query) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  const playerId = String(query.player_id || "").trim().toUpperCase();
  const VALID_PLAYER_ID = /^APL-\d{4,5}$/i;
  
  if (!VALID_PLAYER_ID.test(playerId)) {
    return sendJson(res, 400, { error: "Enter a valid Player ID, for example APL-4821." });
  }

  try {
    const result = await supabaseGet(
      `players?player_id=eq.${encodeURIComponent(playerId)}&select=player_id,application_status,created_at&limit=1`,
      undefined
    );

    if (!result.configured) {
      return sendJson(res, 503, { error: "Status lookup is temporarily unavailable. Database is not configured." });
    }
    if (!result.response.ok) {
      return sendJson(res, 502, { error: "Unable to verify application status right now." });
    }

    const row = Array.isArray(result.data) ? result.data[0] : null;
    if (!row) return sendJson(res, 404, { error: "No application was found for this Player ID." });

    return sendJson(res, 200, {
      player_id: row.player_id,
      application_status: row.application_status || "UNDER REVIEW",
      created_at: row.created_at,
    });
  } catch (err) {
    console.error('[Status API Error]', err.message);
    return sendJson(res, 504, { error: "Status lookup is taking too long. Please try again." });
  }
}

// Contact handler
async function handleContact(req, res, query, body) {
  if (req.method !== "POST") return methodNotAllowed(res, ["POST"]);

  try {
    const payload = body || {};
    const result = await supabaseInsert('contact_submissions', payload, undefined);

    if (!result.configured) {
      return sendJson(res, 503, { error: "Contact form is temporarily unavailable." });
    }
    if (!result.response.ok) {
      return sendJson(res, 502, { error: "Failed to submit contact form." });
    }

    return sendJson(res, 200, { success: true, message: "Your message has been sent successfully!" });
  } catch (err) {
    console.error('[Contact API Error]', err.message);
    return sendJson(res, 500, { error: "An error occurred while submitting the form." });
  }
}

// Stats handler
async function handleStats(req, res, query) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const [players, franchises] = await Promise.all([
      supabaseGet("players?select=id"),
      supabaseGet("franchises?select=id"),
    ]);
    return sendJson(res, 200, {
      players: players.configured && players.response.ok && Array.isArray(players.data) ? players.data.length : 0,
      franchises: franchises.configured && franchises.response.ok && Array.isArray(franchises.data) ? franchises.data.length : 0,
      season: 1,
    });
  } catch {
    return sendJson(res, 200, { players: 0, franchises: 0, season: 1 });
  }
}

// Announcement handler
async function handleAnnouncement(req, res, query) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const result = await supabaseGet("announcements?is_active=eq.true&select=text,is_active&order=created_at.desc&limit=1");
    const announcement = result.configured && result.response.ok && Array.isArray(result.data) ? result.data[0] || null : null;
    return sendJson(res, 200, { announcement });
  } catch {
    return sendJson(res, 200, { announcement: null });
  }
}

// Founding wall handler
async function handleFoundingWall(req, res, query) {
  if (req.method !== "GET") return methodNotAllowed(res, ["GET"]);

  try {
    const [players, franchises] = await Promise.all([
      supabaseGet("players?payment_status=eq.completed&application_status=eq.APPROVED&select=full_name,position,area&order=created_at.asc"),
      supabaseGet("franchises?approval_status=eq.approved&select=team_name,owner_name,team_area&order=created_at.asc"),
    ]);
    return sendJson(res, 200, {
      players: players.configured && players.response.ok && Array.isArray(players.data) ? players.data : [],
      franchises: franchises.configured && franchises.response.ok && Array.isArray(franchises.data) ? franchises.data : [],
    });
  } catch {
    return sendJson(res, 200, { players: [], franchises: [] });
  }
}

// Create server
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);

  // Parse body for POST requests
  let body = '';
  if (req.method === 'POST' || req.method === 'PUT') {
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        body = body ? JSON.parse(body) : {};
      } catch {
        body = {};
      }

      // Route requests
      if (pathname === '/api/apl/status') {
        await handleStatus(req, res, query);
      } else if (pathname === '/api/apl/contact') {
        await handleContact(req, res, query, body);
      } else if (pathname === '/api/apl/stats') {
        await handleStats(req, res, query);
      } else if (pathname === '/api/apl/announcement') {
        await handleAnnouncement(req, res, query);
      } else if (pathname === '/api/apl/founding-wall') {
        await handleFoundingWall(req, res, query);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    });
  } else {
    // Route GET requests immediately
    if (pathname === '/api/apl/status') {
      await handleStatus(req, res, query);
    } else if (pathname === '/api/apl/contact') {
      await handleContact(req, res, query, body);
    } else if (pathname === '/api/apl/stats') {
      await handleStats(req, res, query);
    } else if (pathname === '/api/apl/announcement') {
      await handleAnnouncement(req, res, query);
    } else if (pathname === '/api/apl/founding-wall') {
      await handleFoundingWall(req, res, query);
    } else if (pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  }
});

const PORT = 8080;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`[✓] API Server running on port ${PORT}`);
  console.log(`    Status API: POST /api/apl/status?player_id=APL-XXXX`);
  console.log(`    Contact API: POST /api/apl/contact`);
  console.log(`    Health check: GET /health`);
});

server.on('error', (err) => {
  console.error('[✗] Server error:', err);
  process.exit(1);
});
