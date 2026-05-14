-- ═══════════════════════════════════════════════════════════════
-- NASSIM ROADMAP — Supabase Schema complet
-- Colle ce SQL dans : Supabase Dashboard > SQL Editor > Run
-- ═══════════════════════════════════════════════════════════════

-- 1. PROFILES
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
drop policy if exists "Users can read own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
create policy "Users can read own profile"   on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
-- Auto-create profile on signup
create or replace function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, full_name) values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- 2. TASK PROGRESS
create table if not exists task_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null,
  completed boolean default false,
  completed_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, task_id)
);
alter table task_progress enable row level security;
drop policy if exists "Users can manage own progress" on task_progress;
create policy "Users can manage own progress" on task_progress for all using (auth.uid() = user_id);

-- 3. TASK NOTES
create table if not exists task_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null,
  content text default '',
  updated_at timestamptz default now(),
  unique(user_id, task_id)
);
alter table task_notes enable row level security;
drop policy if exists "Users can manage own notes" on task_notes;
create policy "Users can manage own notes" on task_notes for all using (auth.uid() = user_id);

-- 4. STREAKS
create table if not exists streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_activity_date date,
  total_tasks_completed integer default 0,
  updated_at timestamptz default now()
);
alter table streaks enable row level security;
drop policy if exists "Users can manage own streak" on streaks;
create policy "Users can manage own streak" on streaks for all using (auth.uid() = user_id);

-- 5. DAILY JOURNAL
create table if not exists daily_journal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  content text not null default '',
  mood integer default 3 check (mood between 1 and 5),
  created_at timestamptz default now(),
  unique(user_id, date)
);
alter table daily_journal enable row level security;
drop policy if exists "Users can manage own journal" on daily_journal;
create policy "Users can manage own journal" on daily_journal for all using (auth.uid() = user_id);

-- 6. GENERATED LESSONS (cache)
create table if not exists generated_lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null,
  lesson_data jsonb not null,
  generated_at timestamptz default now(),
  unique(user_id, task_id)
);
alter table generated_lessons enable row level security;
drop policy if exists "Users can manage own lessons" on generated_lessons;
create policy "Users can manage own lessons" on generated_lessons for all using (auth.uid() = user_id);

-- 7. QUIZ ATTEMPTS
create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null,
  question text,
  correct boolean,
  created_at timestamptz default now()
);
alter table quiz_attempts enable row level security;
drop policy if exists "Users can manage own quiz attempts" on quiz_attempts;
create policy "Users can manage own quiz attempts" on quiz_attempts for all using (auth.uid() = user_id);

-- 8. DOJO SESSIONS
create table if not exists dojo_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  snippet_id text not null,
  wpm integer,
  accuracy numeric(5,2),
  duration_ms integer,
  errors integer default 0,
  mode text default 'normal',
  created_at timestamptz default now()
);
alter table dojo_sessions enable row level security;
drop policy if exists "Users can manage own dojo sessions" on dojo_sessions;
create policy "Users can manage own dojo sessions" on dojo_sessions for all using (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- DONE — toutes les tables sont créées avec RLS activé
-- ═══════════════════════════════════════════════════════════════
