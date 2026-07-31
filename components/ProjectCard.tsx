import Link from 'next/link';
import type { Project } from '@/data/projects';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:border-violet-600 hover:shadow-lg dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-400"
    >
      <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{project.title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.shortDescription}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-cyan-400/10 dark:text-cyan-300"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
