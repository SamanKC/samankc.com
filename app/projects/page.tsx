import type { Metadata } from 'next';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A selection of projects — replace with your real project portfolio.',
  openGraph: {
    title: 'Projects',
    description: 'A selection of projects — replace with your real project portfolio.',
  },
};

export default function ProjectsPage() {
  return (
    <AnimatedSection className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Projects</h1>
      <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
        Placeholder intro copy for the projects page — replace with a real summary of your work.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </AnimatedSection>
  );
}
