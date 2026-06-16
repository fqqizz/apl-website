# APL Database Guide

## Supabase Project

- **URL**: `https://bsdszdyetdrwwkjpeglj.supabase.co`
- **Dashboard**: `https://supabase.com/dashboard/project/bsdszdyetdrwwkjpeglj`

> **Note**: The API keys (`sb_publishable_...` / `sb_secret_...`) you provided are Supabase management/billing keys. The actual API keys needed for the application are:
> - **Anon Key** (public): Found in Dashboard → Settings → API → `anon` `public` — starts with `eyJ...`
> - **Service Role Key** (secret): Found in Dashboard → Settings → API → `service_role` `secret` — starts with `eyJ...`
>
> Go to: https://supabase.com/dashboard/project/bsdszdyetdrwwkjpeglj/settings/api

---

## Tables

Run the following SQL in the **Supabase SQL Editor** (Dashboard → SQL Editor → New Query):

```sql
-- ==========================================
-- APL DATABASE SCHEMA
-- Run this entire block in Supabase SQL Editor
-- ==========================================

-- 1. Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  position TEXT NOT NULL,
  preferred_foot TEXT NOT NULL DEFAULT 'Right',
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  instagram TEXT,
  area TEXT NOT NULL,
  photo_url TEXT,
  id_url TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  order_id TEXT UNIQUE,
  player_id TEXT UNIQUE,
  application_status TEXT DEFAULT 'UNDER REVIEW',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Franchises table
CREATE TABLE IF NOT EXISTS franchises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  team_area TEXT NOT NULL,
  team_name TEXT,
  team_colors TEXT,
  squad_estimate TEXT,
  manager_name TEXT,
  instagram TEXT,
  previous_experience TEXT,
  logo_url TEXT,
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Admin audit log
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Contact submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Announcements
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_players_player_id ON players(player_id);
CREATE INDEX IF NOT EXISTS idx_players_order_id ON players(order_id);
CREATE INDEX IF NOT EXISTS idx_players_email ON players(email);
CREATE INDEX IF NOT EXISTS idx_players_application_status ON players(application_status);
CREATE INDEX IF NOT EXISTS idx_franchises_approval_status ON franchises(approval_status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_is_read ON contact_submissions(is_read);
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);

-- ==========================================
-- PLAYER ID AUTO-GENERATION (Trigger)
-- Generates APL-XXXX format IDs automatically
-- ==========================================
CREATE OR REPLACE FUNCTION generate_player_id()
RETURNS TRIGGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(player_id FROM 5) AS INTEGER)), 1000) + 1
  INTO next_num
  FROM players
  WHERE player_id IS NOT NULL AND player_id ~ '^APL-[0-9]+$';
  
  NEW.player_id := 'APL-' || next_num;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_player_id ON players;
CREATE TRIGGER set_player_id
  BEFORE INSERT ON players
  FOR EACH ROW
  WHEN (NEW.player_id IS NULL)
  EXECUTE FUNCTION generate_player_id();

-- ==========================================
-- INSERT FIRST ADMIN
-- ==========================================
INSERT INTO admins (email) VALUES ('getinfo.faaiz@gmail.com')
ON CONFLICT (email) DO NOTHING;
```

---

## Storage Buckets

Create these in Dashboard → Storage → New Bucket:

1. **`player-uploads`** — Public bucket
   - Used for player photos and ID documents
   
2. **`franchise-uploads`** — Public bucket
   - Used for franchise logos

---

## RLS Policies

Run in SQL Editor:

```sql
-- Enable RLS on all tables
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE franchises ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Players: anon can insert, service role can do everything
CREATE POLICY "Allow anonymous player registration" ON players
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow service role full access to players" ON players
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Allow anon to read own player by order_id" ON players
  FOR SELECT TO anon USING (true);

-- Franchises: anon can insert, service role can do everything
CREATE POLICY "Allow anonymous franchise registration" ON franchises
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow service role full access to franchises" ON franchises
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Admins: service role only
CREATE POLICY "Allow service role full access to admins" ON admins
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Audit log: service role only
CREATE POLICY "Allow service role full access to audit log" ON admin_audit_log
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Contact: anon can insert, service role can do everything
CREATE POLICY "Allow anonymous contact submission" ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow service role full access to contact" ON contact_submissions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Announcements: anon can read active, service role can do everything
CREATE POLICY "Allow anon to read active announcements" ON announcements
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Allow service role full access to announcements" ON announcements
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Storage policies
INSERT INTO storage.buckets (id, name, public) VALUES ('player-uploads', 'player-uploads', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('franchise-uploads', 'franchise-uploads', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Allow public upload to player-uploads" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'player-uploads');

CREATE POLICY "Allow public read from player-uploads" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'player-uploads');

CREATE POLICY "Allow public upload to franchise-uploads" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'franchise-uploads');

CREATE POLICY "Allow public read from franchise-uploads" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'franchise-uploads');
```

---

## Environment Variables

### For Vercel (Production)

Set these in Vercel → Project Settings → Environment Variables:

| Variable | Where to Find |
|----------|--------------|
| `VITE_SUPABASE_URL` | Dashboard → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Dashboard → Settings → API → `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Dashboard → Settings → API → `service_role` `secret` key |
| `CASHFREE_APP_ID` | Cashfree dashboard |
| `CASHFREE_SECRET_KEY` | Cashfree dashboard |
| `CASHFREE_ENVIRONMENT` | `PRODUCTION` or `SANDBOX` |
| `APP_URL` | `https://apexpremiereleague.in` |

### For Local Development

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://bsdszdyetdrwwkjpeglj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (get from dashboard)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (get from dashboard)
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret
CASHFREE_ENVIRONMENT=SANDBOX
APP_URL=http://localhost:3000
```

---

## Table Relationships

```
players
├── player_id (auto-generated: APL-1001, APL-1002, ...)
├── order_id → links to Cashfree payment
└── photo_url / id_url → links to Storage

franchises
├── logo_url → links to Storage
└── approval_status (pending / approved / rejected)

admins
└── email → matches Supabase Auth user email

admin_audit_log
├── admin_email → who performed action
└── entity_id → which record was affected
```
