---
name: APL Design System
description: Color tokens, button conventions, and gold-vs-blue rules for public vs admin UI
---

## Color tokens (current)
- `--apl-navy: #07111D` — deepest background
- `--apl-navy-mid: #0c1e34` — secondary dark sections
- `--apl-gold: #D4AF37` — champagne gold for all public accents, section labels, dividers
- `--apl-blue: #1a6bff` — ADMIN-ONLY: form focus rings, admin buttons, AI bubble

## Button conventions
- `.btn-primary` = white bg + `#07111D` text (works on any dark section)
- `.btn-secondary` = transparent + white 1px border
- `.btn-nav-primary` = white bg + navy text (rounded pill in navbar)
- Admin buttons still use blue (`.admin-btn-primary`)

**Why:** Premium sports brand aesthetic (Apple/Nike/F1/UEFA). Blue was overused; gold now signals prestige; white primary buttons pop on dark backgrounds.

## Intro animation
- White (#ffffff) full-screen overlay
- Subtle radial gray glow behind logo
- Logo scale 0.88→1, opacity 0→1 over 0.9s
- "APEX PREMIER LEAGUE" text + gold line animate in at 650ms
- completeIntro() at 2000ms, fade-out over 0.5s, done at 2500ms

## Nav active state
- `.nav-link-float-active` uses gold tint `rgba(212,175,55,0.12)` with gold border ring — NOT blue
