-- SIPEMA Supabase schema + RLS + seed data
-- Run this in Supabase SQL Editor

create extension if not exists "pgcrypto";

-- =========================
-- Enums (mapped from TypeScript)
-- =========================
create type public.user_role as enum ('RESIDENT', 'ADMIN_CLUSTER', 'SUPER_ADMIN', 'TECHNICIAN');
create type public.unit_status as enum ('Pemilik', 'Penyewa', 'Kosong');
create type public.complaint_status as enum ('Pending', 'Proses', 'Selesai', 'Ditolak');
create type public.complaint_category as enum ('Retensi', 'Fasum');
create type public.invoice_status as enum ('Paid', 'Unpaid', 'Overdue');
create type public.vendor_status as enum ('Active', 'Inactive');
create type public.lead_status as enum ('Baru', 'Prospek', 'Survey Lokasi', 'Booking Fee', 'Terjual/Akad', 'Batal');

-- =========================
-- Profiles (extends auth.users)
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  name text not null,
  role public.user_role not null default 'RESIDENT',
  cluster text not null default '-',
  unit text not null default '-',
  bast_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.touch_updated_at();

-- =========================
-- Domain tables
-- =========================
create table if not exists public.clusters (
  id text primary key,
  name text not null,
  manager_name text not null,
  total_units integer not null default 0,
  occupied_units integer not null default 0,
  cash_balance bigint not null default 0,
  security_status text not null default 'Aman',
  last_audit_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.units (
  id text primary key,
  cluster_id text not null references public.clusters(id) on delete restrict,
  block text not null,
  number text not null,
  type text not null,
  land_area integer not null default 0,
  owner_name text not null,
  status public.unit_status not null default 'Kosong',
  phone_number text,
  family_members integer not null default 0,
  bast_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.residents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete set null,
  unit_id text not null references public.units(id) on delete restrict,
  full_name text not null,
  phone text,
  occupant_status public.unit_status not null default 'Pemilik',
  bast_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id text primary key,
  resident_id uuid not null references public.residents(id) on delete cascade,
  month text not null,
  year integer not null,
  amount bigint not null,
  status public.invoice_status not null default 'Unpaid',
  due_date date not null,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.complaints (
  id text primary key,
  resident_id uuid not null references public.residents(id) on delete cascade,
  category public.complaint_category not null,
  sub_category text,
  description text not null,
  photo_url text,
  status public.complaint_status not null default 'Pending',
  is_warranty boolean not null default false,
  upvotes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id text primary key,
  name text not null,
  phone text not null,
  interest text not null,
  budget text not null,
  source text not null,
  status public.lead_status not null default 'Baru',
  notes text,
  assigned_agent text,
  created_at date not null default current_date
);

create table if not exists public.vendors (
  id text primary key,
  name text not null,
  service_type text not null,
  contact_person text not null,
  phone text not null,
  email text,
  status public.vendor_status not null default 'Active',
  contract_start date,
  contract_end date,
  monthly_cost bigint not null default 0
);

create table if not exists public.ledger_entries (
  id text primary key,
  cluster_id text references public.clusters(id) on delete set null,
  date date not null,
  category text not null,
  description text not null,
  amount bigint not null,
  proof_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.marketplace_items (
  id text primary key,
  title text not null,
  seller_name text not null,
  price bigint not null,
  category text not null,
  image_url text,
  created_at timestamptz not null default now()
);

-- optional table used by existing app billing flows
create table if not exists public.payments (
  id text primary key,
  user_id text not null,
  rekening_ipl text not null,
  nominal bigint not null,
  referensi text,
  nama text,
  blok text,
  nomor_rumah text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.house_types (
  id text primary key,
  name text not null,
  description text
);

-- =========================
-- RLS helpers
-- =========================
create or replace function public.current_profile_role()
returns public.user_role
language sql
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.current_resident_id()
returns uuid
language sql
stable
as $$
  select id from public.residents where profile_id = auth.uid()
$$;

-- =========================
-- Enable RLS
-- =========================
alter table public.profiles enable row level security;
alter table public.clusters enable row level security;
alter table public.units enable row level security;
alter table public.residents enable row level security;
alter table public.invoices enable row level security;
alter table public.complaints enable row level security;
alter table public.leads enable row level security;
alter table public.vendors enable row level security;
alter table public.ledger_entries enable row level security;
alter table public.marketplace_items enable row level security;
alter table public.payments enable row level security;
alter table public.house_types enable row level security;

-- Admin policies: full CRUD for SUPER_ADMIN
create policy "admin_all_profiles" on public.profiles for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_clusters" on public.clusters for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_units" on public.units for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_residents" on public.residents for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_invoices" on public.invoices for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_complaints" on public.complaints for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_leads" on public.leads for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_vendors" on public.vendors for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_ledger_entries" on public.ledger_entries for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_marketplace_items" on public.marketplace_items for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_payments" on public.payments for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');
create policy "admin_all_house_types" on public.house_types for all using (public.current_profile_role() = 'SUPER_ADMIN') with check (public.current_profile_role() = 'SUPER_ADMIN');

-- Residents policies
create policy "resident_view_own_invoices" on public.invoices
for select using (resident_id = public.current_resident_id());

create policy "resident_view_own_unit" on public.units
for select using (
  exists (
    select 1 from public.residents r
    where r.profile_id = auth.uid()
      and r.unit_id = units.id
  )
);

create policy "resident_create_own_complaints" on public.complaints
for insert with check (resident_id = public.current_resident_id());

create policy "resident_view_own_complaints" on public.complaints
for select using (resident_id = public.current_resident_id());

-- Public marketplace read
create policy "public_view_marketplace_items" on public.marketplace_items
for select to anon, authenticated using (true);

-- =========================
-- Seed data (CLUSTERS + INITIAL_RESIDENTS)
-- =========================
insert into public.clusters (id, name, manager_name, total_units, occupied_units, cash_balance, security_status, last_audit_date)
values
('cl-ruby', 'Cluster Ruby', 'Bpk. Hartono', 120, 98, 45000000, 'Aman', '2023-11-01'),
('cl-topaz', 'Cluster Topaz', 'Ibu Sarah', 85, 80, 32500000, 'Aman', '2023-11-05'),
('cl-sapphire', 'Cluster Sapphire', 'Bpk. Doni', 150, 45, 12000000, 'Siaga', '2023-10-28'),
('cl-kalimaya', 'Cluster Kalimaya', 'Bpk. Rahmat', 200, 180, 89000000, 'Aman', '2023-11-10')
on conflict (id) do nothing;

insert into public.units (id, cluster_id, block, number, type, land_area, owner_name, status, phone_number, family_members, bast_date)
values
('u-rb-01', 'cl-ruby', 'A', '01', '36/60', 60, 'Budi Santoso', 'Pemilik', '0812-3456-7890', 4, '2023-11-15'),
('u-rb-02', 'cl-ruby', 'A', '02', '45/72', 72, 'Siti Aminah', 'Penyewa', '0813-9999-8888', 2, '2022-05-20'),
('u-tp-05', 'cl-topaz', 'C', '12', '36/60', 60, 'Developer Stock', 'Kosong', '-', 0, null),
('u-sp-10', 'cl-sapphire', 'F', '08', '60/90', 90, 'Rudi Hartono', 'Pemilik', '0811-2233-4455', 5, '2023-09-01'),
('u-kl-22', 'cl-kalimaya', 'G', '22', '30/60', 60, 'Dewi Persik', 'Pemilik', '0815-6789-1234', 3, '2023-10-15')
on conflict (id) do nothing;

insert into public.residents (id, unit_id, full_name, phone, occupant_status, bast_date)
values
('11111111-1111-1111-1111-111111111111', 'u-rb-01', 'Budi Santoso', '0812-3456-7890', 'Pemilik', '2023-11-15'),
('22222222-2222-2222-2222-222222222222', 'u-rb-02', 'Siti Aminah', '0813-9999-8888', 'Penyewa', '2022-05-20'),
('33333333-3333-3333-3333-333333333333', 'u-sp-10', 'Rudi Hartono', '0811-2233-4455', 'Pemilik', '2023-09-01'),
('44444444-4444-4444-4444-444444444444', 'u-kl-22', 'Dewi Persik', '0815-6789-1234', 'Pemilik', '2023-10-15')
on conflict (id) do nothing;
