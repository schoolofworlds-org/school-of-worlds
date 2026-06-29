-- Fix: XP timing. Migration 0007 awarded XP on INSERT into mission_submissions
-- (i.e. on submission). The product rule (ARCHITECT.md) is that XP is awarded
-- only when the AI grade PASSES. A passing grade is ai_grade in (3, 4, 5).

-- Remove the old on-submission XP triggers and functions.
drop trigger if exists trg_set_submission_xp on public.mission_submissions;
drop trigger if exists trg_apply_submission_xp on public.mission_submissions;
drop function if exists public.set_submission_xp();
drop function if exists public.apply_submission_xp();

-- Award XP when a submission's ai_grade first reaches a passing grade.
create or replace function public.award_xp_on_passing_grade()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Fire only on the transition INTO a passing grade (>= 3) from a
  -- non-passing or ungraded state. This prevents double-awarding when the
  -- grade is later changed between passing values (e.g. 3 -> 5) or the row
  -- is updated again for other reasons.
  if new.ai_grade is not null
     and new.ai_grade >= 3
     and (old.ai_grade is null or old.ai_grade < 3) then

    -- Stamp the submission with the mission's XP value...
    select coalesce(xp_value, 0) into new.xp_awarded
    from public.missions
    where id = new.mission_id;
    new.xp_awarded := coalesce(new.xp_awarded, 0);

    -- ...and add it to the student's running total.
    update public.users
    set xp_total = coalesce(xp_total, 0) + new.xp_awarded
    where id = new.user_id;
  end if;

  -- ponytail: no un-award path if a passing grade is later lowered. Add a
  -- subtraction branch here only if Guides start reversing grades in practice.
  return new;
end;
$$;

drop trigger if exists trg_award_xp_on_passing_grade on public.mission_submissions;
create trigger trg_award_xp_on_passing_grade
  before update on public.mission_submissions
  for each row
  execute function public.award_xp_on_passing_grade();
