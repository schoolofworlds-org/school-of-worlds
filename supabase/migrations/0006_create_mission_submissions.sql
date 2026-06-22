-- Student mission submissions.
create table if not exists public.mission_submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  mission_id uuid references public.missions(id) not null,
  submission_text text,
  discord_link text,
  status text default 'submitted',
  xp_awarded int default 0,
  ai_feedback text,
  ai_grade int,
  submitted_at timestamp default now(),
  reviewed_at timestamp,
  unique (user_id, mission_id)
);

alter table public.mission_submissions enable row level security;

drop policy if exists "Users can view own submissions" on public.mission_submissions;
create policy "Users can view own submissions"
  on public.mission_submissions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own submissions" on public.mission_submissions;
create policy "Users can insert own submissions"
  on public.mission_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own submissions" on public.mission_submissions;
create policy "Users can update own submissions"
  on public.mission_submissions for update
  using (auth.uid() = user_id);
