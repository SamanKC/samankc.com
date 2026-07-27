import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { projects, getProjectBySlug } from '@/data/projects';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.shortDescription,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-4xl px-6 py-20">
      <Link href="/projects" className="text-sm font-semibold text-violet-600 dark:text-cyan-400">
        &larr; All projects
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
        {project.title}
      </h1>

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

      <div className="mt-6 flex flex-wrap gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            <ExternalLink className="h-4 w-4" /> Live Demo
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:border-violet-600 hover:text-violet-600 dark:border-white/20 dark:text-slate-200 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
          >
            <GithubIcon /> GitHub
          </a>
        )}
      </div>

      <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl">
        <Image
          src={project.thumbnail}
          alt={`Main preview image for the ${project.title} project`}
          fill
          className="object-cover"
        />
      </div>

      <div className="prose prose-slate mt-10 max-w-none dark:prose-invert">
        {project.longDescription.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {project.gallery.map((image, i) => (
          <div key={image} className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src={image}
              alt={`Gallery image ${i + 1} for the ${project.title} project`}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </article>
  );
}
