import Link from 'next/link';
import Image from 'next/image';
import type { Project } from '@/data/projects';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-violet-600 hover:shadow-lg dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-400"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={`Thumbnail image for the ${project.title} project`}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
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
      </div>
    </Link>
  );
}
