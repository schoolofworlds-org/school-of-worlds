# ARCHITECT — Data Model & Product Rules (Single Source of Truth)

Stack: Next.js (App Router) + Supabase (Postgres, Auth, Storage). Schema below
reflects `supabase/migrations/` as of `0012`. Where a migration and reality
disagree, the **Known conflicts** section at the bottom says which is right.

## The platform has 3 jobs

1. **Deliver missions** — show each student the missions for their one active world.
2. **Collect submissions** — students upload PDF files against a mission.
3. **Track progress** — XP, world progress, completed work.

Everything else is in service of those three. If a feature doesn't deliver,
collect, or track, question whether it exists.

## Tables

### `users`
Mirror of `auth.users`, created automatically by the `handle_new_user` trigger
on signup (`0000`).

| Column      | Type        | Notes                                      |
|-------------|-------------|--------------------------------------------|
| `id`        | uuid PK     | FK → `auth.users`, cascade delete.         |
| `email`     | text        | unique, not null.                          |
| `name`      | text        | editable in `/settings`.                   |
| `avatar_url`| text        |                                            |
| `world_id`  | uuid        | The student's **one active world**.        |
| `xp_total`  | integer     | default 0. Running total, see XP trigger.  |
| `created_at`| timestamptz |                                            |

RLS: a user can select/update only their own row.

### `worlds` (`0001`)
Shared catalogue. Any authenticated user can read.

| Column      | Type    | Notes                                         |
|-------------|---------|-----------------------------------------------|
| `id`        | uuid PK |                                               |
| `name`      | text    |                                               |
| `color`     | text    | Hex accent (see STYLIZE world colors).        |
| `status`    | text    | DB stores `active`/`locked`/`completed`. Product-facing labels differ — see conflicts. |
| `progress`  | integer | 0–100.                                         |
| `created_at`| timestamptz |                                           |

### `missions` (`0001`, extended `0005`)
Shared catalogue. Any authenticated user can read.

| Column        | Type    | Origin | Notes                                          |
|---------------|---------|--------|------------------------------------------------|
| `id`          | uuid PK | 0001   |                                                |
| `world_id`    | uuid    | 0001   | FK → `worlds`, cascade delete.                 |
| `title`       | text    | 0001   |                                                |
| `description` | text    | 0001   | The mission brief.                             |
| `vocabulary`  | text    | 0005   | Key terms for the mission.                     |
| `requirements`| text    | 0005   | Deliverables (e.g. "Mission Report, …").       |
| `mission_type`| text    | 0005   | `mission` \| `quest` \| `summit` (checked).    |
| `unlock_order`| integer | 0005   | **Controls the 2-day unlock cadence.**         |
| `week_number` | integer | seed   | Groups missions by week. ⚠ see conflicts.      |
| `xp_value`    | integer | seed   | XP this mission is worth. ⚠ see conflicts.     |
| `created_at`  | timestamptz | 0001 |                                              |

Legacy columns still present from `0001` but superseded: `status` (per-student
status really lives in `mission_submissions`), `xp_reward` (replaced by
`xp_value`), `order_index` (replaced by `unlock_order`). Don't write to these.

Index: `missions (world_id, unlock_order)`.

### `mission_submissions` (`0006`, file URLs added `0011`)
One row per `(user_id, mission_id)` — enforced by a unique constraint.

| Column                   | Type      | Notes                                       |
|--------------------------|-----------|---------------------------------------------|
| `id`                     | uuid PK   |                                             |
| `user_id`                | uuid      | FK → `auth.users`, not null.                |
| `mission_id`             | uuid      | FK → `missions`, not null.                  |
| `submission_text`        | text      | Optional notes.                             |
| `discord_link`           | text      | Optional.                                   |
| `status`                 | text      | default `submitted`.                        |
| `xp_awarded`             | int       | default 0. Set by the XP trigger.           |
| `ai_grade`               | int       | **1–5** from Claude. null until graded.     |
| `ai_feedback`            | text      | Claude's written feedback. null until graded.|
| `submitted_at`           | timestamp | default now().                              |
| `reviewed_at`            | timestamp | set when grading completes.                 |
| `mission_report_url`     | text      | **File URL (0011).**                        |
| `research_notes_url`     | text      | **File URL (0011).**                        |
| `ai_prompt_log_url`      | text      | **File URL (0011).**                        |
| `reflection_document_url`| text      | **File URL (0011).**                        |

RLS: a user can select/insert/update only rows where `auth.uid() = user_id`.

The 4 `*_url` columns hold paths into the private **`submissions`** storage
bucket. Object path convention: `{user_id}/{mission_id}/{field_name}/{filename}`
— first segment is the owner, which is how storage RLS scopes access
(`0010`, `0012`). **Students submit PDF files only — no Word docs.**

### `announcements` (`0002`)
Broadcast, read-only to all authenticated users. Columns: `id`, `title`,
`body`, `author`, `priority` (`low`/`normal`/`high`), `created_at`.

### `portfolio_items` (`0003`)
Private per-user CRUD. Columns: `id`, `user_id`, `title`, `description`,
`image_url`, `link_url`, `created_at`. (The `/portfolio` page that consumes this
is not built yet — see BLUEPRINT.)

## Triggers & functions

- **`handle_new_user`** (`0000`, AFTER INSERT on `auth.users`) — creates the
  matching `public.users` row.
- **`set_submission_xp`** (`0007`, BEFORE INSERT on `mission_submissions`) —
  copies `missions.xp_value` into `xp_awarded`.
- **`apply_submission_xp`** (`0007`, AFTER INSERT on `mission_submissions`) —
  adds `xp_awarded` to `users.xp_total`.

## Product rules

- **XP is awarded only when the AI grade passes — not on submission.** XP for a
  mission lands when `ai_grade` clears the pass bar, not when the file is
  uploaded. ⚠ The shipped trigger does **not** implement this yet (see conflicts).
- **Students submit PDF files only.** No Word docs. Enforce at the upload form.
- **AI grading:** the Claude API reads the submission files + the mission rubric
  (`description` / `requirements`), returns a grade (**1–5**) and written
  feedback, stored in `ai_grade` and `ai_feedback`. `reviewed_at` is stamped.
- **One human override path must exist:** a Guide can manually adjust `ai_grade`
  (and therefore the pass/fail outcome) from the admin dashboard. This is the
  beta safety valve — AI grades automatically, a human can override.

## Known conflicts (migrations vs. intended state)

1. **XP timing.** Product rule says XP is awarded only when the AI grade passes.
   The `0007` triggers award `xp_value` on **INSERT**, unconditionally, before
   any grading. To match the rule, XP must move to an UPDATE path gated on
   `ai_grade` passing. **Rule wins; trigger is the bug.**
2. **Phantom columns.** `week_number` and `xp_value` are written by the seed
   (`0008`) and `xp_value` is read by the trigger (`0007`), but **no migration
   ever adds either column** (there is no `0009`). They must have been added by
   hand in the dashboard. Add a migration so the schema is reproducible.
3. **`mission_submissions` created twice.** `0004` creates a thin version
   (`discord_link`, `status`, `submitted_at`); `0006` re-creates it
   `IF NOT EXISTS` with the full column set. On a clean run `0006` is skipped and
   the rich columns (`ai_grade`, `ai_feedback`, `xp_awarded`, `submission_text`,
   `reviewed_at`, the unique constraint) never get created. The effective schema
   documented above is the **intended** one (`0006` + `0011`); reconcile the
   migrations so a fresh DB matches it.
4. **Entrepreneurship world id mismatch.** `0001` seeds Entrepreneurship as
   `1111…`; the curriculum seed (`0008`) attaches 24 missions / 7 quests / 1
   summit to `30eafd3a-2cc4-4c7f-a631-b41e517de1ab`, a world `0001` never
   creates. The live Entrepreneurship world must be `30eafd3a…`; the `1111…`
   seed row is stale.
5. **Catalogue drift.** `0001` seeds "Artificial Intelligence" (STYLIZE calls it
   "AI & Technology") and has no Medical world, though Medical (`#E63946`) is in
   the locked palette. `globals.css` also carries extra world tokens (sports,
   artist, history, media, business, stem, …) with no backing worlds.
