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
    return <p className="mx-auto max-w-5xl px-6 py-12 text-slate-500 dark:text-slate-400">Loading post…</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <button type="button" onClick={handleBack} className="text-sm font-semibold text-violet-600 dark:text-cyan-400">
        &larr; Back to posts
      </button>
      <h1 className="mt-4 font-display text-2xl font-bold text-slate-900 dark:text-white">
        {isNew ? 'New Post' : 'Edit Post'}
      </h1>

      {error && (
        <div className="mt-4">
          <p className="text-sm text-red-500">{error}</p>
          {isAuthError && (
            <button
              type="button"
              onClick={onInvalidToken}
              className="mt-2 text-sm font-semibold text-violet-600 dark:text-cyan-400"
            >
              Re-enter token
            </button>
          )}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
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
            onChange={(e) => {
              setDate(e.target.value);
              setDirty(true);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Tags (comma-separated)
          <input
            type="text"
            value={tags}
            onChange={(e) => {
              setTags(e.target.value);
              setDirty(true);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300 sm:col-span-2">
          Excerpt
          <input
            type="text"
            value={excerpt}
            onChange={(e) => {
              setExcerpt(e.target.value);
              setDirty(true);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-white/20 dark:bg-slate-900 dark:text-white"
          />
        </label>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
          Body (Markdown)
          <textarea
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setDirty(true);
            }}
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
