# Personal Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first version of a personal portfolio website (Home, Projects, Blog, About/Resume, Contact) as a statically-exported Next.js site, fully populated with clearly-labeled placeholder content, ready for the owner to swap in real content and upload `out/` to Hostinger.

**Architecture:** Next.js App Router + TypeScript + Tailwind CSS, `output: 'export'`. All content is either typed data objects in `data/*.ts` or Markdown files in `content/blog/*.md` parsed at build time — no client-side fetching, no CMS, no database. Dark-mode-by-default theming via `next-themes`, scroll animations via Framer Motion, small pure/data-loading functions covered by Vitest + React Testing Library; presentational components verified manually via the dev server.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, next-themes, lucide-react, gray-matter, unified/remark-parse/remark-html, Vitest, @testing-library/react.

## Global Constraints

- Static export only: `next.config.js` must set `output: 'export'` and `images: { unoptimized: true }`; nothing in the app may depend on a Node.js server at runtime.
- Dark mode is the default theme; the toggle must persist the user's choice across reloads (localStorage, via next-themes).
- All animations must respect `prefers-reduced-motion` (Framer Motion's `useReducedMotion`).
- No invented final content: every piece of copy (name, bio, jobs, education, achievements, project details, blog posts) is obvious placeholder text, centralized in `data/profile.ts`, `data/projects.ts`, `data/timeline.ts`, and `content/blog/*.md` so it's easy to find and replace later.
- npm is the package manager; `npm run build` must produce a static `out/` folder with no errors.
- Responsive with no horizontal scroll or overlap at 375px, 768px, 1024px, 1440px+; nav collapses to a hamburger + mobile menu below the `md` breakpoint.
- Every page exports SEO metadata (title, description, Open Graph tags) via the Next Metadata API.
- Accessibility basics: semantic landmarks, alt text placeholders on all images, keyboard-navigable nav/menu/toggle, sufficient contrast in both themes.

---

## Shared Types Reference

These types are defined in Task 4/5 and consumed by nearly every later task. Listed here up front so every task's implementer has them without cross-referencing.

```ts
// lib/markdown.ts
type BlogPost = {
  slug: string;
  title: string;
  date: string;        // "YYYY-MM-DD"
  excerpt: string;
  tags: string[];
  readingTime: string; // e.g. "3 min read"
  contentHtml: string;
};

// data/projects.ts
type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string; // multi-paragraph, joined with \n\n
  techStack: string[];
  thumbnail: string;
  gallery: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
};

// data/timeline.ts
type TimelineEntry = {
  kind: 'job' | 'education' | 'achievement';
  title: string;
  organization: string;
  dateRange: string;
  description: string;
};

// data/profile.ts
type Profile = {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  bio: string[];
  social: { github: string; linkedin: string; email: string };
  resumeUrl: string;
};
```

---

### Task 1: Project scaffold, static export config, and test tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next-env.d.ts`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore`
- Create: `app/layout.tsx` (minimal placeholder, replaced in Task 2), `app/page.tsx` (minimal placeholder, replaced in Task 9), `app/globals.css`
- Test: `tests/smoke.test.ts`

**Interfaces:**
- Produces: a working `npm run dev` / `npm run build` / `npm test` toolchain that every later task builds on.

- [ ] **Step 1: Write minimal `package.json`**

```json
{
  "name": "personal-website",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "vitest run"
  }
}
```

- [ ] **Step 2: Install runtime dependencies**

Run: `npm install next react react-dom framer-motion next-themes lucide-react gray-matter unified remark-parse remark-html`

- [ ] **Step 3: Install dev dependencies**

Run: `npm install -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Write `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 6: Write `next.config.js`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
```

- [ ] **Step 7: Write `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 8: Write `postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 9: Write `vitest.config.ts` and `vitest.setup.ts`**

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
});
```

```ts
// vitest.setup.ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 10: Write `.gitignore`**

```
node_modules
.next
out
*.log
.DS_Store
```

- [ ] **Step 11: Write minimal `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
```

- [ ] **Step 12: Write minimal `app/layout.tsx` and `app/page.tsx`**

```tsx
// app/layout.tsx
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx
export default function Home() {
  return <main>Hello</main>;
}
```

- [ ] **Step 13: Write smoke test**

```ts
// tests/smoke.test.ts
import { describe, it, expect } from 'vitest';

describe('toolchain smoke test', () => {
  it('runs', () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 14: Verify build**

Run: `npm run build`
Expected: succeeds, creates `out/index.html`.

- [ ] **Step 15: Verify tests**

Run: `npm test`
Expected: 1 passed test.

- [ ] **Step 16: Commit**

```bash
git add package.json package-lock.json tsconfig.json next-env.d.ts next.config.js tailwind.config.ts postcss.config.js vitest.config.ts vitest.setup.ts .gitignore app tests
git commit -m "chore: scaffold Next.js static-export project with test tooling"
```

---

### Task 2: Root layout, theming, fonts, favicon, default SEO metadata

**Files:**
- Create: `components/ThemeProvider.tsx`, `components/ThemeToggle.tsx`, `components/ThemeToggle.test.tsx`, `app/icon.svg`, `public/og-image.svg`
- Modify: `app/layout.tsx`, `app/globals.css`
- Create: `app/not-found.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `<ThemeProvider>` wrapper (client component) used once in `app/layout.tsx`; `<ThemeToggle />` component reused by Navbar (Task 6); default page metadata and fonts (`--font-inter`, `--font-space-grotesk` CSS variables) available to every page.

- [ ] **Step 1: Write `components/ThemeProvider.tsx`**

```tsx
'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
```

- [ ] **Step 2: Write failing test for `ThemeToggle`**

```tsx
// components/ThemeToggle.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ThemeProvider from './ThemeProvider';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  it('toggles the html class between dark and light on click', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = await screen.findByRole('button', { name: /switch to light mode/i });
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(button);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- ThemeToggle`
Expected: FAIL — `components/ThemeToggle.tsx` does not exist.

- [ ] **Step 4: Write `components/ThemeToggle.tsx`**

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
      className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-white/10"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- ThemeToggle`
Expected: PASS

- [ ] **Step 6: Write favicon (`app/icon.svg`)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#22d3ee" />
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)" />
  <text x="32" y="42" font-family="sans-serif" font-size="26" font-weight="700" fill="white" text-anchor="middle">YN</text>
</svg>
```

- [ ] **Step 7: Write OG image placeholder (`public/og-image.svg`)**

> Note: replace this with a real 1200x630 PNG/JPG later — some social platforms don't render SVG `og:image` previews.

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#312e81" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <text x="80" y="300" font-family="sans-serif" font-size="64" font-weight="700" fill="white">Your Name Here</text>
  <text x="80" y="370" font-family="sans-serif" font-size="34" fill="#a5b4fc">Software Engineer — Portfolio</text>
</svg>
```

- [ ] **Step 8: Write `app/not-found.tsx`**

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 font-semibold text-white transition hover:opacity-90"
      >
        Back to home
      </Link>
    </main>
  );
}
```

- [ ] **Step 9: Rewrite `app/layout.tsx` with fonts, theming, and default metadata**

```tsx
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: {
    default: 'Your Name Here — Software Engineer',
    template: '%s | Your Name Here',
  },
  description: 'Portfolio of Your Name Here — software engineer. Projects, writing, and background.',
  openGraph: {
    title: 'Your Name Here — Software Engineer',
    description: 'Portfolio of Your Name Here — software engineer. Projects, writing, and background.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Your Name Here — Software Engineer' }],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="bg-white font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 11: Commit**

```bash
git add components app/layout.tsx app/not-found.tsx app/icon.svg app/globals.css public/og-image.svg
git commit -m "feat: root layout, dark-mode theming, favicon, and default SEO metadata"
```

---

### Task 3: Markdown parsing (pure function) with unit tests

**Files:**
- Create: `lib/markdown.ts`, `lib/markdown.test.ts`

**Interfaces:**
- Produces: `parsePost(raw: string, slug: string): BlogPost` — pure function, no filesystem access. Consumed by Task 4's `getAllPosts`/`getPostBySlug`.

- [ ] **Step 1: Write failing tests**

```ts
// lib/markdown.test.ts
import { describe, it, expect } from 'vitest';
import { parsePost } from './markdown';

const RAW = `---
title: "Test Post"
date: "2024-01-15"
excerpt: "A short excerpt."
tags: ["testing", "markdown"]
---

# Heading

Some **content** here.
`;

describe('parsePost', () => {
  it('extracts frontmatter fields', () => {
    const post = parsePost(RAW, 'test-post');
    expect(post.slug).toBe('test-post');
    expect(post.title).toBe('Test Post');
    expect(post.date).toBe('2024-01-15');
    expect(post.excerpt).toBe('A short excerpt.');
    expect(post.tags).toEqual(['testing', 'markdown']);
  });

  it('renders the markdown body to HTML', () => {
    const post = parsePost(RAW, 'test-post');
    expect(post.contentHtml).toContain('<h1>Heading</h1>');
    expect(post.contentHtml).toContain('<strong>content</strong>');
  });

  it('computes a minimum reading time of 1 minute for short posts', () => {
    const post = parsePost(RAW, 'test-post');
    expect(post.readingTime).toBe('1 min read');
  });

  it('rounds up reading time for longer posts', () => {
    const longBody = `---
title: "Long Post"
date: "2024-01-15"
excerpt: "Long."
tags: []
---

${'word '.repeat(450)}`;
    const post = parsePost(longBody, 'long-post');
    expect(post.readingTime).toBe('2 min read');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- markdown`
Expected: FAIL — `lib/markdown.ts` does not exist.

- [ ] **Step 3: Write `lib/markdown.ts`**

```ts
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  contentHtml: string;
};

const WORDS_PER_MINUTE = 200;

function computeReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

export function parsePost(raw: string, slug: string): BlogPost {
  const { data, content } = matter(raw);
  const contentHtml = unified().use(remarkParse).use(remarkHtml).processSync(content).toString();

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string,
    tags: (data.tags as string[]) ?? [],
    readingTime: computeReadingTime(content),
    contentHtml,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- markdown`
Expected: 4 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/markdown.ts lib/markdown.test.ts
git commit -m "feat: pure markdown post parser with reading-time calculation"
```

---

### Task 4: Blog post fixtures and filesystem loader

**Files:**
- Create: `content/blog/building-a-realtime-dashboard.md`
- Create: `content/blog/lessons-from-scaling-a-side-project.md`
- Create: `content/blog/why-type-safety-matters.md`
- Create: `content/blog/a-guide-to-static-site-deployment.md`
- Create: `lib/posts.ts`, `lib/posts.test.ts`

**Interfaces:**
- Consumes: `parsePost` from `lib/markdown.ts` (Task 3).
- Produces: `getAllPosts(): BlogPost[]` (sorted by date descending), `getPostBySlug(slug: string): BlogPost`. Consumed by Blog list/post pages (Task 11).

- [ ] **Step 1: Write the four placeholder posts**

```md
<!-- content/blog/building-a-realtime-dashboard.md -->
---
title: "Building a Realtime Analytics Dashboard"
date: "2026-06-15"
excerpt: "Placeholder excerpt — replace with a real summary of this post once written."
tags: ["engineering", "react"]
---

This is placeholder body copy for a blog post about building a realtime analytics dashboard. Replace this paragraph with a real introduction once the post is written.

A second placeholder paragraph goes here, describing the problem being solved and why it mattered enough to write about.

A third placeholder paragraph can cover the approach taken, the tools involved, and any interesting tradeoffs made along the way.

A closing placeholder paragraph wraps up the takeaways and what's next.
```

```md
<!-- content/blog/lessons-from-scaling-a-side-project.md -->
---
title: "Lessons From Scaling a Side Project"
date: "2026-05-02"
excerpt: "Placeholder excerpt — replace with a real summary of this post once written."
tags: ["career", "side-projects"]
---

This is placeholder body copy for a blog post about scaling a side project. Replace this paragraph with a real introduction once the post is written.

A second placeholder paragraph goes here, describing the problem being solved and why it mattered enough to write about.

A third placeholder paragraph can cover the approach taken, the tools involved, and any interesting tradeoffs made along the way.

A closing placeholder paragraph wraps up the takeaways and what's next.
```

```md
<!-- content/blog/why-type-safety-matters.md -->
---
title: "Why Type Safety Matters More Than You Think"
date: "2026-03-20"
excerpt: "Placeholder excerpt — replace with a real summary of this post once written."
tags: ["typescript", "engineering"]
---

This is placeholder body copy for a blog post about type safety. Replace this paragraph with a real introduction once the post is written.

A second placeholder paragraph goes here, describing the problem being solved and why it mattered enough to write about.

A third placeholder paragraph can cover the approach taken, the tools involved, and any interesting tradeoffs made along the way.

A closing placeholder paragraph wraps up the takeaways and what's next.
```

```md
<!-- content/blog/a-guide-to-static-site-deployment.md -->
---
title: "A Practical Guide to Static Site Deployment"
date: "2026-01-10"
excerpt: "Placeholder excerpt — replace with a real summary of this post once written."
tags: ["devops", "static-sites"]
---

This is placeholder body copy for a blog post about static site deployment. Replace this paragraph with a real introduction once the post is written.

A second placeholder paragraph goes here, describing the problem being solved and why it mattered enough to write about.

A third placeholder paragraph can cover the approach taken, the tools involved, and any interesting tradeoffs made along the way.

A closing placeholder paragraph wraps up the takeaways and what's next.
```

- [ ] **Step 2: Write failing test for the loader**

```ts
// lib/posts.test.ts
import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from './posts';

describe('getAllPosts', () => {
  it('reads all four placeholder posts', () => {
    const posts = getAllPosts();
    expect(posts).toHaveLength(4);
  });

  it('sorts posts by date descending', () => {
    const posts = getAllPosts();
    const dates = posts.map((p) => p.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });
});

describe('getPostBySlug', () => {
  it('returns the matching post', () => {
    const post = getPostBySlug('why-type-safety-matters');
    expect(post.title).toBe('Why Type Safety Matters More Than You Think');
    expect(post.tags).toEqual(['typescript', 'engineering']);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- posts`
Expected: FAIL — `lib/posts.ts` does not exist.

- [ ] **Step 4: Write `lib/posts.ts`**

```ts
import fs from 'node:fs';
import path from 'node:path';
import { parsePost, type BlogPost } from './markdown';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
    return parsePost(raw, slug);
  });
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.md`), 'utf-8');
  return parsePost(raw, slug);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- posts`
Expected: 3 passed.

- [ ] **Step 6: Commit**

```bash
git add content/blog lib/posts.ts lib/posts.test.ts
git commit -m "feat: placeholder blog posts and filesystem loader"
```

---

### Task 5: Profile, projects, and timeline data

**Files:**
- Create: `data/profile.ts`, `data/projects.ts`, `data/projects.test.ts`, `data/timeline.ts`

**Interfaces:**
- Produces: `profile: Profile`; `projects: Project[]`, `getProjectBySlug(slug: string): Project | undefined`, `getFeaturedProjects(): Project[]`; `timeline: TimelineEntry[]`. Consumed by Home, Projects, Blog-adjacent pages, About, Contact (Tasks 9–13).

- [ ] **Step 1: Write `data/profile.ts`**

```ts
export type Profile = {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  bio: string[];
  social: { github: string; linkedin: string; email: string };
  resumeUrl: string;
};

export const profile: Profile = {
  name: 'Your Name Here',
  title: 'Software Engineer',
  tagline: 'I build fast, thoughtful products for the web.',
  intro:
    'Placeholder intro — replace with a short, punchy summary of who you are and what you do.',
  bio: [
    'Placeholder bio paragraph one — replace with your real background, what got you into software, and what you care about as an engineer.',
    'Placeholder bio paragraph two — replace with more detail on your focus areas, the kinds of problems you like solving, and what you are doing now.',
  ],
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    email: 'you@example.com',
  },
  resumeUrl: '/resume-placeholder.pdf',
};
```

- [ ] **Step 2: Write failing test for project helpers**

```ts
// data/projects.test.ts
import { describe, it, expect } from 'vitest';
import { projects, getProjectBySlug, getFeaturedProjects } from './projects';

describe('projects data', () => {
  it('has six projects with unique slugs', () => {
    expect(projects).toHaveLength(6);
    const slugs = new Set(projects.map((p) => p.slug));
    expect(slugs.size).toBe(6);
  });

  it('getProjectBySlug returns the matching project', () => {
    const project = getProjectBySlug('realtime-analytics-dashboard');
    expect(project?.title).toBe('Realtime Analytics Dashboard');
  });

  it('getProjectBySlug returns undefined for an unknown slug', () => {
    expect(getProjectBySlug('does-not-exist')).toBeUndefined();
  });

  it('getFeaturedProjects returns only featured projects', () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- projects`
Expected: FAIL — `data/projects.ts` does not exist.

- [ ] **Step 4: Write `data/projects.ts`**

```ts
export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  thumbnail: string;
  gallery: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
};

function thumbnailFor(slug: string) {
  return `https://picsum.photos/seed/${slug}/800/600`;
}

function galleryFor(slug: string) {
  return [1, 2, 3].map((n) => `https://picsum.photos/seed/${slug}-${n}/1200/800`);
}

const LONG_DESCRIPTION_PLACEHOLDER = [
  'This is placeholder case-study copy. Replace it with a real writeup of the problem this project solved.',
  'A second placeholder paragraph — describe your approach, key technical decisions, and any interesting tradeoffs.',
  'A third placeholder paragraph — describe the outcome, what you learned, and what you would do differently.',
].join('\n\n');

export const projects: Project[] = [
  {
    slug: 'realtime-analytics-dashboard',
    title: 'Realtime Analytics Dashboard',
    shortDescription: 'Placeholder description of a realtime analytics dashboard project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['React', 'TypeScript', 'Node.js', 'WebSockets'],
    thumbnail: thumbnailFor('realtime-analytics-dashboard'),
    gallery: galleryFor('realtime-analytics-dashboard'),
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/realtime-analytics-dashboard',
    featured: true,
  },
  {
    slug: 'ai-recipe-generator',
    title: 'AI Recipe Generator',
    shortDescription: 'Placeholder description of an AI-powered recipe generator project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['Next.js', 'TypeScript', 'OpenAI API'],
    thumbnail: thumbnailFor('ai-recipe-generator'),
    gallery: galleryFor('ai-recipe-generator'),
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/ai-recipe-generator',
    featured: true,
  },
  {
    slug: 'distributed-task-queue',
    title: 'Distributed Task Queue',
    shortDescription: 'Placeholder description of a distributed task queue project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['Go', 'Redis', 'Docker'],
    thumbnail: thumbnailFor('distributed-task-queue'),
    gallery: galleryFor('distributed-task-queue'),
    githubUrl: 'https://github.com/yourusername/distributed-task-queue',
    featured: true,
  },
  {
    slug: 'personal-finance-tracker',
    title: 'Personal Finance Tracker',
    shortDescription: 'Placeholder description of a personal finance tracker project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['React Native', 'TypeScript', 'SQLite'],
    thumbnail: thumbnailFor('personal-finance-tracker'),
    gallery: galleryFor('personal-finance-tracker'),
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/personal-finance-tracker',
    featured: false,
  },
  {
    slug: 'markdown-note-sync',
    title: 'Markdown Note Sync',
    shortDescription: 'Placeholder description of a markdown note-syncing tool project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['Rust', 'CLI', 'S3'],
    thumbnail: thumbnailFor('markdown-note-sync'),
    gallery: galleryFor('markdown-note-sync'),
    githubUrl: 'https://github.com/yourusername/markdown-note-sync',
    featured: false,
  },
  {
    slug: 'open-source-cli-toolkit',
    title: 'Open Source CLI Toolkit',
    shortDescription: 'Placeholder description of an open source CLI toolkit project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['Node.js', 'TypeScript'],
    thumbnail: thumbnailFor('open-source-cli-toolkit'),
    gallery: galleryFor('open-source-cli-toolkit'),
    githubUrl: 'https://github.com/yourusername/open-source-cli-toolkit',
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- projects`
Expected: 4 passed.

- [ ] **Step 6: Write `data/timeline.ts`**

```ts
export type TimelineEntry = {
  kind: 'job' | 'education' | 'achievement';
  title: string;
  organization: string;
  dateRange: string;
  description: string;
};

export const timeline: TimelineEntry[] = [
  {
    kind: 'job',
    title: 'Senior Software Engineer',
    organization: 'Company Name Here',
    dateRange: '2024 — Present',
    description: 'Placeholder description of responsibilities and impact in this role.',
  },
  {
    kind: 'achievement',
    title: 'Speaker, Example Tech Conference',
    organization: 'Example Tech Conference',
    dateRange: '2023',
    description: 'Placeholder description of the talk given and its topic.',
  },
  {
    kind: 'job',
    title: 'Software Engineer',
    organization: 'Previous Company Name',
    dateRange: '2021 — 2024',
    description: 'Placeholder description of responsibilities and impact in this role.',
  },
  {
    kind: 'achievement',
    title: 'Published Open Source Project with 1k+ Stars',
    organization: 'GitHub',
    dateRange: '2020',
    description: 'Placeholder description of the project and its adoption.',
  },
  {
    kind: 'education',
    title: 'B.S. in Computer Science',
    organization: 'University Name Here',
    dateRange: '2017 — 2021',
    description: 'Placeholder description of coursework, honors, or activities.',
  },
  {
    kind: 'job',
    title: 'Software Engineering Intern',
    organization: 'Internship Company Name',
    dateRange: '2020',
    description: 'Placeholder description of responsibilities and impact in this role.',
  },
];
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 8: Commit**

```bash
git add data
git commit -m "feat: placeholder profile, projects, and timeline data"
```

---

### Task 6: Site chrome — Navbar, MobileMenu, ThemeToggle wiring, Footer

**Files:**
- Create: `components/Navbar.tsx`, `components/Navbar.test.tsx`, `components/MobileMenu.tsx`, `components/Footer.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` (Task 2), `profile` (Task 5, for Footer social links — via `SocialLinks` in Task 7, so Footer will import `SocialLinks` once Task 7 lands; for now Footer links directly using `profile.social`).
- Produces: `<Navbar />` and `<Footer />`, used once each in `app/layout.tsx`.

- [ ] **Step 1: Write failing test for Navbar mobile menu toggling**

```tsx
// components/Navbar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar', () => {
  it('opens and closes the mobile menu', () => {
    render(<Navbar />);

    const openButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(openButton);

    const closeButton = screen.getByRole('button', { name: /close menu/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Navbar`
Expected: FAIL — `components/Navbar.tsx` does not exist.

- [ ] **Step 3: Write `components/MobileMenu.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col bg-white p-6 dark:bg-slate-950 md:hidden"
        >
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-300"
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
                className="text-2xl font-display font-semibold text-slate-900 dark:text-white"
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

- [ ] **Step 4: Write `components/Navbar.tsx`**

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold text-slate-900 dark:text-white">
          Your Name Here
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-violet-600 dark:hover:text-cyan-400 ${
                pathname === link.href
                  ? 'text-violet-600 dark:text-cyan-400'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 dark:text-slate-300 md:hidden"
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

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- Navbar`
Expected: PASS

- [ ] **Step 6: Write `components/Footer.tsx`**

```tsx
import Link from 'next/link';
import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <div className="flex gap-6">
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 dark:hover:text-cyan-400">
            GitHub
          </a>
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 dark:hover:text-cyan-400">
            LinkedIn
          </a>
          <a href={`mailto:${profile.social.email}`} className="hover:text-violet-600 dark:hover:text-cyan-400">
            Email
          </a>
          <Link href="/contact" className="hover:text-violet-600 dark:hover:text-cyan-400">
            Contact
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Wire Navbar and Footer into `app/layout.tsx`**

Modify `app/layout.tsx`: import `Navbar` from `@/components/Navbar` and `Footer` from `@/components/Footer`; render `<Navbar />` then `<main>{children}</main>` then `<Footer />` inside `<ThemeProvider>`.

```tsx
// app/layout.tsx body content becomes:
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
```

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 9: Commit**

```bash
git add components/Navbar.tsx components/Navbar.test.tsx components/MobileMenu.tsx components/Footer.tsx app/layout.tsx
git commit -m "feat: responsive navbar with mobile menu, theme toggle, and footer"
```

---

### Task 7: Shared building blocks — AnimatedSection, SocialLinks, ResumeButton

**Files:**
- Create: `components/AnimatedSection.tsx`, `components/AnimatedSection.test.tsx`
- Create: `components/SocialLinks.tsx`, `components/ResumeButton.tsx`
- Modify: `components/Footer.tsx` (use `SocialLinks` instead of inline links)

**Interfaces:**
- Consumes: `profile` (Task 5).
- Produces: `<AnimatedSection>` (used by Tasks 9–12), `<SocialLinks />`, `<ResumeButton />` (used by Tasks 12–13 and Footer).

- [ ] **Step 1: Write failing tests for reduced-motion behavior**

```tsx
// components/AnimatedSection.test.tsx
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnimatedSection from './AnimatedSection';

const mockUseReducedMotion = vi.fn();

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => mockUseReducedMotion(),
  };
});

describe('AnimatedSection', () => {
  it('starts hidden (opacity 0) when motion is not reduced', () => {
    mockUseReducedMotion.mockReturnValue(false);
    const { container } = render(<AnimatedSection>content</AnimatedSection>);
    expect(container.firstChild).toHaveStyle({ opacity: '0' });
  });

  it('is immediately visible when motion is reduced', () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { container } = render(<AnimatedSection>content</AnimatedSection>);
    expect(container.firstChild).toHaveStyle({ opacity: '1' });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- AnimatedSection`
Expected: FAIL — `components/AnimatedSection.tsx` does not exist.

- [ ] **Step 3: Write `components/AnimatedSection.tsx`**

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const reducedVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={shouldReduceMotion ? reducedVariants : variants}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- AnimatedSection`
Expected: 2 passed.

- [ ] **Step 5: Write `components/SocialLinks.tsx`**

```tsx
import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/data/profile';

export default function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`}>
      <a
        href={profile.social.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-violet-600 hover:text-violet-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
      >
        <Github className="h-5 w-5" />
      </a>
      <a
        href={profile.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-violet-600 hover:text-violet-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
      >
        <Linkedin className="h-5 w-5" />
      </a>
      <a
        href={`mailto:${profile.social.email}`}
        aria-label="Email"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-violet-600 hover:text-violet-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
      >
        <Mail className="h-5 w-5" />
      </a>
    </div>
  );
}
```

- [ ] **Step 6: Write `components/ResumeButton.tsx`**

```tsx
import { Download } from 'lucide-react';
import { profile } from '@/data/profile';

export default function ResumeButton({ className }: { className?: string }) {
  return (
    <a
      href={profile.resumeUrl}
      download
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 font-semibold text-white transition hover:opacity-90 ${className ?? ''}`}
    >
      <Download className="h-4 w-4" />
      Download Resume
    </a>
  );
}
```

- [ ] **Step 7: Simplify `components/Footer.tsx` to use `SocialLinks`**

Replace the inline `<a>` tags for GitHub/LinkedIn/Email in `components/Footer.tsx` with `<SocialLinks />`, keeping the `Contact` link and copyright line:

```tsx
import Link from 'next/link';
import SocialLinks from './SocialLinks';
import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <SocialLinks />
        <Link href="/contact" className="hover:text-violet-600 dark:hover:text-cyan-400">
          Contact
        </Link>
        <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 8: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 9: Commit**

```bash
git add components/AnimatedSection.tsx components/AnimatedSection.test.tsx components/SocialLinks.tsx components/ResumeButton.tsx components/Footer.tsx
git commit -m "feat: shared animated section, social links, and resume button components"
```

---

### Task 8: Presentational cards — ProjectCard, BlogCard, TimelineItem

**Files:**
- Create: `components/ProjectCard.tsx`, `components/BlogCard.tsx`, `components/TimelineItem.tsx`, `lib/formatDate.ts`

**Interfaces:**
- Consumes: `Project` type (Task 5), `BlogPost` type (Task 3/4), `TimelineEntry` type (Task 5).
- Produces: `<ProjectCard project={Project} />`, `<BlogCard post={BlogPost} />`, `<TimelineItem entry={TimelineEntry} />`, `formatDate(dateStr: string): string`. Consumed by Tasks 9–12.

No unit tests in this task — these are pure presentational components with no branching logic beyond prop rendering; correctness is verified visually via the dev server once wired into real pages in Tasks 9–12 (per the plan's testing approach: pure/data logic is unit-tested, presentational composition is checked manually).

- [ ] **Step 1: Write `lib/formatDate.ts`**

```ts
export function formatDate(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
```

- [ ] **Step 2: Write `components/ProjectCard.tsx`**

```tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/data/projects';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-violet-600 hover:shadow-lg dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-400"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={`Thumbnail image for the ${project.title} project`}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{project.title}</h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.shortDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-cyan-400/10 dark:text-cyan-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 3: Write `components/BlogCard.tsx`**

```tsx
import Link from 'next/link';
import type { BlogPost } from '@/lib/markdown';
import { formatDate } from '@/lib/formatDate';

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-violet-600 hover:shadow-lg dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-400"
    >
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">&middot;</span>
        <span>{post.readingTime}</span>
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold text-slate-900 dark:text-white">{post.title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{post.excerpt}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-cyan-400/10 dark:text-cyan-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: Write `components/TimelineItem.tsx`**

```tsx
import type { TimelineEntry } from '@/data/timeline';

const KIND_LABEL: Record<TimelineEntry['kind'], string> = {
  job: 'Job',
  education: 'Education',
  achievement: 'Achievement',
};

const KIND_COLOR: Record<TimelineEntry['kind'], string> = {
  job: 'bg-violet-600',
  education: 'bg-cyan-500',
  achievement: 'bg-fuchsia-500',
};

export default function TimelineItem({ entry }: { entry: TimelineEntry }) {
  return (
    <div className="relative border-l-2 border-slate-200 pb-10 pl-8 last:pb-0 dark:border-white/10">
      <span
        className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full ${KIND_COLOR[entry.kind]}`}
        aria-hidden="true"
      />
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {KIND_LABEL[entry.kind]} &middot; {entry.dateRange}
      </span>
      <h3 className="mt-1 font-display text-lg font-semibold text-slate-900 dark:text-white">{entry.title}</h3>
      <p className="text-sm font-medium text-violet-600 dark:text-cyan-400">{entry.organization}</p>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{entry.description}</p>
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 6: Commit**

```bash
git add components/ProjectCard.tsx components/BlogCard.tsx components/TimelineItem.tsx lib/formatDate.ts
git commit -m "feat: project, blog, and timeline presentational cards"
```

---

### Task 9: Home page

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `profile` (Task 5), `getFeaturedProjects` (Task 5), `AnimatedSection` (Task 7), `ProjectCard` (Task 8).

- [ ] **Step 1: Write `app/page.tsx`**

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
};

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center sm:pt-32">
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-cyan-400">
          {profile.title}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-slate-900 dark:text-white sm:text-6xl">
          {profile.name}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{profile.intro}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/projects"
            className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-8 py-3 font-semibold text-white transition hover:opacity-90"
          >
            View Projects
          </Link>
          <Link
            href="/about"
            className="rounded-full border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition hover:border-violet-600 hover:text-violet-600 dark:border-white/20 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
          >
            About & Resume
          </Link>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Featured Projects
          </h2>
          <Link href="/projects" className="text-sm font-semibold text-violet-600 dark:text-cyan-400">
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

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open `http://localhost:3000`. Confirm: hero renders, both CTA buttons navigate correctly, exactly the featured projects (3) render as cards, layout has no horizontal scroll at 375px/768px/1024px/1440px (resize the browser or use devtools device toolbar).

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: home page with hero and featured projects"
```

---

### Task 10: Projects list and project detail pages

**Files:**
- Create: `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`

**Interfaces:**
- Consumes: `projects`, `getProjectBySlug` (Task 5), `ProjectCard` (Task 8), `AnimatedSection` (Task 7).

- [ ] **Step 1: Write `app/projects/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A selection of projects — replace with your real project portfolio.',
};

export default function ProjectsPage() {
  return (
    <AnimatedSection className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Projects</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Placeholder intro copy for the projects page — replace with a real summary of your work.
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

- [ ] **Step 2: Write `app/projects/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, Github } from 'lucide-react';
import { projects, getProjectBySlug } from '@/data/projects';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-6 py-20">
      <Link href="/projects" className="text-sm font-semibold text-violet-600 dark:text-cyan-400">
        &larr; All projects
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
        {project.title}
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-cyan-400/10 dark:text-cyan-300"
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
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" /> Live Demo
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-violet-600 hover:text-violet-600 dark:border-white/20 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        )}
      </div>

      <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl">
        <Image
          src={project.thumbnail}
          alt={`Main preview image for the ${project.title} project`}
          fill
          className="object-cover"
        />
      </div>

      <div className="prose prose-slate mt-10 max-w-none dark:prose-invert">
        {project.longDescription.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {project.gallery.map((image, i) => (
          <div key={image} className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={`Gallery image ${i + 1} for the ${project.title} project`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Verify build generates all six project detail pages**

Run: `npm run build`
Expected: succeeds; output lists `out/projects/realtime-analytics-dashboard/index.html` (and the other five slugs).

- [ ] **Step 4: Manual verification**

Run: `npm run dev`. Visit `/projects`, confirm all 6 cards render and link correctly. Visit one project detail page, confirm gallery, tech tags, and conditional live/GitHub buttons render (check a project without `liveUrl`, e.g. `distributed-task-queue`, to confirm the Live Demo button is correctly absent).

- [ ] **Step 5: Commit**

```bash
git add app/projects
git commit -m "feat: projects list and project detail pages"
```

---

### Task 11: Blog list and blog post pages

**Files:**
- Create: `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getAllPosts`, `getPostBySlug` (Task 4), `BlogCard` (Task 8), `AnimatedSection` (Task 7), `formatDate` (Task 8).

- [ ] **Step 1: Write `app/blog/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing on software engineering — replace with your real posts.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <AnimatedSection className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Blog</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
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

- [ ] **Step 2: Write `app/blog/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { formatDate } from '@/lib/formatDate';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  try {
    const post = getPostBySlug(params.slug);
    return { title: post.title, description: post.excerpt };
  } catch {
    return {};
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <Link href="/blog" className="text-sm font-semibold text-violet-600 dark:text-cyan-400">
        &larr; All posts
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
        {post.title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden="true">&middot;</span>
        <span>{post.readingTime}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-cyan-400/10 dark:text-cyan-300"
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

- [ ] **Step 3: Verify build generates all four post pages**

Run: `npm run build`
Expected: succeeds; `out/blog/why-type-safety-matters/index.html` (and the other three slugs) exist.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`. Visit `/blog`, confirm 4 posts listed with correct dates/reading time/tags, in descending date order. Open one post, confirm rendered HTML body, tags, and back link work.

- [ ] **Step 5: Commit**

```bash
git add app/blog
git commit -m "feat: blog list and blog post pages"
```

---

### Task 12: About/Resume page and resume PDF placeholder

**Files:**
- Create: `app/about/page.tsx`, `scripts/generate-placeholder-resume.mjs`, `public/resume-placeholder.pdf` (generated)

**Interfaces:**
- Consumes: `profile`, `timeline` (Task 5), `TimelineItem` (Task 8), `ResumeButton` (Task 7), `AnimatedSection` (Task 7).

- [ ] **Step 1: Write `scripts/generate-placeholder-resume.mjs`**

```js
import { writeFileSync } from 'node:fs';

const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
];

const streamText = [
  'BT /F1 24 Tf 72 700 Td (Resume Placeholder) Tj ET',
  'BT /F1 12 Tf 72 670 Td (Replace this file with your real resume PDF.) Tj ET',
].join('\n');
const streamBody = `<< /Length ${streamText.length} >>\nstream\n${streamText}\nendstream`;

const allObjects = [...objects, streamBody];

let pdf = '%PDF-1.4\n';
const offsets = [0];
allObjects.forEach((body, i) => {
  offsets.push(pdf.length);
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});

const xrefStart = pdf.length;
let xref = `xref\n0 ${allObjects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= allObjects.length; i += 1) {
  xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
}

pdf += xref;
pdf += `trailer\n<< /Size ${allObjects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

writeFileSync(new URL('../public/resume-placeholder.pdf', import.meta.url), pdf, 'latin1');
console.log('Wrote public/resume-placeholder.pdf');
```

- [ ] **Step 2: Run the generator**

Run: `node scripts/generate-placeholder-resume.mjs`
Expected: prints `Wrote public/resume-placeholder.pdf`.

- [ ] **Step 3: Verify the PDF is valid**

Run: `file public/resume-placeholder.pdf`
Expected: output contains `PDF document`.

- [ ] **Step 4: Write `app/about/page.tsx`**

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
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">About</h1>
      <div className="mt-6 space-y-4 text-slate-600 dark:text-slate-300">
        {profile.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <ResumeButton className="mt-8" />

      <AnimatedSection className="mt-16">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Experience & Education</h2>
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

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: succeeds; `out/resume-placeholder.pdf` present in the output.

- [ ] **Step 6: Manual verification**

Run: `npm run dev`. Visit `/about`, confirm bio paragraphs, unified chronological timeline (jobs/education/achievements interleaved, not grouped by kind), and that clicking "Download Resume" downloads/opens the placeholder PDF.

- [ ] **Step 7: Commit**

```bash
git add app/about/page.tsx scripts/generate-placeholder-resume.mjs public/resume-placeholder.pdf
git commit -m "feat: about/resume page with unified timeline and placeholder resume PDF"
```

---

### Task 13: Contact page

**Files:**
- Create: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `profile` (Task 5), `SocialLinks`, `ResumeButton` (Task 7).

- [ ] **Step 1: Write `app/contact/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import SocialLinks from '@/components/SocialLinks';
import ResumeButton from '@/components/ResumeButton';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${profile.name}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Get in Touch</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        Placeholder contact copy — replace with a real note about how you'd like people to reach you.
      </p>
      <div className="mt-8">
        <SocialLinks />
      </div>
      <ResumeButton className="mt-8" />
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`. Visit `/contact`, confirm social icons link out correctly (GitHub/LinkedIn open in new tab, email opens mail client) and the resume button works.

- [ ] **Step 4: Commit**

```bash
git add app/contact/page.tsx
git commit -m "feat: contact page"
```

---

### Task 14: Final QA pass, responsive/accessibility check, and README

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: the whole app (final integration check, no new components).

- [ ] **Step 1: Full test suite**

Run: `npm test`
Expected: all tests pass (smoke, markdown, posts, projects, ThemeToggle, Navbar, AnimatedSection).

- [ ] **Step 2: Full build**

Run: `npm run build`
Expected: succeeds with no errors; confirm `out/` contains `index.html`, `projects/`, `blog/`, `about/`, `contact/`, `resume-placeholder.pdf`, `og-image.svg`.

- [ ] **Step 3: Manual click-through**

Run: `npm run dev`. Visit every route (`/`, `/projects`, each of the 6 `/projects/[slug]`, `/blog`, each of the 4 `/blog/[slug]`, `/about`, `/contact`, and a bad URL to confirm the custom 404 renders). Confirm no broken links or console errors.

- [ ] **Step 4: Responsive check**

Using browser devtools device toolbar, check every route at 375px, 768px, 1024px, and 1440px+. Confirm: no horizontal scroll, nav is a hamburger menu below `md` (768px) and full inline nav at/above it, grids collapse to fewer columns on narrow widths, no overlapping text/elements, all text remains legible.

- [ ] **Step 5: Theme and motion check**

Toggle dark/light mode, reload the page, confirm the choice persists. Enable "prefers reduced motion" in devtools (Rendering tab &rarr; Emulate CSS media feature `prefers-reduced-motion: reduce`) and confirm `AnimatedSection` content appears immediately without a fade/slide.

- [ ] **Step 6: Write `README.md`**

```md
# Personal Website

Next.js (App Router) + TypeScript + Tailwind CSS personal portfolio site, statically exported for Hostinger shared hosting.

## Development

    npm install
    npm run dev

Open http://localhost:3000.

## Testing

    npm test

## Build & deploy to Hostinger

    npm run build

This produces a static `out/` folder. Upload the **contents** of `out/` (not the folder itself) to your Hostinger `public_html` directory (or a subfolder, if hosting under a path) via the Hostinger File Manager or an FTP client. No Node.js server is required — it's all static files.

## Adding your real content

All placeholder content lives in a few centralized files:

- `data/profile.ts` — name, title, bio, social links, resume path
- `data/projects.ts` — project list (edit or add entries; each needs a unique `slug`)
- `data/timeline.ts` — jobs, education, and achievements (rendered as one chronological timeline on `/about`)
- `content/blog/*.md` — blog posts (add a new `.md` file with frontmatter `title`, `date`, `excerpt`, `tags` to publish a new post)
- `public/resume-placeholder.pdf` — replace with your real resume PDF (keep the filename, or update `resumeUrl` in `data/profile.ts`)
- `public/og-image.svg` — replace with a real 1200x630 PNG/JPG for better social-share previews

After editing, re-run `npm run build` and re-upload `out/`.
```

- [ ] **Step 7: Commit**

```bash
git add README.md
git commit -m "docs: add README with build, deploy, and content-editing instructions"
```
