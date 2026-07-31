import Link from 'next/link';
import type { Project } from '@/data/projects';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-md border border-ink-200 bg-white p-5 transition hover:border-ember-600 dark:border-ink-700 dark:bg-ink-900 dark:hover:border-ember-400"
    >
      <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-ink-100">{project.title}</h3>
      <p className="mt-2 text-sm text-ink-600 dark:text-ink-400">{project.shortDescription}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-md bg-ink-100 px-3 py-1 font-display text-xs font-medium text-ember-600 dark:bg-ink-800 dark:text-ember-400"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
