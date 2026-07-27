# In-Browser Blog Admin Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an in-browser admin page (`/admin`) that lets the site owner create, edit, and delete blog posts without touching git directly — every save commits straight to GitHub via its REST API, which triggers the existing build/deploy pipeline.

**Architecture:** `/admin` is a client-side-only page (the site is a static export, so there's no server to run admin logic on). It authenticates to GitHub with a Personal Access Token entered once and stored in the browser's `localStorage`, and reads/writes `content/blog/*.md` files directly via GitHub's Contents REST API. A successful save is a real git commit to `main`, which the existing `.github/workflows/deploy.yml` picks up exactly like any other push.

**Tech Stack:** Next.js App Router (client components), TypeScript, `gray-matter` (already a dependency), `unified`/`remark-parse`/`remark-html` (already dependencies), Vitest for unit tests, GitHub REST API (Contents endpoints) via plain `fetch` — no new dependencies.

## Global Constraints

- Client-side only: no Next.js server API routes or server actions — the static export (`output: 'export'`) has no server to run them on.
- GitHub PAT is stored only in the browser's `localStorage`, never embedded in the built site, never sent anywhere but `api.github.com`.
- Target repo is `SamanKC/samankc.com`, branch `main`, posts live under `content/blog/`.
- Every save is a live publish (a real commit to `main`) — there is no draft/staging state.
- `/admin` is not linked from the site nav and sets `robots: { index: false, follow: false }`.
- Out of scope for this version: slug/filename renaming, image uploads, GitHub OAuth login, draft/editorial workflow, multi-user support.
- The owner should use a **fine-grained** GitHub PAT scoped to only this one repository with **Contents: Read and write** permission — this belongs in a README note, not code.

---

## Shared Types Reference

Defined in Task 2, consumed by Tasks 4 and 5:

```ts
// lib/github.ts
export type GithubFile = { name: string; sha: string };
export class GithubApiError extends Error {
  status: number;
  constructor(status: number, message: string);
}
export function listPosts(token: string): Promise<GithubFile[]>;
export function getPost(token: string, filename: string): Promise<{ content: string; sha: string }>;
export function savePost(token: string, filename: string, content: string, sha?: string): Promise<{ sha: string }>;
export function deletePost(token: string, filename: string, sha: string): Promise<void>;
```

Defined in Task 1, consumed by Task 5 (and by the existing `lib/markdown.ts`):

```ts
// lib/renderMarkdown.ts
export function renderMarkdown(content: string): string;
```

---

### Task 1: Extract `renderMarkdown` for reuse in the client-side preview

**Files:**
- Create: `lib/renderMarkdown.ts`, `lib/renderMarkdown.test.ts`
- Modify: `lib/markdown.ts`

**Interfaces:**
- Produces: `renderMarkdown(content: string): string` — consumed by `lib/markdown.ts` (build time) and Task 5's `PostEditor` (client-time preview).

- [ ] **Step 1: Write failing tests for the extracted function**

```ts
// lib/renderMarkdown.test.ts
import { describe, it, expect } from 'vitest';
import { renderMarkdown } from './renderMarkdown';

describe('renderMarkdown', () => {
  it('renders headings to HTML', () => {
    const html = renderMarkdown('# Heading');
    expect(html).toContain('<h1>Heading</h1>');
  });

  it('renders bold text to HTML', () => {
    const html = renderMarkdown('Some **content** here.');
    expect(html).toContain('<strong>content</strong>');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- renderMarkdown`
Expected: FAIL — `lib/renderMarkdown.ts` does not exist.

- [ ] **Step 3: Write `lib/renderMarkdown.ts`**

```ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

export function renderMarkdown(content: string): string {
  return unified().use(remarkParse).use(remarkHtml).processSync(content).toString();
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- renderMarkdown`
Expected: 2 passed.

- [ ] **Step 5: Update `lib/markdown.ts` to use the extracted function**

Replace the direct `unified()...processSync(...)` call in `parsePost` with the extracted helper. The full file becomes:

```ts
import matter from 'gray-matter';
import { renderMarkdown } from './renderMarkdown';

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
  const contentHtml = renderMarkdown(content);

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

- [ ] **Step 6: Run the full test suite to confirm nothing broke**

Run: `npm test`
Expected: all existing test files still pass (`lib/markdown.test.ts`'s 4 tests must still pass unchanged, since behavior is identical — only the code moved).

- [ ] **Step 7: Commit**

```bash
git add lib/renderMarkdown.ts lib/renderMarkdown.test.ts lib/markdown.ts
git commit -m "refactor: extract renderMarkdown for reuse in admin preview"
```

---

### Task 2: GitHub Contents API client

**Files:**
- Create: `lib/github.ts`, `lib/github.test.ts`

**Interfaces:**
- Produces: `GithubFile`, `GithubApiError`, `listPosts`, `getPost`, `savePost`, `deletePost` — exact signatures in the Shared Types Reference above. Consumed by Task 4 (`PostList`) and Task 5 (`PostEditor`).

- [ ] **Step 1: Write failing tests**

```ts
// lib/github.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listPosts, getPost, savePost, deletePost } from './github';

function mockFetchOnce(status: number, body: unknown) {
  const ok = status >= 200 && status < 300;
  (global.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok,
    status,
    statusText: 'Error',
    json: async () => body,
  });
}

beforeEach(() => {
  global.fetch = vi.fn();
});

describe('listPosts', () => {
  it('requests the blog directory and returns only .md files', async () => {
    mockFetchOnce(200, [
      { name: 'post-one.md', sha: 'sha1' },
      { name: 'post-two.md', sha: 'sha2' },
      { name: '.gitkeep', sha: 'sha3' },
    ]);

    const files = await listPosts('test-token');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/SamanKC/samankc.com/contents/content/blog',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      })
    );
    expect(files).toEqual([
      { name: 'post-one.md', sha: 'sha1' },
      { name: 'post-two.md', sha: 'sha2' },
    ]);
  });

  it('throws a GithubApiError with the response status on failure', async () => {
    mockFetchOnce(401, { message: 'Bad credentials' });

    await expect(listPosts('bad-token')).rejects.toMatchObject({
      status: 401,
      message: 'Bad credentials',
    });
  });
});

describe('getPost', () => {
  it('decodes base64 content and returns the sha', async () => {
    const encoded = Buffer.from('---\ntitle: Test\n---\nBody').toString('base64');
    mockFetchOnce(200, { content: encoded, sha: 'file-sha' });

    const result = await getPost('test-token', 'test-post.md');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/SamanKC/samankc.com/contents/content/blog/test-post.md',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer test-token' }),
      })
    );
    expect(result).toEqual({ content: '---\ntitle: Test\n---\nBody', sha: 'file-sha' });
  });
});

describe('savePost', () => {
  it('PUTs base64-encoded content without a sha when creating', async () => {
    mockFetchOnce(201, { content: { sha: 'new-sha' } });

    const result = await savePost('test-token', 'new-post.md', 'Hello world');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/SamanKC/samankc.com/contents/content/blog/new-post.md',
      expect.objectContaining({ method: 'PUT' })
    );
    const call = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const sentBody = JSON.parse(call[1].body as string);
    expect(sentBody.sha).toBeUndefined();
    expect(Buffer.from(sentBody.content, 'base64').toString()).toBe('Hello world');
    expect(result).toEqual({ sha: 'new-sha' });
  });

  it('PUTs with a sha when updating', async () => {
    mockFetchOnce(200, { content: { sha: 'updated-sha' } });

    await savePost('test-token', 'existing-post.md', 'Updated body', 'old-sha');

    const call = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const sentBody = JSON.parse(call[1].body as string);
    expect(sentBody.sha).toBe('old-sha');
  });
});

describe('deletePost', () => {
  it('DELETEs with the sha in the body', async () => {
    mockFetchOnce(200, {});

    await deletePost('test-token', 'old-post.md', 'file-sha');

    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/SamanKC/samankc.com/contents/content/blog/old-post.md',
      expect.objectContaining({ method: 'DELETE' })
    );
    const call = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    const sentBody = JSON.parse(call[1].body as string);
    expect(sentBody.sha).toBe('file-sha');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test -- github`
Expected: FAIL — `lib/github.ts` does not exist.

- [ ] **Step 3: Write `lib/github.ts`**

```ts
const OWNER = 'SamanKC';
const REPO = 'samankc.com';
const BLOG_PATH = 'content/blog';
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

export type GithubFile = { name: string; sha: string };

export class GithubApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'GithubApiError';
    this.status = status;
  }
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };
}

async function parseErrorResponse(res: Response): Promise<never> {
  let message = res.statusText;
  try {
    const body = await res.json();
    if (body?.message) message = body.message;
  } catch {
    // response body wasn't JSON — fall back to statusText
  }
  throw new GithubApiError(res.status, message);
}

function encodeBase64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

function decodeBase64(base64: string): string {
  return decodeURIComponent(escape(atob(base64.replace(/\n/g, ''))));
}

export async function listPosts(token: string): Promise<GithubFile[]> {
  const res = await fetch(`${API_BASE}/${BLOG_PATH}`, { headers: authHeaders(token) });
  if (!res.ok) return parseErrorResponse(res);
  const files = (await res.json()) as Array<{ name: string; sha: string }>;
  return files.filter((f) => f.name.endsWith('.md')).map((f) => ({ name: f.name, sha: f.sha }));
}

export async function getPost(token: string, filename: string): Promise<{ content: string; sha: string }> {
  const res = await fetch(`${API_BASE}/${BLOG_PATH}/${filename}`, { headers: authHeaders(token) });
  if (!res.ok) return parseErrorResponse(res);
  const body = (await res.json()) as { content: string; sha: string };
  return { content: decodeBase64(body.content), sha: body.sha };
}

export async function savePost(
  token: string,
  filename: string,
  content: string,
  sha?: string
): Promise<{ sha: string }> {
  const res = await fetch(`${API_BASE}/${BLOG_PATH}/${filename}`, {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `${sha ? 'Update' : 'Add'} post: ${filename}`,
      content: encodeBase64(content),
      sha,
    }),
  });
  if (!res.ok) return parseErrorResponse(res);
  const body = (await res.json()) as { content: { sha: string } };
  return { sha: body.content.sha };
}

export async function deletePost(token: string, filename: string, sha: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${BLOG_PATH}/${filename}`, {
    method: 'DELETE',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `Delete post: ${filename}`, sha }),
  });
  if (!res.ok) return parseErrorResponse(res);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- github`
Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add lib/github.ts lib/github.test.ts
git commit -m "feat: GitHub Contents API client for the admin editor"
```

---

### Task 3: Token gate

**Files:**
- Create: `components/admin/TokenGate.tsx`

**Interfaces:**
- Produces: `<TokenGate>{(token: string) => ReactNode}</TokenGate>` (render-prop pattern) — consumed by Task 6's `AdminClient`.

- [ ] **Step 1: Write `components/admin/TokenGate.tsx`**

```tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';

const TOKEN_STORAGE_KEY = 'admin-github-token';

export default function TokenGate({ children }: { children: (token: string) => ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setToken(window.localStorage.getItem(TOKEN_STORAGE_KEY));
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-6 py-24">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Admin Login</h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Enter a GitHub personal access token with Contents read/write access to{' '}
          <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-white/10">SamanKC/samankc.com</code>.
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
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-2 font-semibold text-white transition hover:opacity-90"
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
          onClick={() => {
            window.localStorage.removeItem(TOKEN_STORAGE_KEY);
            setToken(null);
          }}
          className="text-xs text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-cyan-400"
        >
          Forget token
        </button>
      </div>
      {children(token)}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds (there's no route rendering `TokenGate` yet, so this only confirms it type-checks and compiles).

- [ ] **Step 3: Commit**

```bash
git add components/admin/TokenGate.tsx
git commit -m "feat: token gate for the admin editor"
```

---

### Task 4: Post list — list, edit trigger, delete

**Files:**
- Create: `components/admin/PostList.tsx`

**Interfaces:**
- Consumes: `listPosts`, `getPost`, `deletePost`, `GithubFile` from `@/lib/github` (Task 2).
- Produces: `<PostList token={string} onNew={() => void} onEdit={(filename: string) => void} />` — consumed by Task 6's `AdminClient`.

- [ ] **Step 1: Write `components/admin/PostList.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import matter from 'gray-matter';
import { listPosts, getPost, deletePost, type GithubFile } from '@/lib/github';

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
}: {
  token: string;
  onEdit: (filename: string) => void;
  onNew: () => void;
}) {
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    setError(null);
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
      setError(err instanceof Error ? err.message : 'Failed to load posts.');
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
      setError(err instanceof Error ? err.message : 'Failed to delete post.');
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Blog Posts</h1>
        <button
          type="button"
          onClick={onNew}
          className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          New Post
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {!posts && !error && <p className="mt-6 text-slate-500 dark:text-slate-400">Loading posts…</p>}

      {posts && (
        <ul className="mt-6 divide-y divide-slate-200 dark:divide-white/10">
          {posts.map((post) => (
            <li key={post.filename} className="flex items-center justify-between py-4">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{post.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{post.date}</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onEdit(post.filename)}
                  className="text-sm font-semibold text-violet-600 dark:text-cyan-400"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post)}
                  className="text-sm font-semibold text-red-500"
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

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Manual smoke test of the error path (no route wires this in yet, so verify via a scratch page or defer to Task 6 — if deferring, note it here and re-verify in Task 6's manual check)**

This component has no real GitHub token to test the happy path against yet, and isn't reachable at a route until Task 6. Defer full manual verification to Task 6's step, which covers this component once it's wired into `/admin`.

- [ ] **Step 4: Commit**

```bash
git add components/admin/PostList.tsx
git commit -m "feat: post list with edit/delete for the admin editor"
```

---

### Task 5: Post editor — create/edit form with live preview

**Files:**
- Create: `components/admin/PostEditor.tsx`

**Interfaces:**
- Consumes: `getPost`, `savePost` from `@/lib/github` (Task 2); `renderMarkdown` from `@/lib/renderMarkdown` (Task 1).
- Produces: `<PostEditor token={string} filename={string | null} onDone={() => void} />` — `filename={null}` means "new post"; consumed by Task 6's `AdminClient`.

- [ ] **Step 1: Write `components/admin/PostEditor.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import matter from 'gray-matter';
import { getPost, savePost } from '@/lib/github';
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
}: {
  token: string;
  filename: string | null;
  onDone: () => void;
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
        setError(err instanceof Error ? err.message : 'Failed to load post.');
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
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save post.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="mx-auto max-w-5xl px-6 py-12 text-slate-500 dark:text-slate-400">Loading post…</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <button type="button" onClick={onDone} className="text-sm font-semibold text-violet-600 dark:text-cyan-400">
        &larr; Back to posts
      </button>
      <h1 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">
        {isNew ? 'New Post' : 'Edit Post'}
      </h1>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Slug
          <input
            type="text"
            value={slug}
            disabled={!isNew}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 disabled:opacity-50 dark:border-white/20 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Tags (comma-separated)
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300 sm:col-span-2">
          Excerpt
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white"
          />
        </label>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Body (Markdown)
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={20}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Preview
          <div
            className="prose prose-slate max-w-none rounded-lg border border-slate-300 bg-white px-4 py-3 dark:prose-invert dark:border-white/20 dark:bg-slate-900"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !title || !slug}
        className="mt-6 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/admin/PostEditor.tsx
git commit -m "feat: post editor with live Markdown preview for the admin editor"
```

---

### Task 6: Wire it together at `/admin`

**Files:**
- Create: `components/admin/AdminClient.tsx`, `app/admin/page.tsx`

**Interfaces:**
- Consumes: `TokenGate` (Task 3), `PostList` (Task 4), `PostEditor` (Task 5).

Next.js requires `metadata` exports to come from a Server Component, but this page is entirely interactive (client-side). Split it: `app/admin/page.tsx` stays a Server Component that only exports metadata and renders the client component; `components/admin/AdminClient.tsx` holds the `'use client'` view-switching logic.

- [ ] **Step 1: Write `components/admin/AdminClient.tsx`**

```tsx
'use client';

import { useState } from 'react';
import TokenGate from './TokenGate';
import PostList from './PostList';
import PostEditor from './PostEditor';

type View = { name: 'list' } | { name: 'editor'; filename: string | null };

export default function AdminClient() {
  const [view, setView] = useState<View>({ name: 'list' });

  return (
    <TokenGate>
      {(token) =>
        view.name === 'list' ? (
          <PostList
            token={token}
            onNew={() => setView({ name: 'editor', filename: null })}
            onEdit={(filename) => setView({ name: 'editor', filename })}
          />
        ) : (
          <PostEditor token={token} filename={view.filename} onDone={() => setView({ name: 'list' })} />
        )
      }
    </TokenGate>
  );
}
```

- [ ] **Step 2: Write `app/admin/page.tsx`**

```tsx
import type { Metadata } from 'next';
import AdminClient from '@/components/admin/AdminClient';

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminClient />;
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: succeeds; `out/admin/index.html` is generated.

- [ ] **Step 4: Manual verification — token gate and error path (no real token needed)**

Run: `npm run dev`. Visit `/admin`.
- Confirm the token-entry form renders (title "Admin Login", password-type input, "Unlock" button).
- Enter any bogus string (e.g. `not-a-real-token`) and submit. Confirm the page moves past the gate into the post list, which then shows a loading state and then an inline red error message (since the bogus token will get a 401 from GitHub) rather than crashing.
- Click "Forget token" (top-right) and confirm it returns to the token-entry form.
- Confirm `view-source:` (or devtools Elements panel) shows `<meta name="robots" content="noindex, nofollow">` somewhere in `<head>`.

- [ ] **Step 5: Note the full end-to-end check for the site owner**

The remaining verification — actually creating, editing, and deleting a real post against the live `SamanKC/samankc.com` repo — requires a real GitHub PAT and writes a real commit to the production repo (triggering a real deploy). This should be done by the site owner directly once they've created their fine-grained PAT, not automated here. Record this as an explicit follow-up rather than performing it against production during implementation.

- [ ] **Step 6: Commit**

```bash
git add components/admin/AdminClient.tsx app/admin/page.tsx
git commit -m "feat: wire up /admin page with token gate, post list, and editor"
```

---

### Task 7: README documentation and final check

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add an "Admin editor" section to `README.md`**

Add this section (placement: after the existing "Adding your real content" section):

```md
## Using the admin editor

Instead of editing `content/blog/*.md` directly, you can manage posts from `/admin` on the live site:

1. Create a GitHub personal access token: GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens → generate one scoped to **only** the `samankc.com` repository, with **Contents: Read and write** permission and no other permissions.
2. Visit `yourdomain.com/admin` and paste the token in when prompted. It's saved only in that browser's local storage.
3. Create, edit, or delete posts from there. Every save commits directly to `main` and triggers the existing GitHub Actions deploy — changes go live within a couple of minutes, the same as pushing from your machine.
4. Use "Forget token" on that page if you ever want to clear it from a shared or public computer.
```

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: all tests pass (existing suite plus the new `renderMarkdown.test.ts` and `github.test.ts`).

- [ ] **Step 3: Run the full build**

Run: `npm run build`
Expected: succeeds with no errors; `out/admin/index.html` present alongside the rest of the site.

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: document the admin editor and how to create a scoped GitHub token"
```
