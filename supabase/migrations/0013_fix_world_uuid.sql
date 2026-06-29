-- Fix: migration 0008 seeded the Entrepreneurship curriculum (24 missions,
-- 7 quests, 1 summit) against a hardcoded world_id
-- (30eafd3a-2cc4-4c7f-a631-b41e517de1ab) instead of the canonical
-- Entrepreneurship world. Repoint those missions to the world resolved BY NAME
-- via subquery — no hardcoded target UUID.
--
-- Scope: the WHERE clause limits the change to ONLY the 0008 curriculum
-- missions (all of which share the stale source id below), so missions in
-- other worlds are left untouched.
--
-- Safety: the EXISTS guard makes this a no-op if no 'Entrepreneurship' world
-- is present, rather than setting world_id to NULL and violating the NOT NULL
-- constraint on missions.world_id.

update public.missions
set world_id = (
  select id
  from public.worlds
  where name = 'Entrepreneurship'
  order by created_at
  limit 1
)
where world_id = '30eafd3a-2cc4-4c7f-a631-b41e517de1ab'
  and exists (
    select 1 from public.worlds where name = 'Entrepreneurship'
  );
