export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  thumbnail: string;
  gallery: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
};

function thumbnailFor(slug: string) {
  return `https://picsum.photos/seed/${slug}/800/600`;
}

function galleryFor(slug: string) {
  return [1, 2, 3].map((n) => `https://picsum.photos/seed/${slug}-${n}/1200/800`);
}

const LONG_DESCRIPTION_PLACEHOLDER = [
  'This is placeholder case-study copy. Replace it with a real writeup of the problem this project solved.',
  'A second placeholder paragraph — describe your approach, key technical decisions, and any interesting tradeoffs.',
  'A third placeholder paragraph — describe the outcome, what you learned, and what you would do differently.',
].join('\n\n');

export const projects: Project[] = [
  {
    slug: 'realtime-analytics-dashboard',
    title: 'Realtime Analytics Dashboard',
    shortDescription: 'Placeholder description of a realtime analytics dashboard project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['React', 'TypeScript', 'Node.js', 'WebSockets'],
    thumbnail: thumbnailFor('realtime-analytics-dashboard'),
    gallery: galleryFor('realtime-analytics-dashboard'),
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/realtime-analytics-dashboard',
    featured: true,
  },
  {
    slug: 'ai-recipe-generator',
    title: 'AI Recipe Generator',
    shortDescription: 'Placeholder description of an AI-powered recipe generator project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['Next.js', 'TypeScript', 'OpenAI API'],
    thumbnail: thumbnailFor('ai-recipe-generator'),
    gallery: galleryFor('ai-recipe-generator'),
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/ai-recipe-generator',
    featured: true,
  },
  {
    slug: 'distributed-task-queue',
    title: 'Distributed Task Queue',
    shortDescription: 'Placeholder description of a distributed task queue project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['Go', 'Redis', 'Docker'],
    thumbnail: thumbnailFor('distributed-task-queue'),
    gallery: galleryFor('distributed-task-queue'),
    githubUrl: 'https://github.com/yourusername/distributed-task-queue',
    featured: true,
  },
  {
    slug: 'personal-finance-tracker',
    title: 'Personal Finance Tracker',
    shortDescription: 'Placeholder description of a personal finance tracker project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['React Native', 'TypeScript', 'SQLite'],
    thumbnail: thumbnailFor('personal-finance-tracker'),
    gallery: galleryFor('personal-finance-tracker'),
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/yourusername/personal-finance-tracker',
    featured: false,
  },
  {
    slug: 'markdown-note-sync',
    title: 'Markdown Note Sync',
    shortDescription: 'Placeholder description of a markdown note-syncing tool project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['Rust', 'CLI', 'S3'],
    thumbnail: thumbnailFor('markdown-note-sync'),
    gallery: galleryFor('markdown-note-sync'),
    githubUrl: 'https://github.com/yourusername/markdown-note-sync',
    featured: false,
  },
  {
    slug: 'open-source-cli-toolkit',
    title: 'Open Source CLI Toolkit',
    shortDescription: 'Placeholder description of an open source CLI toolkit project.',
    longDescription: LONG_DESCRIPTION_PLACEHOLDER,
    techStack: ['Node.js', 'TypeScript'],
    thumbnail: thumbnailFor('open-source-cli-toolkit'),
    gallery: galleryFor('open-source-cli-toolkit'),
    githubUrl: 'https://github.com/yourusername/open-source-cli-toolkit',
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
