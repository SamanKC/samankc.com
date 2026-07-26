# Personal Portfolio Website — Design

Date: 2026-07-26

## Purpose

Build the first version of a personal portfolio website for a software engineer, showcasing projects, blog posts, achievements, education, and jobs. Deployed as static files to Hostinger shared hosting (no Node server available at runtime). Content is placeholder for now — the real name/bio/history/projects/posts will be dropped in afterward by the owner.

## Stack

- Next.js 14 (App Router) + TypeScript + Tailwind CSS, scaffolded with `create-next-app`.
- `next.config.js`: `output: 'export'`, `images: { unoptimized: true }` (static export disables Next's image optimization server, so `next/image` still works but emits plain `<img>`).
- npm as the package manager.
- Framer Motion — scroll-triggered fade/slide-in animations, `useReducedMotion` for `prefers-reduced-motion` support.
- `next-themes` (or a small custom hook if `next-themes` doesn't play well with static export) for dark/light theming, persisted to `localStorage`, dark by default, with an inline pre-hydration script to avoid flash-of-wrong-theme.
- `lucide-react` for icons (nav, social links, hamburger menu, etc).
- `gray-matter` + `remark` + `remark-html` for parsing Markdown blog posts at build time; a small word-count-based reading-time calculation (no extra dependency needed, or `reading-time` package if convenient).
- Placeholder images sourced from `picsum.photos` with fixed seeds (e.g. `picsum.photos/seed/project-1/800/600`) so each placeholder is stable across builds/reloads rather than random.

## Directory structure

```
app/
  layout.tsx                  — root layout: <html>, ThemeProvider, Navbar, Footer, theme-flash-prevention script
  page.tsx                    — Home
  projects/page.tsx           — Projects grid (all projects)
  projects/[slug]/page.tsx    — Project detail/case-study (generateStaticParams from data/projects.ts)
  blog/page.tsx               — Blog list (all posts)
  blog/[slug]/page.tsx        — Blog post page (generateStaticParams from content/blog/*.md)
  about/page.tsx              — About/Resume combined timeline
  contact/page.tsx            — Contact
  not-found.tsx               — 404 page
components/
  Navbar.tsx                  — nav bar with links + ThemeToggle, collapses to hamburger below `md`
  MobileMenu.tsx               — slide-in mobile nav panel
  Footer.tsx                  — footer with social links + copyright
  ThemeToggle.tsx              — dark/light toggle button
  ProjectCard.tsx               — project grid card
  BlogCard.tsx                 — blog list card
  TimelineItem.tsx              — one entry in the About/Resume timeline
  AnimatedSection.tsx           — Framer Motion wrapper: whileInView fade/slide, gated by useReducedMotion
  SocialLinks.tsx               — GitHub/LinkedIn/email icon row (reused on About + Contact)
  ResumeButton.tsx               — "Download Resume" CTA linking to /resume-placeholder.pdf
lib/
  markdown.ts                  — reads/parses content/blog/*.md into typed post objects + HTML + reading time
data/
  profile.ts                   — name, title, tagline, bio, social links, resume path
  projects.ts                  — typed array of Project objects
  timeline.ts                  — typed array of TimelineEntry (job | education | achievement), chronological
content/
  blog/*.md                    — frontmatter (title, date, excerpt, tags) + Markdown body
public/
  resume-placeholder.pdf, favicon.ico, og-image.png (or .svg)
```

## Data model (placeholder content)

- `data/profile.ts`: name, title/role, short intro, longer bio paragraph(s) for About, social URLs (GitHub/LinkedIn/email), resume PDF path.
- `data/projects.ts`: 6 projects, each with `slug, title, shortDescription, longDescription (case-study writeup), techStack: string[], thumbnail, gallery: string[], liveUrl?, githubUrl?, featured: boolean`. 2–3 marked `featured` for the Home page.
- `data/timeline.ts`: ~6 entries mixing jobs, education, and achievements, each with `kind: 'job' | 'education' | 'achievement', title, organization, dateRange, description`, sorted descending by date and rendered as a single unified timeline (not separated by kind).
- `content/blog/*.md`: 4 posts with frontmatter `title, date, excerpt, tags: string[]` and realistic-sounding placeholder body text (a few paragraphs each) so reading-time and layout are meaningfully testable.

All placeholder values are obviously placeholder (e.g. `"Project Name Here"`, `"Company Name — Job Title"`, `"Lorem-ipsum-style but readable description of the project and what it does."`) and centralized in the files above for easy replacement.

## Pages & behavior

- **Home**: hero (name, title, short intro, CTA buttons to `/projects` and `/about`), featured projects section (cards for `featured: true` projects), brief teaser CTA.
- **Projects**: responsive grid (1 col mobile → 2 → 3 at wider breakpoints) of all projects; each `ProjectCard` links to `/projects/[slug]`.
- **Project detail**: title, long-form case-study writeup, image gallery (thumbnail + gallery images), tech stack tags, live-demo/GitHub links (buttons, disabled/hidden gracefully if a URL is absent).
- **Blog**: list of posts (title, formatted date, excerpt, tags, computed reading time), links to `/blog/[slug]`.
- **Blog post**: renders parsed Markdown HTML, shows title/date/tags/reading time.
- **About/Resume**: single page presenting the unified timeline (jobs + education + achievements interleaved chronologically) as one story, plus a "Download Resume" button.
- **Contact**: social icon links (GitHub/LinkedIn/email) + the same Download Resume button. No form.

## Theming & animation

- Tailwind `darkMode: 'class'`; dark is default. Toggle persists to `localStorage`; an inline script in `layout.tsx`'s `<head>` reads the stored value before paint to avoid a flash of the wrong theme.
- Accent system: violet → cyan gradient, used on primary buttons, headings/highlights, card hover borders/glows; separately tuned shades for dark vs. light mode to keep contrast accessible (WCAG AA target for text).
- `AnimatedSection` (Framer Motion `whileInView`, fade + slight slide) wraps major page sections; hover states on cards/buttons/links use Tailwind transition utilities. `useReducedMotion` disables/simplifies motion when the user prefers reduced motion.

## Responsiveness

- Tailwind breakpoints (`sm/md/lg/xl`) control grid column counts, nav collapse point (hamburger + slide-in `MobileMenu` below `md`), and fluid typography sizing.
- Manual verification at 375px, 768px, 1024px, and 1440px+ via the dev server before calling the build done — checking for no horizontal scroll, no overlap, readable text sizes.

## SEO / accessibility

- Per-page `metadata` exports (title, description, Open Graph tags) using the Next Metadata API; a shared default in the root layout as fallback.
- Favicon + `og-image` placeholder in `public/`.
- Semantic landmarks (`nav`, `main`, `footer`), `alt` text placeholders on all images, keyboard-focusable nav/menu/toggle (visible focus states), color choices checked for sufficient contrast in both themes.

## Build & deploy

- `npm run build` → static `out/` folder (via `output: 'export'`).
- README documents: install deps, `npm run dev` for local preview, `npm run build` to produce `out/`, then upload the contents of `out/` to Hostinger's `public_html` (or subfolder) via FTP/File Manager.

## Out of scope for v1

- No CMS, no database, no contact form, no analytics, no i18n.
- No real content — everything above is placeholder, clearly labeled, centralized for easy replacement later.

## Testing / verification approach

No automated test suite for a static content site. Verification is:
1. `npm run build` completes without errors and produces `out/`.
2. Manual click-through of every route (Home, Projects, each project detail, Blog, each post, About, Contact) in the dev server.
3. Manual responsive check at the four breakpoints listed above.
4. Manual dark/light toggle check (persists across reload) and reduced-motion check (via OS/browser setting or devtools emulation).
