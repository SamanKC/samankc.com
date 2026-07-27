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
