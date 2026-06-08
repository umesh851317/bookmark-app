-- =============================================================================
-- Migration: 001_profiles
-- Purpose:   Store public user identity (unique handle for /[handle] pages)
-- Run in:    Supabase Dashboard → SQL Editor → New query → paste → Run
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text not null,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Enforced in app too; DB guard for lowercase alphanumeric + underscore
  constraint profiles_handle_format check (handle ~ '^[a-z0-9_]{3,30}$')
);

comment on table public.profiles is 'App profile per auth user; handle powers public /[handle] pages';
comment on column public.profiles.handle is 'Unique public slug, 3-30 chars, lowercase a-z 0-9 _';

-- -----------------------------------------------------------------------------
-- Indexes & constraints
-- -----------------------------------------------------------------------------

-- Case-insensitive uniqueness (blocks "Jane" and "jane" as separate handles)
create unique index profiles_handle_lower_idx on public.profiles (lower(handle));

-- Fast lookup by handle for public profile routes
create index profiles_handle_idx on public.profiles (handle);

-- -----------------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
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
  for each row
  execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;

-- Anyone can read profiles (public /[handle] pages + handle availability checks)
create policy "profiles_select_public"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

-- Signed-in users can create only their own profile row
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Signed-in users can update only their own profile row
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No DELETE policy: profiles are removed via ON DELETE CASCADE from auth.users

-- -----------------------------------------------------------------------------
-- Grants (required for anon/authenticated roles to use RLS policies)
-- -----------------------------------------------------------------------------

grant select on table public.profiles to anon, authenticated;
grant insert, update on table public.profiles to authenticated;
