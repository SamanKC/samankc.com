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
