# BLUEPRINT — Pages & Product Rules (Single Source of Truth)

What exists, what's planned, and the rules that govern behavior. For the data
model see [ARCHITECT.md](./ARCHITECT.md); for visuals see [STYLIZE.md](./STYLIZE.md).

Routing: authed app pages live under `app/(app)/`; `app/page.tsx` redirects to
`/dashboard` if signed in, else `/login`.

## Pages — current state

| Route             | Status      | Purpose                                                        |
|-------------------|-------------|---------------------------------------------------------------|
| `/login`          | built       | Auth (email + Google OAuth).                                  |
| `/signup`         | built       | Auth.                                                         |
| `/dashboard`      | built       | Student home: active world + its missions + XP.              |
| `/worlds`         | built       | Browse all worlds.                                           |
| `/worlds/[id]`    | built       | World detail; missions grouped by week. Only page that shows the world accent color. |
| `/missions/[id]`  | built       | Mission brief + PDF file submission form.                   |
| `/announcements`  | built       | Platform announcements.                                      |
| `/settings`       | built       | Name, email, logout.                                         |
| `/portfolio`      | **not built** | Auto-populated from completed submissions.                |
| `/admin`          | **not built** | Guide dashboard: view submissions, see AI grade, override grade. |

## Pages to delete

- **`/community`** (`app/(app)/community/page.tsx`) — placeholder, no plan.
  Remove it, or clearly mark it deferred. Don't ship dead "coming soon" pages.

## Product rules

- **One active world.** A student can be in exactly one active world at a time
  (`users.world_id`). The dashboard and mission delivery key off it.
- **2-day unlock cadence.** Missions unlock every 2 days, ordered by
  `missions.unlock_order`.
- **XP values:**
  - Mission = **50 XP** — awarded **on passing AI grade**, not on submission.
  - Quest = **200 XP**.
  - Summit = **500 XP**.
- **World statuses (product-facing):** `Not Started` | `Starting Soon` |
  `In Progress` | `Completed`. (Note: the DB `worlds.status` column currently
  stores `active`/`locked`/`completed` — see ARCHITECT conflict #1 on worlds.)
- **Beta grading rule:** AI grading is automated, but a **Guide can override**
  any grade from `/admin`. This override path is required, not optional.

## Build order (what's missing)

1. **`/admin`** — submissions list, AI grade view, manual override. Unblocks the
   beta grading rule and the human-override requirement in ARCHITECT.
2. **`/portfolio`** — reads `portfolio_items`, auto-populated from completed
   (passed) submissions.
3. Reconcile the XP trigger so XP fires on AI-grade pass, not on submission
   (ARCHITECT conflict #1).
