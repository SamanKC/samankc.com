import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

export function renderMarkdown(content: string): string {
  return unified().use(remarkParse).use(remarkGfm).use(remarkHtml).processSync(content).toString();
}
