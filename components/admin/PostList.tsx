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
