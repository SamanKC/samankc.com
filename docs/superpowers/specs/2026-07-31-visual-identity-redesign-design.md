# Visual Identity Redesign — Design Spec

## Problem

The site currently uses a very common "AI-generated SaaS template" visual signature:
violet-to-cyan gradient buttons, the Inter + Space Grotesk font pairing, default
Tailwind `slate` dark mode, a backdrop-blur glass navbar, and rounded-2xl cards
with a hover-lift + shadow interaction. None of these choices are individually
wrong, but together they read as templated rather than distinctly personal.

Goal: replace the visual identity with something that reads as deliberate and
technical/precise, without changing any page structure, content, routing, or
functionality (admin editor, deploy pipeline, blog rendering, etc. are all
untouched — this is a pure visual restyle).

## Personality direction

**Technical & precise.** Clean, minimal, engineer-like. Sharp edges over soft
ones. Muted, deliberate color use over bright/playful. The site should feel
like a well-built tool, not a marketing landing page.

## Color tokens

Two new custom Tailwind v4 theme scales defined in `app/globals.css` via
`@theme`, replacing all direct usage of `slate`, `violet`, and `cyan` utility
classes across the codebase.

### `--color-ink-*` (navy/charcoal base)

A single scale, following standard Tailwind convention (`50` lightest →
`950` darkest), deliberately deeper and more desaturated-blue than Tailwind's
stock `slate` so it doesn't read as "default Tailwind dark mode." Like the
rest of the codebase today, light/dark mode is handled with explicit
`dark:` variant classes per element (e.g. `bg-ink-50 dark:bg-ink-950`) — the
hex values themselves do not change based on mode.

| Token | Value | Typical usage |
|---|---|---|
| `ink-50` | `#FBFBFA` | page background (light mode) |
| `ink-100` | `#EDEFF2` | card/surface background (light mode) |
| `ink-200` | `#DDE1E6` | borders (light mode) |
| `ink-600` | `#57626F` | muted/secondary text (light mode) |
| `ink-700` | `#2E3746` | borders (dark mode) |
| `ink-800` | `#1C2430` | hover surface (dark mode) |
| `ink-900` | `#131924` | card/surface background (dark mode) |
| `ink-950` | `#0B0F17` | page background (dark mode) / primary text (light mode) |

Primary text uses `text-ink-950 dark:text-ink-100`; muted text uses
`text-ink-600 dark:text-ink-400` (an `ink-400` value of `#8791A0` is added
for this dark-mode-muted role).

### `--color-ember-*` (single warm accent)

Burnt-orange/rust, used sparingly — one accent, not a rainbow, and never
part of a gradient. Critically, this is **one hue** adjusted for lightness
per mode (`text-ember-600 dark:text-ember-400`), unlike today's site which
switches to a completely different hue (violet → cyan) between modes — that
hue-swap is itself part of what makes the current look feel templated.

| Token | Value | Usage |
|---|---|---|
| `ember-600` | `#B44E08` | light-mode accent (links, active nav, tag text, primary button fill) |
| `ember-400` | `#F2A65A` | dark-mode accent (same roles) |

## Typography

Replace `Inter` + `Space Grotesk` with the **IBM Plex** superfamily (both free
via Google Fonts, loaded through `next/font` exactly as the current fonts
are), since they're designed by IBM as a matched pair for technical products
rather than an arbitrarily combined pairing:

- **IBM Plex Mono** — `--font-display`. Used for: hero name, all headings,
  nav links, section eyebrow labels, tech-stack tags/badges.
- **IBM Plex Sans** — `--font-sans`. Used for: all body copy — paragraphs,
  descriptions, blog post content.

## Component changes

- **Navbar** (`components/Navbar.tsx`, `components/MobileMenu.tsx`) — remove
  `backdrop-blur`/glass effect; solid `ink-950`/`ink-50`-equivalent background
  with a plain 1px `ink-700` bottom border. Active link: `ember`. Inactive
  links: muted `ink` text.
- **Hero** (`app/page.tsx`) — same centered layout (per user preference, lower
  risk). Eyebrow text and name in IBM Plex Mono. Eyebrow uses `ember` as a
  plain color (not gradient text).
- **Buttons** (all CTAs site-wide) — `rounded-md` (6px, not `rounded-full`),
  solid `ember` fill for primary actions, `ink`-bordered outline (no fill) for
  secondary actions. No gradients anywhere in the site after this change.
- **Project cards** (`components/ProjectCard.tsx`) — `rounded-md` (6px, not
  `rounded-2xl`). Hover state: border color shifts to `ember` only. No
  translate/lift, no shadow.
- **Tech-stack tags/badges** (project cards, project detail pages) — IBM Plex
  Mono, sharp corners, `ink-800`/`ink-100`-equivalent background with `ember`
  text, replacing the current rounded-full violet/cyan pill.
- **Footer** (`components/Footer.tsx`) — restyled to match (ink/ember, mono
  labels for any label text), structure unchanged.

## Scope — files touched

Purely visual/styling changes, no logic changes:

- `app/globals.css` (theme tokens, font vars)
- `app/layout.tsx` (font imports/vars, if font loading needs updating)
- `components/Navbar.tsx`, `components/MobileMenu.tsx`, `components/Footer.tsx`
- `components/ProjectCard.tsx`
- `app/page.tsx` (hero + featured projects section)
- `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`
- `app/about/page.tsx`, `app/contact/page.tsx`
- `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
- `components/admin/*` (TokenGate, PostList, PostEditor, AdminClient) —
  restyled to match for visual consistency, since it's one cohesive site;
  no behavioral changes.
- Any other component referencing `slate-`, `violet-`, or `cyan-` Tailwind
  classes directly (to be found via grep during implementation).

Out of scope: any change to routing, data files (`data/*.ts`), the blog admin
editor's behavior, the deploy pipeline, or test logic. Existing tests should
continue to pass unmodified, since they test behavior/data, not visual
styling.

## Testing / verification

- `npm run build` must succeed with no type errors.
- `npx vitest run` — existing suite must stay green unmodified.
- Since no visual/browser tooling is available in this environment,
  verification will be via: rendered HTML inspection (curl against the dev
  server) to confirm expected class names/text are present, and a manual
  grep sweep to confirm no leftover `violet-`, `cyan-`, `gradient`, or
  `rounded-full` (on buttons/cards) references remain.
- Re-run the Impeccable design hook after implementation to confirm the
  `ai-color-palette` finding no longer triggers and no new findings appear
  (e.g. an overused-font flag, unlikely given IBM Plex isn't a cliché choice).

## Non-goals

- No change to site structure, copy, or information architecture.
- No change to animations/motion beyond removing the hover-lift class on
  cards (replaced with a border-color transition, which is a strict
  simplification, not new behavior).
- Not attempting a fully bespoke hand-tuned palette (Approach C) — this
  builds on Tailwind's scale conventions with custom values, keeping
  implementation effort moderate.
