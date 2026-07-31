import type { Metadata } from 'next';
import Link from 'next/link';
import { profile } from '@/data/profile';
import { getFeaturedProjects } from '@/data/projects';
import AnimatedSection from '@/components/AnimatedSection';
import ProjectCard from '@/components/ProjectCard';

export const metadata: Metadata = {
  title: 'Home',
  description: profile.tagline,
  openGraph: {
    title: 'Home',
    description: profile.tagline,
  },
};

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center sm:pt-32">
        <p className="font-display text-sm font-semibold uppercase tracking-widest text-ember-600 dark:text-ember-400">
          {profile.title}
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink-950 dark:text-ink-100 sm:text-6xl">
          {profile.name}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-600 dark:text-ink-400">{profile.intro}</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/projects"
            className="rounded-md bg-ember-600 px-8 py-3 font-display font-semibold text-white transition hover:opacity-90 dark:bg-ember-400 dark:text-ink-950"
          >
            View Projects
          </Link>
          <Link
            href="/about"
            className="rounded-md border border-ink-200 px-8 py-3 font-display font-semibold text-ink-700 transition hover:border-ember-600 hover:text-ember-600 dark:border-ink-700 dark:text-ink-200 dark:hover:border-ember-400 dark:hover:text-ember-400"
          >
            About & Resume
          </Link>
        </div>
      </section>

      <AnimatedSection className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink-950 dark:text-ink-100 sm:text-3xl">
            Featured Projects
          </h2>
          <Link href="/projects" className="font-display text-sm font-semibold text-ember-600 dark:text-ember-400">
            View all &rarr;
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </AnimatedSection>
    </>
  );
}
