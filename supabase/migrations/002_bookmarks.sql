-- =============================================================================
-- Migration: 002_bookmarks
-- Purpose:   User bookmarks (CRUD in dashboard; public subset on /[handle])
-- Depends:   001_profiles.sql
-- Run in:    Supabase Dashboard → SQL Editor → New query → paste → Run
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table
-- -----------------------------------------------------------------------------

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  url text not null,
  description text,
  tags text[] not null default '{}',
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint bookmarks_title_not_empty check (char_length(trim(title)) > 0),
  constraint bookmarks_url_not_empty check (char_length(trim(url)) > 0),
  constraint bookmarks_tags_max_count check (cardinality(tags) <= 20)
);

comment on table public.bookmarks is 'Bookmarks owned by a profile; public rows appear on /[handle]';
comment on column public.bookmarks.user_id is 'Owner profile (same uuid as auth.users.id)';
comment on column public.bookmarks.tags is 'Optional labels, max 20 tags; per-tag length validated in app';
comment on column public.bookmarks.is_public is 'When true, visible on the owner public profile page';

-- -----------------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------------

-- Dashboard: list a user's bookmarks newest first
create index bookmarks_user_id_created_at_idx
  on public.bookmarks (user_id, created_at desc);

-- Public profile: fetch only public bookmarks for a user
create index bookmarks_user_id_public_created_at_idx
  on public.bookmarks (user_id, created_at desc)
  where is_public = true;

-- Optional tag filtering (e.g. filter by tag on dashboard)
create index bookmarks_tags_gin_idx
  on public.bookmarks using gin (tags);

-- -----------------------------------------------------------------------------
-- updated_at trigger (reuses public.set_updated_at from 001_profiles)
-- -----------------------------------------------------------------------------

create trigger bookmarks_set_updated_at
  before update on public.bookmarks
  for each row
  execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.bookmarks enable row level security;

-- Owners see all their bookmarks; everyone sees public bookmarks
create policy "bookmarks_select_own_or_public"
  on public.bookmarks
  for select
  to anon, authenticated
  using (
    auth.uid() = user_id
    or is_public = true
  );

-- Signed-in users can create bookmarks only for themselves
create policy "bookmarks_insert_own"
  on public.bookmarks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Signed-in users can update only their own bookmarks
create policy "bookmarks_update_own"
  on public.bookmarks
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Signed-in users can delete only their own bookmarks
create policy "bookmarks_delete_own"
  on public.bookmarks
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Grants
-- -----------------------------------------------------------------------------

grant select on table public.bookmarks to anon, authenticated;
grant insert, update, delete on table public.bookmarks to authenticated;
