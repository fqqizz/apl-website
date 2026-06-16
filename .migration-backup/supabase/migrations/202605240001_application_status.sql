alter table if exists public.players
  add column if not exists application_status text default 'UNDER REVIEW';

update public.players
set application_status = 'UNDER REVIEW'
where application_status is null;
