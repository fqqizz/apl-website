---
name: APL Migration Quirks
description: Key decisions and gotchas from the Apex Premier League Next.js→Vite migration
---

# APL Migration Quirks

**Why:** Non-obvious issues discovered during the Next.js → Vite + React migration.

## Font Hosting
Google Fonts `<link>` in index.html causes 502 errors — Replit's proxy blocks external CDN requests. Use `@fontsource/bebas-neue` and `@fontsource/dm-sans` imported as CSS in main.tsx. Must add both packages to `optimizeDeps.exclude` in vite.config.ts (they ship CSS files, not JS modules).

**How to apply:** Any new font needs to use @fontsource self-hosted, not Google Fonts link tags.

## Button Filename Casing Conflict
TypeScript treats `button.tsx` and `Button.tsx` as the same file on case-insensitive filesystems. The shadcn button was renamed to `shadcn-button.tsx`. Internal shadcn UI components (alert-dialog, calendar, carousel, input-group, pagination, sidebar) import from `@/components/ui/shadcn-button`.

**How to apply:** Never create a shadcn component with the same base name (case-insensitive) as an APL custom component.

## API Server Port
api-server runs on port **8080** (not 5000). Vite proxies `/api` → `http://localhost:8080` in vite.config.ts.

## Supabase Graceful Degradation
Routes must check if Supabase client is null (when env vars not set) and return empty/503 responses. The `createClient("", "")` call throws synchronously — always guard with null check before using the client. Public endpoints return sensible defaults (empty arrays, zero counts). Admin endpoints return 503.

## Intro Animation
The APL intro animation overlays the full screen for 3.2 seconds on every page load. Screenshots taken immediately after navigation appear completely black — this is intentional, not a crash.
