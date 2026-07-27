import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import BlogCard from '@/components/BlogCard';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing on software engineering — replace with your real posts.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <AnimatedSection className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Blog</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">
        Placeholder intro copy for the blog page — replace with a real summary of what you write about.
      </p>
      <div className="mt-10 flex flex-col gap-6">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </AnimatedSection>
  );
}
