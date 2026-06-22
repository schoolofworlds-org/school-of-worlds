-- Award XP automatically when a submission is created.
-- BEFORE INSERT: stamp the submission with the mission's xp_value.
create or replace function public.set_submission_xp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  select xp_value into new.xp_awarded
  from public.missions
  where id = new.mission_id;
  new.xp_awarded := coalesce(new.xp_awarded, 0);
  return new;
end;
$$;

drop trigger if exists trg_set_submission_xp on public.mission_submissions;
create trigger trg_set_submission_xp
  before insert on public.mission_submissions
  for each row execute function public.set_submission_xp();

-- AFTER INSERT: add the awarded XP to the user's running total.
create or replace function public.apply_submission_xp()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users
  set xp_total = coalesce(xp_total, 0) + coalesce(new.xp_awarded, 0)
  where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists trg_apply_submission_xp on public.mission_submissions;
create trigger trg_apply_submission_xp
  after insert on public.mission_submissions
  for each row execute function public.apply_submission_xp();
