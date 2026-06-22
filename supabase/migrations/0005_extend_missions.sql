-- Extend missions with curriculum fields (forward-only, idempotent).
alter table public.missions
  add column if not exists vocabulary text,
  add column if not exists requirements text,
  add column if not exists mission_type text not null default 'mission',
  add column if not exists unlock_order integer;

-- Constrain mission_type to the known kinds.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'missions_mission_type_check'
  ) then
    alter table public.missions
      add constraint missions_mission_type_check
      check (mission_type in ('mission', 'quest', 'summit'));
  end if;
end $$;

create index if not exists missions_world_unlock_idx
  on public.missions (world_id, unlock_order);
