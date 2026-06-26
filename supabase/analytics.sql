-- ============================================================
--  STUDY CLUB — analytics & consent
--  Written server-side via the service role only. RLS is ON with no
--  public policies, so nothing is readable/writable from the browser.
--  Purpose: assess each student's level and serve the right material.
--  Never sold, never used to track across other sites.
-- ============================================================

-- Consent + coarse session context (one row per anonymous visitor)
create table if not exists public.analytics_consent (
  visitor_id text primary key,
  user_id    uuid references auth.users (id) on delete set null,
  analytics  boolean default false,
  marketing  boolean default false,
  user_agent text,
  ip_hash    text,            -- salted hash, never the raw IP
  country    text,
  region     text,
  city       text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Behavioural events: pageviews, clicks (for heatmaps), scroll depth
create table if not exists public.analytics_events (
  id         bigint generated always as identity primary key,
  visitor_id text not null,
  user_id    uuid references auth.users (id) on delete set null,
  type       text not null check (type in ('pageview','click','scroll','session_start')),
  path       text,
  x          real,            -- normalised 0..1 (click position for heatmap)
  y          real,
  vw         int,             -- viewport width at capture
  vh         int,
  scroll_pct int,
  referrer   text,
  country    text,
  created_at timestamptz default now()
);
create index if not exists analytics_events_type_idx on public.analytics_events (type, created_at desc);
create index if not exists analytics_events_path_idx on public.analytics_events (path);
create index if not exists analytics_events_visitor_idx on public.analytics_events (visitor_id);

-- Lock everything down: only the service role (which bypasses RLS) may touch these.
alter table public.analytics_consent enable row level security;
alter table public.analytics_events  enable row level security;

-- Convenience views for the insights dashboard (read server-side via service role)
create or replace view public.analytics_daily as
select date_trunc('day', created_at) as day,
       count(*) filter (where type = 'pageview')      as pageviews,
       count(distinct visitor_id)                     as visitors
from public.analytics_events
group by 1
order by 1;

create or replace view public.analytics_top_paths as
select path, count(*) as pageviews, count(distinct visitor_id) as visitors
from public.analytics_events
where type = 'pageview'
group by path
order by pageviews desc;

create or replace view public.analytics_countries as
select coalesce(country, 'Unknown') as country, count(distinct visitor_id) as visitors
from public.analytics_events
group by 1
order by visitors desc;
