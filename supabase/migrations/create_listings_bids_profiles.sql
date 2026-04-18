-- ═══════════════════════════════════════════════════════════
-- Wregals MVP Schema: listings, bids, user_profiles
-- ═══════════════════════════════════════════════════════════

-- ── user_profiles ───────────────────────────────────────────
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  bio text,
  address jsonb,
  upi_id text,
  wallet_balance numeric(12, 2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "Users can view own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can upsert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- ── listings ───────────────────────────────────────────────
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  condition text not null,
  celebrity text,
  images text[] not null default '{}',
  starting_bid numeric(12, 2) not null default 0,
  current_bid numeric(12, 2) not null default 0,
  bid_increment numeric(12, 2) not null default 500,
  reserve_price numeric(12, 2),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'live', 'ended')),
  has_cert boolean not null default false,
  cert_details text,
  bid_count int not null default 0,
  unique_bidders int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.listings enable row level security;

-- Anyone can read live listings
create policy "Anyone can view live listings"
  on public.listings for select
  using (status = 'live' or auth.uid() = seller_id);

-- Only the seller can insert their own listings
create policy "Sellers can create listings"
  on public.listings for insert
  with check (auth.uid() = seller_id);

-- Only the seller can update their own listings
create policy "Sellers can update own listings"
  on public.listings for update
  using (auth.uid() = seller_id);

-- ── bids ──────────────────────────────────────────────────
create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  bidder_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(12, 2) not null,
  placed_at timestamptz not null default now()
);

alter table public.bids enable row level security;

-- Anyone can view bids on a listing
create policy "Anyone can view bids"
  on public.bids for select
  using (true);

-- Logged-in users can place bids
create policy "Logged in users can place bids"
  on public.bids for insert
  with check (auth.uid() = bidder_id);

-- ── trigger: auto-create user_profile on signup ─────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.user_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── trigger: update listing current_bid on new bid ──────
create or replace function public.handle_new_bid()
returns trigger language plpgsql security definer as $$
begin
  update public.listings
  set
    current_bid = new.amount,
    bid_count = bid_count + 1,
    unique_bidders = (
      select count(distinct bidder_id)
      from public.bids
      where listing_id = new.listing_id
    ),
    updated_at = now()
  where id = new.listing_id;
  return new;
end;
$$;

drop trigger if exists on_bid_placed on public.bids;
create trigger on_bid_placed
  after insert on public.bids
  for each row execute procedure public.handle_new_bid();
