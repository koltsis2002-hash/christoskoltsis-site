-- Ήδη εφαρμοσμένο στο έργο Koltsis (27/11/2026). Μόνο για αναφορά.
create table public.site_leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null, phone text not null, email text, topic text, meet text,
  pref_day text, pref_slot text, message text,
  consent boolean not null default false, source text not null default 'site',
  ip_hash text, telegram_ok boolean, synced_at timestamptz
);
alter table public.site_leads enable row level security;
create index site_leads_unsynced on public.site_leads (id) where synced_at is null;
create index site_leads_ip_recent on public.site_leads (ip_hash, created_at);
