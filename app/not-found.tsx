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
