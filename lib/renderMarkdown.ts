import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';

export function renderMarkdown(content: string): string {
  return unified().use(remarkParse).use(remarkHtml).processSync(content).toString();
}
