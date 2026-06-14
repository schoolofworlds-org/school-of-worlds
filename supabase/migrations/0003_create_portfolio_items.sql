-- Create portfolio_items table
create table public.portfolio_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  image_url text,
  link_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index portfolio_items_user_id_idx on public.portfolio_items (user_id);

-- Enable RLS
alter table public.portfolio_items enable row level security;

-- Portfolio items are private: each user can only see and manage their own.
create policy "Users can view their own portfolio items."
  on public.portfolio_items for select
  to authenticated
  using ( auth.uid() = user_id );

create policy "Users can insert their own portfolio items."
  on public.portfolio_items for insert
  to authenticated
  with check ( auth.uid() = user_id );

create policy "Users can update their own portfolio items."
  on public.portfolio_items for update
  to authenticated
  using ( auth.uid() = user_id );

create policy "Users can delete their own portfolio items."
  on public.portfolio_items for delete
  to authenticated
  using ( auth.uid() = user_id );
