# APL Authentication & Deployment Guide

## Prerequisites

1. **Supabase Project**: `https://bsdszdyetdrwwkjpeglj.supabase.co`
2. **Vercel Account** with the APL project connected
3. **Cashfree Account** with API credentials

---

## Step 1: Get Your Supabase API Keys

1. Go to: https://supabase.com/dashboard/project/bsdszdyetdrwwkjpeglj/settings/api
2. Copy the **Project URL** → This is `VITE_SUPABASE_URL`
3. Copy the **anon public** key (starts with `eyJ...`) → This is `VITE_SUPABASE_ANON_KEY`
4. Copy the **service_role secret** key (starts with `eyJ...`) → This is `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **Important**: The keys `sb_publishable_...` and `sb_secret_...` are management/billing keys — NOT the API keys the app needs. You need the JWT keys that start with `eyJ`.

---

## Step 2: Enable Email Auth

1. Go to: https://supabase.com/dashboard/project/bsdszdyetdrwwkjpeglj/auth/providers
2. Under **Email**, ensure it is **Enabled**
3. Set **Confirm email** to **OFF** (for simplicity with admin accounts)
4. Go to **URL Configuration**:
   - **Site URL**: `https://apexpremiereleague.in`
   - **Redirect URLs**: Add `https://apexpremiereleague.in/admin`

---

## Step 3: Create Admin User

### Option A: Already exists (your case)

Your email `getinfo.faaiz@gmail.com` is already in Supabase Auth. Just make sure it's in the `admins` table:

```sql
INSERT INTO admins (email) VALUES ('getinfo.faaiz@gmail.com')
ON CONFLICT (email) DO NOTHING;
```

### Option B: Create a new admin

1. Go to: https://supabase.com/dashboard/project/bsdszdyetdrwwkjpeglj/auth/users
2. Click **Add User** → **Create New User**
3. Enter email + password (remember the password!)
4. Then run the SQL above with the new email

---

## Step 4: Run Database Schema

1. Go to: https://supabase.com/dashboard/project/bsdszdyetdrwwkjpeglj/sql
2. Create a new query
3. Copy the entire SQL from `DATABASE_GUIDE.md` (Tables section + Indexes + Trigger + Admin insert)
4. Run it

---

## Step 5: Create Storage Buckets

1. Go to: https://supabase.com/dashboard/project/bsdszdyetdrwwkjpeglj/storage/buckets
2. Create bucket: `player-uploads` (set to **Public**)
3. Create bucket: `franchise-uploads` (set to **Public**)

---

## Step 6: Set RLS Policies

1. Go to SQL Editor
2. Run the RLS policies SQL from `DATABASE_GUIDE.md`

---

## Step 7: Environment Variables

### Vercel

Go to your Vercel project → Settings → Environment Variables. Add:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_SUPABASE_URL` | `https://bsdszdyetdrwwkjpeglj.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZHN6ZHlldGRyd3dranBlZ2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU4NzgsImV4cCI6MjA5NTAyMTg3OH0.HDfsmfwaKFY1qSsStK8GMD1h1bKanqfcxGEYqLeGtGw` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZHN6ZHlldGRyd3dranBlZ2xqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQ0NTg3OCwiZXhwIjoyMDk1MDIxODc4fQ.lpA0pceWhb79EIAY3KqvfYuQY21oksKUdkjd43wEZag` | Production, Preview, Development |
| `CASHFREE_APP_ID` | Your Cashfree App ID | Production |
| `CASHFREE_SECRET_KEY` | Your Cashfree Secret Key | Production |
| `CASHFREE_ENVIRONMENT` | `PRODUCTION` | Production |
| `APP_URL` | `https://apexpremiereleague.in` | Production |

### Local Development

Create `.env` in the project root:

```env
VITE_SUPABASE_URL=https://bsdszdyetdrwwkjpeglj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZHN6ZHlldGRyd3dranBlZ2xqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk0NDU4NzgsImV4cCI6MjA5NTAyMTg3OH0.HDfsmfwaKFY1qSsStK8GMD1h1bKanqfcxGEYqLeGtGw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzZHN6ZHlldGRyd3dranBlZ2xqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTQ0NTg3OCwiZXhwIjoyMDk1MDIxODc4fQ.lpA0pceWhb79EIAY3KqvfYuQY21oksKUdkjd43wEZag
CASHFREE_APP_ID=your_sandbox_app_id
CASHFREE_SECRET_KEY=your_sandbox_secret
CASHFREE_ENVIRONMENT=SANDBOX
APP_URL=http://localhost:3000
```

---

## Step 8: Deploy

```bash
# Push to your connected Git repository
git add .
git commit -m "APL production update"
git push origin main
```

Vercel will automatically build and deploy.

---

## Step 9: Verify Admin Login

1. Go to `https://apexpremiereleague.in/admin/login`
2. Enter `getinfo.faaiz@gmail.com` + your password
3. You should see the admin dashboard

---

## Troubleshooting

### "Invalid API key" errors
→ Make sure you're using the JWT keys from Settings → API, not the management keys.

### Admin login fails
→ Check that the email exists in both Supabase Auth AND the `admins` table.

### File uploads fail
→ Verify storage buckets exist and RLS policies allow anon inserts.

### Payment callback shows error
→ Check Cashfree webhook URL is set to `https://apexpremiereleague.in/api/apl/payments/webhook`
