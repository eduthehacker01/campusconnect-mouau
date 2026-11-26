-- ============================================================================
-- MOUAU Connect — Milestone 1: Public / Guest Experience Database Schema
-- ============================================================================

-- 1. Extend existing `profiles` table with public profile & blogger fields
alter table if exists public.profiles
  add column if not exists username text unique,
  add column if not exists campus_location text default 'MOUAU, Umudike',
  add column if not exists level text,
  add column if not exists bio text,
  add column if not exists interests text[] default '{}',
  add column if not exists avatar_url text,
  add column if not exists is_public boolean default true,
  add column if not exists is_verified_blogger boolean default false,
  add column if not exists is_popular_blogger boolean default false,
  add column if not exists created_at timestamptz default now();

-- 2. Marketplace Listings
create table if not exists public.marketplace_listings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  seller_id uuid references public.profiles(id) on delete set null,
  seller_name text not null,
  seller_verified boolean default false,
  title text not null,
  category text not null,
  condition text not null default 'Used',
  price_ngn numeric not null default 0,
  campus_location text not null default 'MOUAU, Umudike',
  description text not null,
  image_urls text[] default '{}',
  status text not null default 'published' check (status in ('draft', 'published', 'sold', 'archived')),
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- 3. Jobs & Gigs
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  employer_id uuid references public.profiles(id) on delete set null,
  employer_name text not null,
  employer_verified boolean default false,
  title text not null,
  job_type text not null check (job_type in ('Part-time', 'Full-time', 'Remote', 'Freelance', 'Temporary', 'Internship')),
  campus_location text not null default 'MOUAU, Umudike',
  work_hours text,
  salary_text text,
  deadline text,
  description text not null,
  requirements text[] default '{}',
  application_instructions text,
  status text not null default 'published' check (status in ('draft', 'published', 'closed', 'archived')),
  is_featured boolean default false,
  created_at timestamptz default now()
);

-- 4. Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  organiser_id uuid references public.profiles(id) on delete set null,
  organiser_name text not null,
  title text not null,
  category text not null,
  starts_at timestamptz not null,
  date_label text,
  venue text not null,
  campus_location text not null default 'MOUAU, Umudike',
  entry_fee text not null default 'Free',
  flyer_url text,
  description text not null,
  interested_count integer not null default 0,
  going_count integer not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'cancelled', 'past')),
  created_at timestamptz default now()
);

-- 5. Communities
create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  admin_id uuid references public.profiles(id) on delete set null,
  admin_name text not null,
  name text not null,
  category text not null,
  campus_location text not null default 'MOUAU, Umudike',
  description text not null,
  member_count integer not null default 0,
  latest_post_preview text,
  is_public boolean not null default true,
  created_at timestamptz default now()
);

-- 6. Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  provider_id uuid references public.profiles(id) on delete set null,
  provider_name text not null,
  provider_verified boolean default false,
  title text not null,
  category text not null,
  campus_location text not null default 'MOUAU, Umudike',
  price_text text not null,
  rating_avg numeric(2,1) default 4.8,
  review_count integer default 0,
  description text not null,
  status text not null default 'published' check (status in ('draft', 'published', 'paused')),
  created_at timestamptz default now()
);

-- 7. Accommodation & Roommates
create table if not exists public.accommodations (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  lister_id uuid references public.profiles(id) on delete set null,
  lister_name text not null,
  lister_verified boolean default false,
  title text not null,
  listing_type text not null check (listing_type in ('Room', 'Hostel', 'Self-Contained', 'Shared Apartment', 'Roommate Needed')),
  price_ngn numeric not null default 0,
  price_period text not null default 'per year',
  campus_location text not null default 'MOUAU, Umudike',
  area text not null,
  amenities text[] default '{}',
  description text not null,
  status text not null default 'published' check (status in ('draft', 'published', 'taken')),
  created_at timestamptz default now()
);

-- 8. Opportunities (Scholarships, SIWES, Internships, Grants, Fellowships, Competitions, Bootcamps)
create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  opportunity_type text not null check (opportunity_type in ('Scholarship', 'Internship', 'SIWES', 'Grant', 'Fellowship', 'Competition', 'Tech Bootcamp')),
  source_name text not null,
  eligibility text not null,
  benefit_text text not null,
  deadline text not null,
  official_url text not null,
  description text not null,
  status text not null default 'published' check (status in ('draft', 'published', 'expired')),
  created_at timestamptz default now()
);

-- 9. Blog Articles
create table if not exists public.blog_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  author_id uuid references public.profiles(id) on delete set null,
  author_username text not null,
  author_name text not null,
  author_badge text default 'Verified Blogger',
  is_popular boolean default false,
  title text not null,
  category text not null,
  excerpt text not null,
  content text not null,
  read_time_mins integer default 4,
  read_count integer default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz default now()
);

-- 10. Lost & Found
create table if not exists public.lost_and_found_items (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  reporter_id uuid references public.profiles(id) on delete set null,
  item_status text not null check (item_status in ('LOST', 'FOUND')),
  title text not null,
  campus_location text not null default 'MOUAU, Umudike',
  area_detail text not null,
  reported_label text not null default 'Recently reported',
  description text not null,
  contact_instructions text not null,
  status text not null default 'published' check (status in ('published', 'resolved', 'archived')),
  created_at timestamptz default now()
);

-- 11. Food & Businesses + Menu / Service Items
create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  business_type text not null check (business_type in ('Restaurant', 'Food Vendor', 'Cafe & Bakery', 'Retail & Gadgets', 'Beauty & Grooming', 'Workspace & Tech')),
  campus_location text not null default 'MOUAU, Umudike',
  address text not null,
  opening_hours text not null,
  price_range text not null,
  rating_avg numeric(2,1) default 4.8,
  specialty text not null,
  description text not null,
  verified boolean default false,
  is_featured boolean default false,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz default now()
);

create table if not exists public.business_menu_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  category text not null default 'Menu',
  price_ngn numeric not null default 0,
  description text
);

-- 12. Safety Reports (authenticated submissions in Milestone 2; never publicly readable)
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null,
  target_id text not null,
  reason text not null,
  details text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz default now()
);

-- Public-safe profile view (excludes email, phone, matric_number, kyc_image_url)
create or replace view public.public_profiles as
select
  id,
  username,
  full_name,
  role,
  campus_location,
  college,
  department,
  level,
  bio,
  interests,
  avatar_url,
  (kyc_status = 'approved') as is_verified,
  is_verified_blogger,
  is_popular_blogger,
  created_at
from public.profiles
where is_public = true;
