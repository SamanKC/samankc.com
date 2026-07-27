import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { formatDate } from '@/lib/formatDate';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    return { title: post.title, description: post.excerpt };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  try {
    post = getPostBySlug(slug);
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
