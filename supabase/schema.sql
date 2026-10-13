-- ReCCCreate database. Run this once in Supabase: SQL Editor > New query > paste > Run.

-- ---------- Tables ----------
create table if not exists temples (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  area text not null,
  photo_url text,
  collecting_since date,
  is_visible boolean not null default false  -- turn on only after the temple agrees to be named
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('gulaal', 'compost')),
  price_inr numeric not null check (price_inr >= 0),
  size text not null,
  photo_url text,
  ingredients text,
  in_stock boolean not null default true
);

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  temple_id uuid not null references temples (id) on delete cascade,
  date date not null,
  kg numeric not null check (kg > 0)
);

-- The batch id is short because it is printed inside each pack's QR code link.
create table if not exists batches (
  id text primary key default substr(md5(gen_random_uuid()::text), 1, 8),
  product_id uuid not null references products (id) on delete restrict,
  temple_id uuid references temples (id) on delete set null,
  collected_on date not null,
  kg_flowers_used numeric not null check (kg_flowers_used > 0),
  kg_produced numeric check (kg_produced >= 0),  -- needed for the "gulaal made so far" figure
  made_by text
);

-- Accounts allowed to use /admin. Add a row for each admin (see README).
create table if not exists admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

-- ---------- Row-level security ----------
-- Anyone can read what the public site shows. Only admins can change anything.
alter table temples enable row level security;
alter table products enable row level security;
alter table collections enable row level security;
alter table batches enable row level security;
alter table admins enable row level security;

drop policy if exists "read visible temples" on temples;
create policy "read visible temples" on temples for select using (is_visible or is_admin());
drop policy if exists "read products" on products;
create policy "read products" on products for select using (true);
drop policy if exists "read collections" on collections;
create policy "read collections" on collections for select using (true);
drop policy if exists "read batches" on batches;
create policy "read batches" on batches for select using (true);
drop policy if exists "read own admin row" on admins;
create policy "read own admin row" on admins for select using (user_id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['temples', 'products', 'collections', 'batches'] loop
    execute format('drop policy if exists "admin insert" on %I', t);
    execute format('drop policy if exists "admin update" on %I', t);
    execute format('drop policy if exists "admin delete" on %I', t);
    execute format('create policy "admin insert" on %I for insert with check (is_admin())', t);
    execute format('create policy "admin update" on %I for update using (is_admin()) with check (is_admin())', t);
    execute format('create policy "admin delete" on %I for delete using (is_admin())', t);
  end loop;
end $$;

-- ---------- Views for the Home page ----------
-- security_invoker makes the views obey the policies above, so hidden temples stay hidden.
create or replace view temple_totals with (security_invoker = true) as
  select t.id, t.name, t.area, t.photo_url, t.collecting_since,
         coalesce(sum(c.kg), 0) as kg_collected
  from temples t
  left join collections c on c.temple_id = t.id
  where t.is_visible
  group by t.id;

create or replace view impact_stats with (security_invoker = true) as
  select
    (select coalesce(sum(kg), 0) from collections) as kg_collected,
    (select min(date) from collections) as first_day,
    (select max(date) from collections) as last_day,
    (select coalesce(sum(b.kg_produced), 0)
       from batches b join products p on p.id = b.product_id
      where p.type = 'gulaal') as gulaal_kg;

grant select on temple_totals, impact_stats to anon, authenticated;

-- ---------- Photo uploads ----------
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "public read photos" on storage.objects;
create policy "public read photos" on storage.objects for select using (bucket_id = 'photos');
drop policy if exists "admin upload photos" on storage.objects;
create policy "admin upload photos" on storage.objects for insert with check (bucket_id = 'photos' and is_admin());
drop policy if exists "admin change photos" on storage.objects;
create policy "admin change photos" on storage.objects for update using (bucket_id = 'photos' and is_admin());
drop policy if exists "admin delete photos" on storage.objects;
create policy "admin delete photos" on storage.objects for delete using (bucket_id = 'photos' and is_admin());
