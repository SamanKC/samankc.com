import { describe, it, expect } from 'vitest';
import { renderMarkdown } from './renderMarkdown';

describe('renderMarkdown', () => {
  it('renders headings to HTML', () => {
    const html = renderMarkdown('# Heading');
    expect(html).toContain('<h1>Heading</h1>');
  });

  it('renders bold text to HTML', () => {
    const html = renderMarkdown('Some **content** here.');
    expect(html).toContain('<strong>content</strong>');
  });
});
