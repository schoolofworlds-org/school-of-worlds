# STYLIZE — Design System (Single Source of Truth)

This file locks the visual language for School of Worlds. **Prose wins.** If a
token in `app/globals.css` disagrees with the values below, this file is correct
and the CSS is the bug.

Warm editorial. Dense information, not marketing. No hero sections, no banners,
no decorative gradients. Think a well-set reference manual, not a landing page.

## Palette

| Role             | Hex       | Notes                                  |
|------------------|-----------|----------------------------------------|
| Background       | `#F5F1E8` | Warm beige — the main page background.  |
| Card surface     | `#FFFFFF` | White cards.                           |
| Border           | `#E5DDD0` | Soft tan — every card and input border. |
| Primary text     | `#0B1220` | Dark navy.                             |
| Secondary text   | `#4B5563` | Muted gray for labels and meta.        |

### Buttons

- **Primary:** background `#0B1220`, text `#FFFFFF`.
- **Secondary:** transparent background, text `#0B1220`, `1px` `#E5DDD0` border.

### World accent colors

An accent appears **only on that world's own page** (`/worlds/[id]` and its
missions). Never on the dashboard, the worlds grid, nav, or any shared chrome —
shared surfaces stay on the neutral palette above.

| World             | Hex       |
|-------------------|-----------|
| Entrepreneurship  | `#F4A261` |
| AI & Technology   | `#7C3AED` |
| Engineering       | `#2563EB` |
| Medical           | `#E63946` |
| Cybersecurity     | `#0E9F6E` |
| Finance           | `#22C55E` |
| Leadership        | `#14B8A6` |

## Typography

- **Headlines:** Plus Jakarta Sans, weight 600–700.
- **Body:** Inter, weight 400, line-height 1.6.

Both are already wired in `app/layout.tsx` as `--font-jakarta` and
`--font-inter`.

## Component rules

- Card border radius: **12px**.
- Input border radius: **8px**.
- Tag / chip border radius: **9999px** (full pill).
- Shadows: **none** on cards at rest; on hover use
  `0 4px 20px rgba(11,18,32,0.04)`.
- Dense information layout. No marketing banners, no hero sections.

## How this maps to the codebase

`app/globals.css` defines the matching tokens under the "Stitch dashboard"
block: `--color-surface-variant: #F5F1E8`, `--color-border-subtle: #E5DDD0`,
`--color-primary` / `--color-on-surface: #0B1220`. Use those.

**Do not use** the older `--color-brand-*` tokens (`#E8E4D8` bg, `#D6D0C4`
border, `#1F2937` text/button) or the hardcoded `body { background: #E8E4D8 }`.
Those predate this palette and should be migrated to the values above. Until
that cleanup lands, treat this file — not the CSS — as the truth.
