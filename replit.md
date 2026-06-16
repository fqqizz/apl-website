# Apex Premier League

Kashmir's first professional franchise football league — a full-stack web app with public registration pages, admin dashboard, and AI-powered chat.

## Run & Operate

- `pnpm --filter @workspace/apex-premier-league run dev` — run the frontend (port assigned by Replit)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: Vite + React, wouter (routing), framer-motion, Tailwind CSS, @fontsource (self-hosted fonts)
- API: Express 5, port 8080, esbuild bundle
- DB: Supabase (PostgreSQL via @supabase/supabase-js)
- Payments: Cashfree
- Email: Resend
- AI: Anthropic Claude (apex-ai endpoint)

## Where things live

- `artifacts/apex-premier-league/src/` — React frontend (pages, components, lib)
- `artifacts/apex-premier-league/src/App.tsx` — all routes (wouter)
- `artifacts/apex-premier-league/src/index.css` — APL design system (CSS vars, typography, buttons, glass cards)
- `artifacts/apex-premier-league/public/` — static assets (logo, media images, fonts, PDFs)
- `artifacts/api-server/src/routes/apl.ts` — public API routes (/api/apl/*)
- `artifacts/api-server/src/routes/admin.ts` — admin API routes (/api/admin/*, requires auth header)
- `artifacts/apex-premier-league/vite.config.ts` — Vite config with /api proxy → port 8080

## Architecture decisions

- **No Next.js** — migrated from Next.js to Vite + React + wouter for Replit pnpm-workspace compatibility
- **Self-hosted fonts** — @fontsource/bebas-neue + @fontsource/dm-sans instead of Google Fonts (Replit proxy blocks external CDN requests)
- **Express handles all server-side logic** — Supabase, Cashfree, Resend, Anthropic calls stay in api-server; frontend uses VITE_SUPABASE_* vars only for direct client queries
- **Graceful degradation** — API routes return empty/503 responses when env vars (SUPABASE_URL, etc.) are not set, so the frontend renders without crashing
- **shadcn button renamed to shadcn-button.tsx** — avoids TS filename casing conflict with APL's custom Button.tsx

## Product

- **Public pages**: Home, About, Vision, Founding Players wall, Founding Franchises wall, Partners, FAQ, Contact, Register Player, Register Franchise, Payment Callback, Status checker, Privacy Policy, Refund Policy, T&C
- **Admin panel**: /admin/login → protected dashboard, players, franchises, payments, contact, announcements pages
- **Apex AI**: floating chat widget powered by Claude (falls back to static response without API key)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The intro animation covers the full screen for 3.2 seconds on each page load — screenshots taken immediately after load will appear black; this is intentional design
- API server runs on port 8080 (not 5000); Vite proxies `/api` → `http://localhost:8080`
- `@fontsource` packages must be excluded from Vite's `optimizeDeps` — they ship CSS, not JS modules
- Admin routes require a valid Supabase JWT Bearer token; without SUPABASE_URL + keys set, they return 503

## Required env vars

**Frontend** (`VITE_*` in apex-premier-league):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CASHFREE_ENVIRONMENT` (optional, default PRODUCTION)

**API server**:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CASHFREE_APP_ID`
- `CASHFREE_SECRET_KEY`
- `RESEND_API_KEY`
- `ANTHROPIC_API_KEY`
- `APP_URL` (base URL for payment callbacks)
