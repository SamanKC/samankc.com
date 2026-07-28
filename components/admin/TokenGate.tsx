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
