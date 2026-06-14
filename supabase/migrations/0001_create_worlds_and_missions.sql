-- Create worlds table
create table public.worlds (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  -- Hex colour used as the card accent (see globals.css --color-world-* tokens)
  color text not null default '#1F2937',
  -- 'active' | 'locked' | 'completed'
  status text not null default 'active',
  progress integer not null default 0 check (progress between 0 and 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create missions table
create table public.missions (
  id uuid default gen_random_uuid() primary key,
  world_id uuid references public.worlds on delete cascade not null,
  title text not null,
  description text,
  -- 'todo' | 'in_progress' | 'completed'
  status text not null default 'todo',
  xp_reward integer not null default 0,
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index missions_world_id_idx on public.missions (world_id);

-- Enable RLS
alter table public.worlds enable row level security;
alter table public.missions enable row level security;

-- Worlds and missions are shared catalogue content: any signed-in user can read them.
create policy "Authenticated users can view worlds."
  on public.worlds for select
  to authenticated
  using ( true );

create policy "Authenticated users can view missions."
  on public.missions for select
  to authenticated
  using ( true );

-- Seed worlds (colours match the --color-world-* tokens in globals.css)
insert into public.worlds (id, name, color, status, progress) values
  ('11111111-1111-1111-1111-111111111111', 'Entrepreneurship', '#F4A261', 'active',    75),
  ('22222222-2222-2222-2222-222222222222', 'Artificial Intelligence', '#7C3AED', 'active', 40),
  ('33333333-3333-3333-3333-333333333333', 'Engineering', '#2563EB', 'active',    20),
  ('44444444-4444-4444-4444-444444444444', 'Cybersecurity', '#0E9F6E', 'locked',  0),
  ('55555555-5555-5555-5555-555555555555', 'Finance', '#22C55E', 'completed',     100),
  ('66666666-6666-6666-6666-666666666666', 'Leadership', '#14B8A6', 'active',     55);

-- Seed missions for a couple of worlds
insert into public.missions (world_id, title, description, status, xp_reward, order_index) values
  ('11111111-1111-1111-1111-111111111111', 'Validate your idea', 'Interview 5 potential customers and document their pain points.', 'completed', 100, 1),
  ('11111111-1111-1111-1111-111111111111', 'Build a landing page', 'Ship a one-page site that explains your value proposition.', 'in_progress', 150, 2),
  ('11111111-1111-1111-1111-111111111111', 'Run your first ad', 'Set a small budget and measure click-through rate.', 'todo', 200, 3),
  ('22222222-2222-2222-2222-222222222222', 'Train a classifier', 'Use a public dataset to train a simple image classifier.', 'in_progress', 200, 1),
  ('22222222-2222-2222-2222-222222222222', 'Prompt engineering basics', 'Learn how to structure prompts for reliable outputs.', 'todo', 120, 2),
  ('33333333-3333-3333-3333-333333333333', 'CAD fundamentals', 'Model a simple bracket and export it for printing.', 'todo', 100, 1);
