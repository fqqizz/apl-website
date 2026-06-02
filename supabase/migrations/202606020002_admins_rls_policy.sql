-- Run in Supabase SQL Editor if admin users see "Access Denied" while logged in.
-- Allows authenticated users to read their own row from admins (case-insensitive email).

alter table if exists public.admins enable row level security;

drop policy if exists "admins_select_own_email" on public.admins;

create policy "admins_select_own_email"
  on public.admins
  for select
  to authenticated
  using (lower(trim(email)) = lower(trim(auth.jwt() ->> 'email')));
