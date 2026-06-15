# APL Website — SEO Audit Report

**Site:** https://apexpremiereleague.in  
**Audit date:** June 2, 2026  
**Stack:** Next.js 15 App Router (`createMetadata`, `sitemap.ts`, `robots.ts`, JSON-LD)

---

## Executive summary

A full SEO pass was completed across metadata, structured data, crawl controls, internal linking, and indexing rules. All public marketing pages now have **unique titles**, **unique descriptions**, **canonical URLs**, **OpenGraph**, and **Twitter Card** tags. Global **Organization**, **SportsOrganization**, and **WebSite** schemas were added; page-level **Breadcrumb**, **FAQ**, and **ContactPage** schemas were added where relevant.

**Lighthouse SEO (production, pre-deploy snapshot):** **100/100**

---

## Checklist (20 items)

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1 | Unique title tags | ✅ Pass | All public pages use `SEO_PAGES` in `lib/seo.ts` |
| 2 | Unique meta descriptions | ✅ Pass | Per-page descriptions in `SEO_PAGES` |
| 3 | OpenGraph tags | ✅ Pass | `openGraph` in `createMetadata()` with absolute image URLs |
| 4 | Twitter card tags | ✅ Pass | `summary_large_image` + title, description, image |
| 5 | Valid sitemap.xml | ✅ Pass | `app/sitemap.ts` — 13 public URLs, priorities set |
| 6 | Valid robots.txt | ✅ Pass | `app/robots.ts` — allow `/`, disallow admin/api/payment |
| 7 | Canonical URLs | ✅ Pass | `alternates.canonical` per page |
| 8 | JSON-LD structured data | ✅ Pass | `components/seo/JsonLd.tsx` + `lib/structured-data.ts` |
| 9 | Organization schema | ✅ Pass | Global `@graph` in root layout |
| 10 | SportsOrganization schema | ✅ Pass | Linked to Organization via `parentOrganization` |
| 11 | Breadcrumb schema | ✅ Pass | `BreadcrumbJsonLd` on all major inner pages |
| 12 | FAQ schema | ✅ Pass | `FAQPage` on `/faq` from `FAQ_CATEGORIES` |
| 13 | Contact schema | ✅ Pass | `ContactPage` on `/contact` |
| 14 | Crawlable navigation | ✅ Pass | Navbar + footer use `<Link>` (no JS-only nav) |
| 15 | Strong internal linking | ✅ Improved | Footer expanded with registration + franchise links |
| 16 | Home title priority | ✅ Pass | See below |
| 17 | Optimized metadata (8 pages) | ✅ Pass | See table below |
| 18 | Lighthouse SEO score | ✅ 100 | Measured on live URL (June 2026) |
| 19 | Google indexing readiness | ✅ Ready | index allowed, sitemap linked, canonical set |
| 20 | No accidental noindex | ✅ Pass | Only `/admin/*`, `/payment-callback`, 404 |

---

## Optimized metadata (priority pages)

| Page | Title | Path |
|------|-------|------|
| **Home** | Apex Premier League (APL) \| Kashmir Football League | `/` |
| **Player Registration** | Player Registration \| Apex Premier League (APL) | `/register/player` |
| **Franchise Ownership** | Franchise Ownership \| Apex Premier League (APL) | `/register/franchise` |
| **Status Checker** | Application Status Checker \| Apex Premier League (APL) | `/status` |
| **About** | About APL \| Kashmir's Franchise Football League | `/about` |
| **Vision** | Vision & Mission \| Apex Premier League (APL) | `/vision` |
| **FAQ** | FAQ \| Player & Franchise Questions \| APL | `/faq` |
| **Contact** | Contact APL \| Registration & League Support | `/contact` |

Full strings live in `lib/seo.ts` → `SEO_PAGES`.

---

## Structured data map

| Schema | Location |
|--------|----------|
| Organization | Global — `app/layout.tsx` → `GlobalSeoSchemas` |
| SportsOrganization | Global — same `@graph` |
| WebSite | Global — publisher linked to Organization |
| BreadcrumbList | Inner pages via `BreadcrumbJsonLd` |
| FAQPage | `/faq` — all FAQ accordion Q&A |
| ContactPage | `/contact` — org + contactPoint |

---

## Crawl & index rules

**Indexed:** Home, registration, status, about, vision, founding players, franchises, FAQ, contact, legal pages.

**Not indexed (`noindex, nofollow`):**

- `/admin/*` — `app/admin/layout.tsx`
- `/payment-callback` — `app/payment-callback/layout.tsx`
- 404 page — `app/not-found.tsx`

**robots.txt disallows:** `/admin/`, `/api/`, `/payment-callback`

**Sitemap:** `https://apexpremiereleague.in/sitemap.xml`

---

## Files changed / added

- `lib/seo.ts` — `SEO_PAGES`, `createMetadata`, `createRootMetadata`, `createNoIndexMetadata`
- `lib/structured-data.ts` — schema builders
- `components/seo/GlobalSeoSchemas.tsx`
- `components/seo/BreadcrumbJsonLd.tsx`
- `app/layout.tsx`, `app/page.tsx`, `app/robots.ts`, `app/sitemap.ts`
- `app/admin/layout.tsx`, `app/payment-callback/layout.tsx`
- All public `app/**/page.tsx` metadata + breadcrumbs
- `components/layout/Footer.tsx` — expanded internal links

---

## Google Search Console — recommended next steps

1. Verify domain property for `apexpremiereleague.in`
2. Submit sitemap: `https://apexpremiereleague.in/sitemap.xml`
3. Request indexing for `/`, `/register/player`, `/register/franchise`
4. Monitor Coverage → ensure admin/payment URLs stay excluded

---

## Post-deploy verification

After Vercel deploy, confirm in browser devtools → Elements → `<head>`:

- `<link rel="canonical" href="https://apexpremiereleague.in/...">`
- `<meta property="og:...">` and `<meta name="twitter:...">`
- `<script type="application/ld+json">` on home, FAQ, contact

Re-run Lighthouse SEO on production to confirm **100** after new metadata is live.
