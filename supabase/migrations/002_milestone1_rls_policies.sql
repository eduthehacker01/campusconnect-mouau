-- ============================================================================
-- MOUAU Connect — Milestone 1: Row Level Security (RLS) Policies
-- Public/Guest (`anon`) users get read-only access to published public content.
-- ============================================================================

alter table public.marketplace_listings enable row level security;
alter table public.jobs enable row level security;
alter table public.events enable row level security;
alter table public.communities enable row level security;
alter table public.services enable row level security;
alter table public.accommodations enable row level security;
alter table public.opportunities enable row level security;
alter table public.blog_articles enable row level security;
alter table public.lost_and_found_items enable row level security;
alter table public.businesses enable row level security;
alter table public.business_menu_items enable row level security;
alter table public.reports enable row level security;

-- Public SELECT policies (published / public rows only)
create policy "Public read published marketplace" on public.marketplace_listings
  for select using (status = 'published');

create policy "Public read published jobs" on public.jobs
  for select using (status = 'published');

create policy "Public read published events" on public.events
  for select using (status = 'published');

create policy "Public read public communities" on public.communities
  for select using (is_public = true);

create policy "Public read published services" on public.services
  for select using (status = 'published');

create policy "Public read published accommodations" on public.accommodations
  for select using (status = 'published');

create policy "Public read published opportunities" on public.opportunities
  for select using (status = 'published');

create policy "Public read published blog articles" on public.blog_articles
  for select using (status = 'published');

create policy "Public read published lost and found" on public.lost_and_found_items
  for select using (status = 'published');

create policy "Public read published businesses" on public.businesses
  for select using (status = 'published');

create policy "Public read business menu items" on public.business_menu_items
  for select using (
    exists (
      select 1 from public.businesses b
      where b.id = business_menu_items.business_id and b.status = 'published'
    )
  );

-- Reports are private: only authenticated users may insert their own reports
create policy "Authenticated users can create reports" on public.reports
  for insert to authenticated
  with check (auth.uid() = reporter_id);

-- Grant SELECT on public_profiles view to anon and authenticated roles
grant select on public.public_profiles to anon, authenticated;
