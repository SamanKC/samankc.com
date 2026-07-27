# In-Browser Blog Editor — Design

Date: 2026-07-27

## Purpose

The personal portfolio site (Next.js static export, deployed to Hostinger via a GitHub Actions → FTP pipeline) currently requires editing `content/blog/*.md` files directly in the repo (locally or via GitHub's web UI) to add, edit, or remove blog posts. This adds an in-browser admin editor at `/admin` so the site owner can manage posts without touching git directly, while still going through the existing git-based build/deploy pipeline (every save is a real commit to `main`, which triggers the existing Actions workflow).

This supersedes the original site design's "no CMS" constraint — the owner now explicitly wants this capability.

## Architecture

`/admin` is a new page on the existing site, entirely client-rendered (`'use client'`) since the site is a static export with no server. It authenticates to GitHub directly from the browser using a Personal Access Token (PAT) the owner enters once, and reads/writes files under `content/blog/` in `SamanKC/samankc.com` on the `main` branch via GitHub's REST "Contents" API. A successful save is a real git commit, which triggers the existing GitHub Actions workflow (`.github/workflows/deploy.yml`) exactly as any other push does — there is no separate draft/staging state; saving is publishing.

The PAT is stored only in the browser's `localStorage`, never sent anywhere but `api.github.com`, and never baked into the built site (the admin page ships with no token embedded — it only reads what's in the visiting browser's own `localStorage`).

## Directory structure (new/changed files)

```
lib/
  github.ts               — GitHub Contents API client (list/get/create/update/delete files)
  github.test.ts          — unit tests for github.ts request-building, with fetch mocked
  renderMarkdown.ts        — extracted client-safe Markdown→HTML render function, shared by
                             lib/markdown.ts (build-time) and the admin preview (client-time)
app/
  admin/
    page.tsx               — admin route: metadata (robots: noindex), wires components together
components/
  admin/
    TokenGate.tsx           — PAT entry/storage gate, "forget token" action
    PostList.tsx             — lists existing posts (title/date/slug), links to edit, delete action, "New Post" button
    PostEditor.tsx           — create/edit form (title, date, excerpt, tags, Markdown body) with
                               live split-pane preview; Save commits via lib/github.ts
```

## Data model

No new persisted data types — the editor reads and writes the same `content/blog/*.md` frontmatter shape already defined by `BlogPost`/`parsePost` in `lib/markdown.ts` (`title`, `date`, `excerpt`, `tags`). The editor is a UI over that existing file format, not a new schema.

`lib/github.ts` works in terms of GitHub's Contents API shape: a file has a `path`, base64-encoded `content`, and (for updates/deletes) a `sha` identifying the version being replaced.

## Components

- **`lib/github.ts`**: a small, dependency-free wrapper around `https://api.github.com/repos/SamanKC/samankc.com/contents/{path}`:
  - `listPosts(token)` — `GET .../contents/content/blog`, returns file names + SHAs
  - `getPost(token, filename)` — `GET .../contents/content/blog/{filename}`, returns decoded content + SHA
  - `savePost(token, filename, content, sha?)` — `PUT .../contents/content/blog/{filename}` (create if `sha` omitted, update if provided)
  - `deletePost(token, filename, sha)` — `DELETE .../contents/content/blog/{filename}`
  - All requests set `Authorization: Bearer {token}` and a commit message (e.g. `"Update post: {filename}"` / `"Delete post: {filename}"`).
  - Throws a typed error with the HTTP status and GitHub's message on any non-2xx response, so callers can distinguish "bad token" (401/403) from other failures.

- **`lib/renderMarkdown.ts`**: extracts the `unified().use(remarkParse).use(remarkHtml).processSync(...)` call already in `lib/markdown.ts` into a standalone exported function, used by both `lib/markdown.ts` (build time, unchanged behavior) and `PostEditor.tsx`'s live preview (client time). Pure refactor — no behavior change for existing blog rendering.

- **`components/admin/TokenGate.tsx`**: on mount, checks `localStorage` for a saved token. If absent, renders a form prompting for a GitHub PAT with a short inline note on the minimal scope needed (fine-grained token, this repo only, Contents: read/write). Once entered, stores it and renders its `children` (the rest of the admin UI). Provides a small "Forget token" control that clears storage and re-prompts.

- **`components/admin/PostList.tsx`**: on mount, calls `listPosts`, then `getPost` for each file to parse frontmatter (via `gray-matter`, already a dependency and isomorphic) for display (title, date). Renders a sorted list (newest first) with Edit and Delete (with a confirm step) actions per row, and a "New Post" button. Delete calls `deletePost` and refreshes the list.

- **`components/admin/PostEditor.tsx`**: used for both create and edit. Fields: title (text), date (date input, defaults to today for new posts), excerpt (text), tags (comma-separated text input, split/joined to the `string[]` frontmatter shape), and a Markdown body textarea. Slug is auto-derived from the title (kebab-cased) for new posts, editable, and fixed (non-editable) once a post exists (changing a slug means changing the filename, which this design treats as delete-old + create-new — out of scope for v1; the field is simply read-only when editing). A side-by-side panel renders the current body through `renderMarkdown`, updating as the owner types. "Save" serializes the fields back into frontmatter + body (via `gray-matter`'s stringify) and calls `savePost`, passing the existing SHA when editing.

- **`app/admin/page.tsx`**: sets page `metadata` with `robots: { index: false, follow: false }`. Renders `TokenGate` wrapping either `PostList` or `PostEditor`, switching between them with simple local component state (no routing needed for this single, unlinked page).

## Data flow

Visit `/admin` → `TokenGate` checks for a stored PAT, prompts if missing → once unlocked, `PostList` loads and displays existing posts → owner clicks "New Post" or "Edit" on a row → `PostEditor` opens (empty for new, pre-filled for edit) with live preview → "Save" commits the file via `lib/github.ts` → GitHub's push triggers the existing `.github/workflows/deploy.yml` → the live site rebuilds and redeploys within its normal CI time, same as any other change to `main`.

## Error handling

- **401/403 from GitHub** (bad or expired token): surfaced as a clear "Your token isn't valid or has expired — please re-enter it," which re-triggers `TokenGate`'s prompt.
- **Other API failures** (network error, 404, 409 SHA mismatch, rate limit): shown inline as a dismissible error near the Save button; the form's current field values are preserved (never cleared on failure) so nothing typed is lost.
- **No merge-conflict UI**: this is a single-editor tool for one owner; a SHA-mismatch (409) is treated as a generic save failure the owner can retry after refreshing, not a special conflict-resolution flow.

## Testing

- `lib/github.test.ts`: unit tests for `listPosts`/`getPost`/`savePost`/`deletePost` — correct URLs, HTTP methods, headers, and request bodies, with global `fetch` mocked (following the project's existing Vitest conventions). Verifies error typing on non-2xx responses.
- `lib/renderMarkdown.test.ts`: can reuse/adapt the existing Markdown-rendering assertions already in `lib/markdown.test.ts` (heading/bold rendering) against the extracted function directly.
- `components/admin/*`: manually verified in the browser (create, edit, delete, live preview, token gate, error states) rather than unit-tested — consistent with how the rest of the site's interactive components were verified (`ThemeToggle`, `AnimatedSection`, and `Navbar` have real behavioral tests where the logic is self-contained; here the real integration point is GitHub's live API, which isn't meaningfully mockable at the component level without testing a fake).

## Out of scope for this version

- No slug/filename renaming (edit is in place; renaming = delete + recreate, done manually if ever needed).
- No image uploads or media library.
- No draft/staging state — every save is a live publish.
- No multi-user support, roles, or GitHub OAuth login flow.
- No editorial workflow (scheduling, review states).

## Security note (for the README / final walkthrough, not implementation)

The owner should create a **fine-grained** GitHub PAT scoped to only the `samankc.com` repository with **Contents: Read and write** permission (no broader access), rather than a classic token with full account access. This limits the blast radius if the token is ever exposed, since it's stored in browser `localStorage` on the owner's own machine(s).
