-- Create announcements table
create table public.announcements (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text,
  author text not null default 'School of Worlds',
  -- 'low' | 'normal' | 'high'
  priority text not null default 'normal',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index announcements_created_at_idx on public.announcements (created_at desc);

-- Enable RLS
alter table public.announcements enable row level security;

-- Announcements are broadcast to every signed-in user.
create policy "Authenticated users can view announcements."
  on public.announcements for select
  to authenticated
  using ( true );

-- Seed announcements
insert into public.announcements (title, body, author, priority, created_at) values
  ('New world: Cybersecurity is coming soon', 'We are putting the finishing touches on the Cybersecurity world. Expect hands-on missions covering threat modelling and secure coding.', 'Product Team', 'high', timezone('utc'::text, now()) - interval '1 day'),
  ('Weekly office hours', 'Join our mentors every Friday at 4pm for live Q&A. Bring your toughest mission blockers.', 'Mentorship Team', 'normal', timezone('utc'::text, now()) - interval '4 days'),
  ('Scheduled maintenance', 'The platform will be briefly unavailable Sunday 2am-3am UTC for upgrades.', 'Engineering', 'low', timezone('utc'::text, now()) - interval '7 days');
