import { describe, it, expect } from 'vitest';
import { parsePost } from './markdown';

const RAW = `---
title: "Test Post"
date: "2024-01-15"
excerpt: "A short excerpt."
tags: ["testing", "markdown"]
---

# Heading

Some **content** here.
`;

describe('parsePost', () => {
  it('extracts frontmatter fields', () => {
    const post = parsePost(RAW, 'test-post');
    expect(post.slug).toBe('test-post');
    expect(post.title).toBe('Test Post');
    expect(post.date).toBe('2024-01-15');
    expect(post.excerpt).toBe('A short excerpt.');
    expect(post.tags).toEqual(['testing', 'markdown']);
  });

  it('renders the markdown body to HTML', () => {
    const post = parsePost(RAW, 'test-post');
    expect(post.contentHtml).toContain('<h1>Heading</h1>');
    expect(post.contentHtml).toContain('<strong>content</strong>');
  });

  it('computes a minimum reading time of 1 minute for short posts', () => {
    const post = parsePost(RAW, 'test-post');
    expect(post.readingTime).toBe('1 min read');
  });

  it('rounds up reading time for longer posts', () => {
    const longBody = `---
title: "Long Post"
date: "2024-01-15"
excerpt: "Long."
tags: []
---

${'word '.repeat(450)}`;
    const post = parsePost(longBody, 'long-post');
    expect(post.readingTime).toBe('2 min read');
  });
});
