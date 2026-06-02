-- Optional: run in Supabase SQL editor if admin_audit_log does not exist
create table if not exists admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_email text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  details text,
  created_at timestamptz default now()
);

create index if not exists admin_audit_log_created_at on admin_audit_log (created_at desc);
