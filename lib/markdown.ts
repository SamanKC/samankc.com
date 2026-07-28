import matter from 'gray-matter';
import { renderMarkdown } from './renderMarkdown';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readingTime: string;
  contentHtml: string;
};

const WORDS_PER_MINUTE = 200;

function computeReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

export function parsePost(raw: string, slug: string): BlogPost {
  const { data, content } = matter(raw);
  const contentHtml = renderMarkdown(content);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string,
    tags: (data.tags as string[]) ?? [],
    readingTime: computeReadingTime(content),
    contentHtml,
  };
}
