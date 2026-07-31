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
