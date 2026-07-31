# Visual Identity Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's generic "AI-template" visual signature (violet/cyan gradients, Inter + Space Grotesk, default Tailwind slate dark mode, rounded-full/rounded-2xl chrome) with a custom `ink`/`ember` color system and IBM Plex Mono + IBM Plex Sans typography, across every page and component, with zero changes to behavior, routing, or content.

**Architecture:** Two new Tailwind v4 theme color scales (`ink`, `ember`) and two new font variables are defined once in `app/globals.css` / `app/layout.tsx` (Task 1), then every component/page that references the old `slate-`/`violet-`/`cyan-` classes, gradients, or `rounded-full`/`rounded-2xl` chrome is updated to the new system, grouped by area of the site so each task is independently reviewable and testable via `npm run build` + `npx vitest run`.

**Tech Stack:** Next.js 16 (App Router, static export), Tailwind CSS v4 (`@theme` tokens), `next/font/google` (IBM Plex Mono, IBM Plex Sans), existing Vitest suite (behavioral tests only — no styling assertions exist today).

## Global Constraints

- Every task's changes are pure styling (`className` strings, font imports, theme tokens). No component logic, props, exported types, routing, or data files change in this plan.
- Since there is no new business logic, tasks do not follow literal TDD red/green. The safety net is: `npm run build` must succeed (catches type/compile errors) and `npx vitest run` must stay green **unmodified** (the existing suite tests behavior/data, not styling, and does not assert on any className — confirmed by grep before writing this plan).
- Design tokens (from `docs/superpowers/specs/2026-07-31-visual-identity-redesign-design.md`):
  - `ink` scale: `ink-50 #FBFBFA`, `ink-100 #EDEFF2`, `ink-200 #DDE1E6`, `ink-400 #8791A0`, `ink-600 #57626F`, `ink-700 #2E3746`, `ink-800 #1C2430`, `ink-900 #131924`, `ink-950 #0B0F17`.
  - `ember` scale: `ember-600 #C2570C` (light-mode accent), `ember-400 #F2A65A` (dark-mode accent). One hue, adjusted lightness per mode — never swap to a different hue between light/dark.
  - No gradients anywhere. No `rounded-full` on buttons or cards (circular icon buttons in `SocialLinks.tsx` are the one legitimate exception — a conventional circular icon-button pattern, not a "gradient CTA pill"). Buttons and cards use `rounded-md` (6px).
  - Primary buttons: `bg-ember-600 text-white` (light) / `dark:bg-ember-400 dark:text-ink-950` (dark) — the darker ink text on the lighter dark-mode accent keeps contrast correct.
  - IBM Plex Mono → `font-display` (headings, nav, labels, tags). IBM Plex Sans → `font-sans` (body text, already the default via `--font-sans`, so most body text needs no class change — only elements that currently force `font-display` on headings need the mono class kept/added).
- Do not touch: `data/*.ts` content, `lib/*.ts` logic, the blog admin editor's behavior (`components/admin/*` logic), the deploy pipeline, or existing placeholder copy bugs unrelated to styling (e.g. leftover "replace with your real..." text in `app/projects/page.tsx` / `app/blog/page.tsx` metadata, and `metadataBase` in `app/layout.tsx`) — those are out of scope for this plan.
- After each task, run both `npm run build` and `npx vitest run` from the project root (`/Volumes/Disk-1/PersonalWebsite`) before committing.

---

### Task 1: Design tokens and typography foundation

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: nothing (this is the foundation task).
- Produces: Tailwind utility classes `bg-ink-{50,100,200,400,600,700,800,900,950}`, `text-ink-*`, `border-ink-*`, `divide-ink-*` and `bg-ember-{400,600}`, `text-ember-*`, `border-ember-*` become available everywhere via Tailwind's `@theme` JIT scanning. `font-sans` now resolves to IBM Plex Sans, `font-display` to IBM Plex Mono. All later tasks depend on this task landing first.

- [ ] **Step 1: Replace `app/globals.css` with the token-updated version**

Full new file content:

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: var(--font-ibm-plex-sans), sans-serif;
  --font-display: var(--font-ibm-plex-mono), monospace;

  --color-ink-50: #FBFBFA;
  --color-ink-100: #EDEFF2;
  --color-ink-200: #DDE1E6;
  --color-ink-400: #8791A0;
  --color-ink-600: #57626F;
  --color-ink-700: #2E3746;
  --color-ink-800: #1C2430;
  --color-ink-900: #131924;
  --color-ink-950: #0B0F17;

  --color-ember-400: #F2A65A;
  --color-ember-600: #C2570C;
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 2: Replace `app/layout.tsx` with the new font imports and body classes**

Full new file content:

```tsx
import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { profile } from '@/data/profile';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
});
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
});

const siteTitle = `${profile.name} — ${profile.title}`;
const siteDescription = `Portfolio of ${profile.name} — ${profile.title.toLowerCase()}. Projects, writing, and background.`;

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain-here.com'),
  title: {
    default: siteTitle,
    template: '%s | ' + profile.name,
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: siteTitle }],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable} ${ibmPlexSans.variable}`} suppressHydrationWarning>
      <body className="bg-ink-50 font-sans text-ink-950 antialiased dark:bg-ink-950 dark:text-ink-100">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Note: `metadataBase: new URL('https://your-domain-here.com')` is a pre-existing placeholder unrelated to this task — leave it exactly as-is.

- [ ] **Step 3: Build and verify**

Run: `npm run build`
Expected: build succeeds with no type errors. (Navbar/Footer/other components still reference old `slate-`/`violet-`/`cyan-` classes at this point — that's expected and fixed in later tasks. This step only confirms the new theme/font setup itself compiles.)

- [ ] **Step 4: Run tests**

Run: `npx vitest run`
Expected: all existing tests still pass (this task touches no logic).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add ink/ember design tokens and IBM Plex typography"
```

---

### Task 2: Site chrome — navbar, mobile menu, theme toggle, footer, social links

**Files:**
- Modify: `components/Navbar.tsx`
- Modify: `components/MobileMenu.tsx`
- Modify: `components/ThemeToggle.tsx`
- Modify: `components/Footer.tsx`
- Modify: `components/SocialLinks.tsx`

**Interfaces:**
- Consumes: `ink`/`ember` tokens and `font-display` from Task 1.
- Produces: no new exports or prop changes — same component signatures as before.

- [ ] **Step 1: Replace `components/Navbar.tsx`**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import { NAV_LINKS } from './navLinks';
import { profile } from '@/data/profile';

const normalize = (p: string) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p);

export default function Navbar() {
  const pathname = usePathname();
  const currentPath = normalize(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-ink-50 dark:border-ink-700 dark:bg-ink-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold text-ink-950 dark:text-ink-100">
          {profile.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-display text-sm font-medium transition hover:text-ember-600 dark:hover:text-ember-400 ${
                  isActive ? 'text-ember-600 dark:text-ember-400' : 'text-ink-600 dark:text-ink-400'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600 dark:text-ink-400 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
```

- [ ] **Step 2: Replace `components/MobileMenu.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { NAV_LINKS } from './navLinks';

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col bg-ink-50 p-6 dark:bg-ink-950 md:hidden"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600 dark:text-ink-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="font-display text-2xl font-semibold text-ink-950 dark:text-ink-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 3: Replace `components/ThemeToggle.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600 transition hover:bg-ink-200/60 dark:text-ink-400 dark:hover:bg-white/10"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
```

- [ ] **Step 4: Replace `components/Footer.tsx`**

```tsx
import Link from 'next/link';
import SocialLinks from './SocialLinks';
import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 py-10 dark:border-ink-700">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-sm text-ink-600 dark:text-ink-400">
        <SocialLinks />
        <Link href="/contact" className="hover:text-ember-600 dark:hover:text-ember-400">
          Contact
        </Link>
        <p>
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 5: Replace `components/SocialLinks.tsx`**

```tsx
import { Mail } from 'lucide-react';
import { profile } from '@/data/profile';
import { GithubIcon, LinkedinIcon } from './icons';

const linkClassName =
  'flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition hover:border-ember-600 hover:text-ember-600 dark:border-ink-700 dark:text-ink-400 dark:hover:border-ember-400 dark:hover:text-ember-400';

export default function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`}>
      <a
        href={profile.social.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className={linkClassName}
      >
        <GithubIcon />
      </a>
      <a
        href={profile.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className={linkClassName}
      >
        <LinkedinIcon />
      </a>
      <a
        href={`mailto:${profile.social.email}`}
        aria-label="Email"
        className={linkClassName}
      >
        <Mail className="h-5 w-5" />
      </a>
    </div>
  );
}
```

- [ ] **Step 6: Build and verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Run tests**

Run: `npx vitest run`
Expected: all tests pass, including `components/Navbar.test.tsx` (behavioral test — active-link logic unchanged).

- [ ] **Step 8: Commit**

```bash
git add components/Navbar.tsx components/MobileMenu.tsx components/ThemeToggle.tsx components/Footer.tsx components/SocialLinks.tsx
git commit -m "feat: restyle site chrome with ink/ember tokens"
```

---

### Task 3: Shared card and button components

**Files:**
- Modify: `components/ProjectCard.tsx`
- Modify: `components/BlogCard.tsx`
- Modify: `components/ResumeButton.tsx`

**Interfaces:**
- Consumes: `ink`/`ember` tokens from Task 1. Consumes `Project` type from `data/projects.ts` (unchanged) and `BlogPost` type from `lib/markdown.ts` (unchanged).
- Produces: no new exports or prop changes.

- [ ] **Step 1: Replace `components/ProjectCard.tsx`**

```tsx
import Link from 'next/link';
import type { Project } from '@/data/projects';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-md border border-ink-200 bg-white p-5 transition hover:border-ember-600 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-ember-400"
    >
      <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-ink-100">{project.title}</h3>
      <p className="mt-2 text-sm text-ink-600 dark:text-ink-400">{project.shortDescription}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-ink-100 px-3 py-1 font-display text-xs font-medium text-ember-600 dark:bg-ink-800 dark:text-ember-400"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Replace `components/BlogCard.tsx`**

```tsx
import Link from 'next/link';
import type { BlogPost } from '@/lib/markdown';
import { formatDate } from '@/lib/formatDate';

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block rounded-md border border-ink-200 bg-white p-6 transition hover:border-ember-600 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-ember-400"
    >
      <div className="flex flex-wrap items-center gap-3 text-xs text-ink-600 dark:text-ink-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">&middot;</span>
        <span>{post.readingTime}</span>
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold text-ink-950 dark:text-ink-100">{post.title}</h3>
      <p className="mt-2 text-sm text-ink-600 dark:text-ink-400">{post.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-ink-100 px-3 py-1 font-display text-xs font-medium text-ember-600 dark:bg-ink-800 dark:text-ember-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Replace `components/ResumeButton.tsx`**

```tsx
import { Download } from 'lucide-react';
import { profile } from '@/data/profile';

export default function ResumeButton({ className }: { className?: string }) {
  return (
    <a
      href={profile.resumeUrl}
      download
      className={`inline-flex items-center gap-2 rounded-md bg-ember-600 px-6 py-3 font-display font-semibold text-white transition hover:opacity-90 dark:bg-ember-400 dark:text-ink-950 ${className ?? ''}`}
    >
      <Download className="h-4 w-4" />
      Download Resume
    </a>
  );
}
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Run tests**

Run: `npx vitest run`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/ProjectCard.tsx components/BlogCard.tsx components/ResumeButton.tsx
git commit -m "feat: restyle shared cards and resume button with ink/ember tokens"
```

---

### Task 4: Homepage and project pages

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/projects/page.tsx`
- Modify: `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `ink`/`ember` tokens from Task 1, restyled `ProjectCard` from Task 3.
- Produces: no new exports.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { profile } from '@/data/profile';
import { getFeaturedProjects } from '@/data/projects';
import AnimatedSection from '@/components/AnimatedSection';
import ProjectCard from '@/components/ProjectCard';

export const metadata: Metadata = {
  title: 'Home',
  description: profile.tagline,
  openGraph: {
    title: 'Home',
    description: profile.tagline,
  },
};

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center sm:pt-32">
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-ember-600 dark:text-ember-400">
          {profile.title}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink-950 dark:text-ink-100 sm:text-6xl">
          {profile.name}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-600 dark:text-ink-400">{profile.intro}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/projects"
            className="rounded-md bg-ember-600 px-8 py-3 font-display font-semibold text-white transition hover:opacity-90 dark:bg-ember-400 dark:text-ink-950"
          >
            View Projects
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-ink-200 px-8 py-3 font-display font-semibold text-ink-700 transition hover:border-ember-600 hover:text-ember-600 dark:border-ink-700 dark:text-ink-200 dark:hover:border-ember-400 dark:hover:text-ember-400"
          >
            About & Resume
          </Link>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-100 sm:text-3xl">
            Featured Projects
          </h2>
          <Link href="/projects" className="font-display text-sm font-semibold text-ember-600 dark:text-ember-400">
            View all &rarr;
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}
```

- [ ] **Step 2: Replace `app/projects/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A selection of projects — replace with your real project portfolio.',
  openGraph: {
    title: 'Projects',
    description: 'A selection of projects — replace with your real project portfolio.',
  },
};

export default function ProjectsPage() {
  return (
    <AnimatedSection className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-ink-100 sm:text-4xl">Projects</h1>
      <p className="mt-3 max-w-2xl text-ink-600 dark:text-ink-400">
        A selection of web and cross-platform mobile apps I've built and shipped, from e-commerce sites to published Flutter apps.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 3: Replace `app/projects/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { projects, getProjectBySlug } from '@/data/projects';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-6 py-20">
      <Link href="/projects" className="font-display text-sm font-semibold text-ember-600 dark:text-ember-400">
        &larr; All projects
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink-950 dark:text-ink-100 sm:text-4xl">
        {project.title}
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-ink-100 px-3 py-1 font-display text-xs font-medium text-ember-600 dark:bg-ink-800 dark:text-ember-400"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-ember-600 px-6 py-3 font-display font-semibold text-white transition hover:opacity-90 dark:bg-ember-400 dark:text-ink-950"
          >
            <ExternalLink className="h-4 w-4" /> Live Demo
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-ink-200 px-6 py-3 font-display font-semibold text-ink-700 transition hover:border-ember-600 hover:text-ember-600 dark:border-ink-700 dark:text-ink-200 dark:hover:border-ember-400 dark:hover:text-ember-400"
          >
            <GithubIcon /> GitHub
          </a>
        )}
      </div>

      <div className="prose prose-slate mt-10 max-w-none dark:prose-invert">
        {project.longDescription.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
```

Note: `prose prose-slate dark:prose-invert` is intentionally left unchanged — Tailwind Typography doesn't ship an "ink" prose variant, and building a custom prose theme is out of scope for this plan (moderate-effort constraint from the spec). `prose-slate`'s gray tones read as consistent enough alongside the new `ink` palette since both are desaturated gray-blues.

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: build succeeds, all project detail pages still statically generate (`/projects/kinkhel`, `/projects/samd-edu-np`, etc.).

- [ ] **Step 5: Run tests**

Run: `npx vitest run`
Expected: all tests pass, including `data/projects.test.ts`.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx "app/projects/page.tsx" "app/projects/[slug]/page.tsx"
git commit -m "feat: restyle homepage and project pages with ink/ember tokens"
```

---

### Task 5: Blog pages, about/contact pages, timeline, 404 page

**Files:**
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/about/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `components/TimelineItem.tsx`
- Modify: `app/not-found.tsx`

**Interfaces:**
- Consumes: `ink`/`ember` tokens from Task 1, restyled `BlogCard` and `ResumeButton` from Task 3.
- Produces: no new exports. `TimelineItem`'s internal `KIND_COLOR` map is renamed `KIND_DOT` with new values — this is a local, unexported implementation detail with no external consumers, so the rename is safe.

- [ ] **Step 1: Replace `app/blog/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing on software engineering — replace with your real posts.',
  openGraph: {
    title: 'Blog',
    description: 'Writing on software engineering — replace with your real posts.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <AnimatedSection className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-ink-100 sm:text-4xl">Blog</h1>
      <p className="mt-3 text-ink-600 dark:text-ink-400">
        Placeholder intro copy for the blog page — replace with a real summary of what you write about.
      </p>
      <div className="mt-10 flex flex-col gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </AnimatedSection>
  );
}
```

- [ ] **Step 2: Replace `app/blog/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { formatDate } from '@/lib/formatDate';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: { title: post.title, description: post.excerpt },
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blog" className="font-display text-sm font-semibold text-ember-600 dark:text-ember-400">
        &larr; All posts
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-ink-950 dark:text-ink-100 sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-ink-600 dark:text-ink-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">&middot;</span>
        <span>{post.readingTime}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-ink-100 px-3 py-1 font-display text-xs font-medium text-ember-600 dark:bg-ink-800 dark:text-ember-400"
          >
            {tag}
          </span>
        ))}
      </div>
      <div
        className="prose prose-slate mt-10 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
```

- [ ] **Step 3: Replace `app/about/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import { timeline } from '@/data/timeline';
import TimelineItem from '@/components/TimelineItem';
import ResumeButton from '@/components/ResumeButton';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${profile.name} — background, experience, and education.`,
  openGraph: {
    title: 'About',
    description: `About ${profile.name} — background, experience, and education.`,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-ink-100 sm:text-4xl">About</h1>
      <div className="mt-6 space-y-4 text-ink-600 dark:text-ink-400">
        {profile.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <ResumeButton className="mt-8" />

      <AnimatedSection className="mt-16">
        <h2 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-100">Experience & Education</h2>
        <div className="mt-8">
          {timeline.map((entry, i) => (
            <TimelineItem key={i} entry={entry} />
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
```

- [ ] **Step 4: Replace `app/contact/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import SocialLinks from '@/components/SocialLinks';
import ResumeButton from '@/components/ResumeButton';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${profile.name}.`,
  openGraph: {
    title: 'Contact',
    description: `Get in touch with ${profile.name}.`,
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-ink-100 sm:text-4xl">Get in Touch</h1>
      <p className="mt-4 text-ink-600 dark:text-ink-400">
        Whether it's a role, a project, or just a question — email or LinkedIn is the fastest way to reach me.
      </p>
      <div className="mt-8">
        <SocialLinks />
      </div>
      <ResumeButton className="mt-8" />
    </div>
  );
}
```

- [ ] **Step 5: Replace `components/TimelineItem.tsx`**

The three entry kinds (`job`, `education`, `achievement`) previously used three different hues (violet/cyan/fuchsia) to distinguish themselves — that rainbow-of-hues pattern is itself part of what the redesign is moving away from. Replaced with one accent (`ember`) differentiated by fill vs. outline, plus a neutral `ink` tone for the least-emphasized kind:

```tsx
import type { TimelineEntry } from '@/data/timeline';

const KIND_LABEL: Record<TimelineEntry['kind'], string> = {
  job: 'Job',
  education: 'Education',
  achievement: 'Achievement',
};

const KIND_DOT: Record<TimelineEntry['kind'], string> = {
  job: 'bg-ember-600 dark:bg-ember-400',
  education: 'border-2 border-ember-600 dark:border-ember-400',
  achievement: 'bg-ink-600 dark:bg-ink-400',
};

export default function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative border-l-2 border-ink-200 pb-10 pl-8 last:pb-0 dark:border-ink-700">
      <span
        className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full ${KIND_DOT[entry.kind]}`}
        aria-hidden="true"
      />
      <span className="font-display text-xs font-semibold uppercase tracking-wide text-ink-600 dark:text-ink-400">
        {KIND_LABEL[entry.kind]} &middot; {entry.dateRange}
      </span>
      <h3 className="mt-1 font-display text-lg font-semibold text-ink-950 dark:text-ink-100">{entry.title}</h3>
      <p className="text-sm font-medium text-ember-600 dark:text-ember-400">{entry.organization}</p>
      <p className="mt-2 text-sm text-ink-600 dark:text-ink-400">{entry.description}</p>
    </div>
  );
}
```

- [ ] **Step 6: Replace `app/not-found.tsx`**

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-4xl font-bold text-ink-950 dark:text-ink-100">Page not found</h1>
      <p className="mt-4 text-ink-600 dark:text-ink-400">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-md bg-ember-600 px-6 py-3 font-display font-semibold text-white transition hover:opacity-90 dark:bg-ember-400 dark:text-ink-950"
      >
        Back to home
      </Link>
    </div>
  );
}
```

- [ ] **Step 7: Build and verify**

Run: `npm run build`
Expected: build succeeds, blog and about/contact pages statically generate correctly.

- [ ] **Step 8: Run tests**

Run: `npx vitest run`
Expected: all tests pass, including `lib/posts.test.ts`.

- [ ] **Step 9: Commit**

```bash
git add "app/blog/page.tsx" "app/blog/[slug]/page.tsx" app/about/page.tsx app/contact/page.tsx components/TimelineItem.tsx app/not-found.tsx
git commit -m "feat: restyle blog, about, contact, timeline, and 404 pages"
```

---

### Task 6: Admin editor components

**Files:**
- Modify: `components/admin/TokenGate.tsx`
- Modify: `components/admin/PostList.tsx`
- Modify: `components/admin/PostEditor.tsx`

**Interfaces:**
- Consumes: `ink`/`ember` tokens from Task 1. Consumes existing exports from `lib/github.ts` (`listPosts`, `getPost`, `deletePost`, `savePost`, `GithubApiError`, `GithubFile`) and `lib/renderMarkdown.ts` (`renderMarkdown`) — none of these change.
- Produces: no new exports, no prop/behavior changes — `onInvalidToken`, `onEdit`, `onNew`, `onDone` signatures are all unchanged from the existing implementation.

- [ ] **Step 1: Replace `components/admin/TokenGate.tsx`**

```tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';

const TOKEN_STORAGE_KEY = 'admin-github-token';

export default function TokenGate({
  children,
}: {
  children: (token: string, onInvalidToken: () => void) => ReactNode;
}) {
  const [token, setToken] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setToken(window.localStorage.getItem(TOKEN_STORAGE_KEY));
    setMounted(true);
  }, []);

  function clearToken() {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
  }

  if (!mounted) {
    return null;
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <h1 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-100">Admin Login</h1>
        <p className="mt-3 text-sm text-ink-600 dark:text-ink-400">
          Enter a GitHub personal access token with Contents read/write access to{' '}
          <code className="rounded-md bg-ink-100 px-1 py-0.5 text-xs dark:bg-ink-800">SamanKC/samankc.com</code>.
          Use a fine-grained token scoped to just this repository — it&apos;s stored only in this browser.
        </p>
        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            window.localStorage.setItem(TOKEN_STORAGE_KEY, input.trim());
            setToken(input.trim());
          }}
        >
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="github_pat_..."
            className="rounded-md border border-ink-200 bg-white px-4 py-2 text-ink-950 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          />
          <button
            type="submit"
            className="rounded-md bg-ember-600 px-6 py-2 font-display font-semibold text-white transition hover:opacity-90 dark:bg-ember-400 dark:text-ink-950"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end px-6 pt-4">
        <button
          type="button"
          onClick={clearToken}
          className="font-display text-xs text-ink-600 hover:text-ember-600 dark:text-ink-400 dark:hover:text-ember-400"
        >
          Forget token
        </button>
      </div>
      {children(token, clearToken)}
    </div>
  );
}
```

- [ ] **Step 2: Replace `components/admin/PostList.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import matter from 'gray-matter';
import { listPosts, getPost, deletePost, GithubApiError, type GithubFile } from '@/lib/github';

type PostSummary = {
  filename: string;
  sha: string;
  title: string;
  date: string;
};

export default function PostList({
  token,
  onEdit,
  onNew,
  onInvalidToken,
}: {
  token: string;
  onEdit: (filename: string) => void;
  onNew: () => void;
  onInvalidToken: () => void;
}) {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);

  async function loadPosts() {
    setError(null);
    setIsAuthError(false);
    try {
      const files: GithubFile[] = await listPosts(token);
      const summaries = await Promise.all(
        files.map(async (file) => {
          const { content } = await getPost(token, file.name);
          const { data } = matter(content);
          return {
            filename: file.name,
            sha: file.sha,
            title: (data.title as string) ?? file.name,
            date: (data.date as string) ?? '',
          };
        })
      );
      summaries.sort((a, b) => (a.date < b.date ? 1 : -1));
      setPosts(summaries);
    } catch (err) {
      if (err instanceof GithubApiError && (err.status === 401 || err.status === 403)) {
        setIsAuthError(true);
        setError("Your token isn't valid or has expired — click below to re-enter it.");
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load posts.');
      }
    }
  }

  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleDelete(post: PostSummary) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await deletePost(token, post.filename, post.sha);
      await loadPosts();
    } catch (err) {
      if (err instanceof GithubApiError && (err.status === 401 || err.status === 403)) {
        setIsAuthError(true);
        setError("Your token isn't valid or has expired — click below to re-enter it.");
      } else {
        setError(err instanceof Error ? err.message : 'Failed to delete post.');
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-100">Blog Posts</h1>
        <button
          type="button"
          onClick={onNew}
          className="rounded-md bg-ember-600 px-5 py-2 text-sm font-display font-semibold text-white transition hover:opacity-90 dark:bg-ember-400 dark:text-ink-950"
        >
          New Post
        </button>
      </div>

      {error && (
        <div className="mt-4">
          <p className="text-sm text-red-500">{error}</p>
          {isAuthError && (
            <button
              type="button"
              onClick={onInvalidToken}
              className="mt-2 font-display text-sm font-semibold text-ember-600 dark:text-ember-400"
            >
              Re-enter token
            </button>
          )}
        </div>
      )}

      {!posts && !error && <p className="mt-6 text-ink-600 dark:text-ink-400">Loading posts…</p>}

      {posts && (
        <ul className="mt-6 divide-y divide-ink-200 dark:divide-ink-700">
          {posts.map((post) => (
            <li key={post.filename} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-ink-950 dark:text-ink-100">{post.title}</p>
                <p className="text-sm text-ink-600 dark:text-ink-400">{post.date}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(post.filename)}
                  className="font-display text-sm font-semibold text-ember-600 dark:text-ember-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post)}
                  className="font-display text-sm font-semibold text-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Replace `components/admin/PostEditor.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import matter from 'gray-matter';
import { getPost, savePost, GithubApiError } from '@/lib/github';
import { renderMarkdown } from '@/lib/renderMarkdown';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function PostEditor({
  token,
  filename,
  onDone,
  onInvalidToken,
}: {
  token: string;
  filename: string | null;
  onDone: () => void;
  onInvalidToken: () => void;
}) {
  const isNew = filename === null;
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [body, setBody] = useState('');
  const [sha, setSha] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthError, setIsAuthError] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (isNew || !filename) return;
    (async () => {
      try {
        const { content, sha: fileSha } = await getPost(token, filename);
        const { data, content: markdownBody } = matter(content);
        setSlug(filename.replace(/\.md$/, ''));
        setTitle((data.title as string) ?? '');
        setDate((data.date as string) ?? '');
        setExcerpt((data.excerpt as string) ?? '');
        setTags(((data.tags as string[]) ?? []).join(', '));
        setBody(markdownBody.trim());
        setSha(fileSha);
      } catch (err) {
        if (err instanceof GithubApiError && (err.status === 401 || err.status === 403)) {
          setIsAuthError(true);
          setError("Your token isn't valid or has expired — click below to re-enter it.");
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load post.');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [isNew, filename, token]);

  useEffect(() => {
    if (isNew) setSlug(slugify(title));
  }, [isNew, title]);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const frontmatter = matter.stringify(body, {
        title,
        date,
        excerpt,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      await savePost(token, `${slug}.md`, frontmatter, sha);
      setDirty(false);
      onDone();
    } catch (err) {
      if (err instanceof GithubApiError && (err.status === 401 || err.status === 403)) {
        setIsAuthError(true);
        setError("Your token isn't valid or has expired — click below to re-enter it.");
      } else {
        setError(err instanceof Error ? err.message : 'Failed to save post.');
      }
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    if (dirty && !window.confirm('Discard unsaved changes?')) return;
    onDone();
  }

  if (loading) {
    return <p className="mx-auto max-w-5xl px-6 py-12 text-ink-600 dark:text-ink-400">Loading post…</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <button type="button" onClick={handleBack} className="font-display text-sm font-semibold text-ember-600 dark:text-ember-400">
        &larr; Back to posts
      </button>
      <h1 className="mt-4 font-display text-2xl font-bold text-ink-950 dark:text-ink-100">
        {isNew ? 'New Post' : 'Edit Post'}
      </h1>

      {error && (
        <div className="mt-4">
          <p className="text-sm text-red-500">{error}</p>
          {isAuthError && (
            <button
              type="button"
              onClick={onInvalidToken}
              className="mt-2 font-display text-sm font-semibold text-ember-600 dark:text-ember-400"
            >
              Re-enter token
            </button>
          )}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-ink-600 dark:text-ink-400">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-ink-950 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-600 dark:text-ink-400">
          Slug
          <input
            type="text"
            value={slug}
            disabled={!isNew}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-ink-950 disabled:opacity-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-600 dark:text-ink-400">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setDirty(true);
            }}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-ink-950 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-600 dark:text-ink-400">
          Tags (comma-separated)
          <input
            type="text"
            value={tags}
            onChange={(e) => {
              setTags(e.target.value);
              setDirty(true);
            }}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-ink-950 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-ink-600 dark:text-ink-400 sm:col-span-2">
          Excerpt
          <input
            type="text"
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
              setDirty(true);
            }}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 text-ink-950 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          />
        </label>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-ink-600 dark:text-ink-400">
          Body (Markdown)
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setDirty(true);
            }}
            rows={20}
            className="rounded-md border border-ink-200 bg-white px-3 py-2 font-mono text-sm text-ink-950 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100"
          />
        </label>
        <div className="flex flex-col gap-1 text-sm text-ink-600 dark:text-ink-400">
          Preview
          <div
            className="prose prose-slate max-w-none rounded-md border border-ink-200 bg-white px-4 py-3 dark:prose-invert dark:border-ink-700 dark:bg-ink-900"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !title || !slug}
        className="mt-6 rounded-md bg-ember-600 px-6 py-2 font-display font-semibold text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-ember-400 dark:text-ink-950"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}
```

- [ ] **Step 4: Build and verify**

Run: `npm run build`
Expected: build succeeds, `/admin` route still statically generates.

- [ ] **Step 5: Run tests**

Run: `npx vitest run`
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/admin/TokenGate.tsx components/admin/PostList.tsx components/admin/PostEditor.tsx
git commit -m "feat: restyle admin editor with ink/ember tokens"
```

---

### Task 7: Whole-site verification sweep

**Files:**
- None modified (verification-only task). If the grep in Step 1 finds any leftover reference, fix it in the relevant file before proceeding.

**Interfaces:**
- Consumes: the completed state of Tasks 1-6.
- Produces: nothing — this is the final gate before considering the redesign complete.

- [ ] **Step 1: Grep for leftover old classes**

Run:
```bash
grep -rn "slate-\|violet-\|cyan-\|fuchsia-\|Inter\|Space_Grotesk\|gradient-to-r" app components --include="*.tsx" --include="*.ts" --include="*.css" | grep -v node_modules | grep -v ".test."
```

Expected: no matches except the two intentionally-unchanged `prose prose-slate dark:prose-invert` occurrences (in `app/projects/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, and `components/admin/PostEditor.tsx` — three occurrences total). If anything else appears, fix that file to use `ink`/`ember` tokens per the patterns established in Tasks 1-6, then re-run this grep until only the expected `prose-slate` matches remain.

- [ ] **Step 2: Grep for remaining `rounded-full` usage and confirm each is a legitimate circular icon button**

Run:
```bash
grep -rn "rounded-full" app components --include="*.tsx" | grep -v node_modules | grep -v ".test."
```

Expected matches: only circular icon-button contexts — `components/SocialLinks.tsx` (social icon circles), the mobile-menu-open button and theme-toggle button in `components/Navbar.tsx`/`components/ThemeToggle.tsx`/`components/MobileMenu.tsx` (all `h-9 w-9`/`h-11 w-11` icon buttons), and the timeline dot in `components/TimelineItem.tsx`. No `rounded-full` should remain on any CTA button, project/blog card, or tag/badge. If a non-icon-button match appears, fix it to `rounded-md`.

- [ ] **Step 3: Full build**

Run: `npm run build`
Expected: succeeds with no errors, all routes generate.

- [ ] **Step 4: Full test suite**

Run: `npx vitest run`
Expected: all tests pass, same count as before this plan started (no test file should have been modified by this plan).

- [ ] **Step 5: Manual rendered-HTML spot check (no browser tooling available)**

Run:
```bash
npm run dev &
sleep 4
curl -s http://localhost:3000/ | grep -o "ember-600\|ember-400\|ink-950\|ink-100" | sort -u
curl -s http://localhost:3000/ | grep -c "violet-\|cyan-"
kill %1
```

Expected: the first command lists at least `ember-600`/`ink-950` (confirming the new classes are actually present in rendered output, not just in source), and the second command outputs `0`.

- [ ] **Step 6: Commit (only if Step 1 or 2 required fixes; otherwise skip — nothing to commit)**

```bash
git add -A
git commit -m "fix: address leftover old-palette references found in verification sweep"
```
