-- ============================================================
--  STUDY CLUB — database schema (Postgres / Supabase)
--  Run in Supabase Studio → SQL Editor, or via `supabase db push`.
--  Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================

-- ---------- profiles (1:1 with auth.users) ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  club_name    text,
  email        text,
  target_score int  default 1400 check (target_score between 400 and 1600),
  exam_date    date,
  fears        text[] default '{}',
  struggles    text[] default '{}',
  stay         boolean default true,
  created_at   timestamptz default now()
);

-- auto-create a profile when a user signs up, seeding from onboarding metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, club_name, target_score, exam_date)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    coalesce((new.raw_user_meta_data ->> 'target_score')::int, 1400),
    (new.raw_user_meta_data ->> 'exam_date')::date
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- content: questions ----------
create table if not exists public.questions (
  id            bigint generated always as identity primary key,
  section       text not null check (section in ('rw','math')),
  topic         text not null,
  subtopic      text,
  difficulty    int  not null check (difficulty between 1 and 5),
  passage       text,
  stem          text not null,
  choices       jsonb not null,            -- [{"id":"A","text":"..."}, ...]
  correct_choice text not null,
  explanation   text,
  source        text default 'studyclub',
  created_at    timestamptz default now()
);
create index if not exists questions_topic_idx on public.questions (section, topic, difficulty);

-- ---------- practice tests + items ----------
create table if not exists public.practice_tests (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  kind         text not null default 'full' check (kind in ('full','section','drill')),
  started_at   timestamptz default now(),
  completed_at timestamptz,
  total_score  int,
  rw_score     int,
  math_score   int
);
create index if not exists practice_tests_user_idx on public.practice_tests (user_id, started_at desc);

create table if not exists public.test_items (
  id          bigint generated always as identity primary key,
  test_id     uuid not null references public.practice_tests (id) on delete cascade,
  question_id bigint not null references public.questions (id),
  chosen      text,
  is_correct  boolean,
  time_ms     int
);
create index if not exists test_items_test_idx on public.test_items (test_id);

-- ---------- vocabulary + spaced repetition ----------
create table if not exists public.vocab_words (
  id         bigint generated always as identity primary key,
  word       text not null unique,
  definition text not null,
  example    text,
  tier       int default 1
);

create table if not exists public.user_vocab (
  user_id       uuid not null references auth.users (id) on delete cascade,
  word_id       bigint not null references public.vocab_words (id) on delete cascade,
  status        text default 'new' check (status in ('new','learning','known')),
  ease          numeric default 2.5,
  due_at        timestamptz default now(),
  last_reviewed timestamptz,
  primary key (user_id, word_id)
);

-- ---------- study plans (generated route) ----------
create table if not exists public.study_plans (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz default now(),
  plan       jsonb not null            -- [{ "week":1, "focus":"...", "tasks":[...] }]
);

-- ---------- mistakes log ----------
create table if not exists public.mistakes (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references auth.users (id) on delete cascade,
  question_id bigint references public.questions (id),
  topic       text,
  attempts    int default 1,
  last_seen   timestamptz default now()
);
create index if not exists mistakes_user_idx on public.mistakes (user_id, topic);

-- ---------- streaks ----------
create table if not exists public.streaks (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  current     int default 0,
  longest     int default 0,
  last_active date
);

-- ---------- points + achievements ----------
create table if not exists public.points_ledger (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  kind       text not null,           -- 'drill','test','streak','vocab'
  points     int  not null,
  created_at timestamptz default now()
);
create index if not exists points_user_idx on public.points_ledger (user_id, created_at desc);

create table if not exists public.achievements (
  id        bigint generated always as identity primary key,
  user_id   uuid not null references auth.users (id) on delete cascade,
  code      text not null,
  earned_at timestamptz default now(),
  unique (user_id, code)
);

-- ---------- weekly leaderboard view ----------
create or replace view public.leaderboard_weekly as
select
  p.user_id,
  pr.club_name,
  sum(p.points) as points
from public.points_ledger p
join public.profiles pr on pr.id = p.user_id
where p.created_at > now() - interval '7 days'
group by p.user_id, pr.club_name
order by points desc;

-- ============================================================
--  Row Level Security
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.practice_tests  enable row level security;
alter table public.test_items      enable row level security;
alter table public.user_vocab      enable row level security;
alter table public.study_plans     enable row level security;
alter table public.mistakes        enable row level security;
alter table public.streaks         enable row level security;
alter table public.points_ledger   enable row level security;
alter table public.achievements    enable row level security;
alter table public.questions       enable row level security;
alter table public.vocab_words     enable row level security;

-- shared content: any signed-in member can read
create policy "content readable by authenticated"
  on public.questions for select to authenticated using (true);
create policy "vocab readable by authenticated"
  on public.vocab_words for select to authenticated using (true);

-- helper: own-row policy on each user-scoped table
do $$
declare t text;
begin
  foreach t in array array[
    'profiles','practice_tests','user_vocab','study_plans',
    'mistakes','streaks','points_ledger','achievements'
  ]
  loop
    execute format($f$
      create policy "own rows - select" on public.%1$I
        for select to authenticated
        using (%2$s = auth.uid());
      create policy "own rows - insert" on public.%1$I
        for insert to authenticated
        with check (%2$s = auth.uid());
      create policy "own rows - update" on public.%1$I
        for update to authenticated
        using (%2$s = auth.uid());
      create policy "own rows - delete" on public.%1$I
        for delete to authenticated
        using (%2$s = auth.uid());
    $f$, t, case when t = 'profiles' then 'id' else 'user_id' end);
  end loop;
end $$;

-- test_items inherit ownership through their parent test
create policy "test_items - own via parent"
  on public.test_items for all to authenticated
  using (exists (
    select 1 from public.practice_tests t
    where t.id = test_items.test_id and t.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.practice_tests t
    where t.id = test_items.test_id and t.user_id = auth.uid()
  ));
