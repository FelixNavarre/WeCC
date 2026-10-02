-- À coller dans Supabase → SQL Editor
create table if not exists votes (
  name text primary key,
  ranking jsonb not null,
  updated_at timestamptz not null default now()
);

alter table votes enable row level security;

create policy "lecture publique" on votes for select to anon using (true);
create policy "vote public" on votes for insert to anon with check (true);
create policy "modif vote" on votes for update to anon using (true) with check (true);
