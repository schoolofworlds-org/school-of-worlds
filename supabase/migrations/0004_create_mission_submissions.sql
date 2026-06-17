-- Create mission_submissions table (exact DDL as requested)
CREATE TABLE IF NOT EXISTS mission_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  mission_id uuid REFERENCES missions(id),
  discord_link text,
  status text DEFAULT 'submitted',
  submitted_at timestamp DEFAULT now()
);

-- Secure the table: without RLS + policies the authenticated client either
-- has open access (RLS off) or is blocked entirely (RLS on, no policy).
-- These let a signed-in user create and read only their own submissions.
alter table public.mission_submissions enable row level security;

create policy "Users can insert their own submissions."
  on public.mission_submissions for insert
  to authenticated
  with check ( auth.uid() = user_id );

create policy "Users can view their own submissions."
  on public.mission_submissions for select
  to authenticated
  using ( auth.uid() = user_id );
