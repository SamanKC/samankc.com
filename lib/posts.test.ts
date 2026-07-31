import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug } from './posts';

describe('getAllPosts', () => {
  it('reads at least one post', () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
  });

  it('sorts posts by date descending', () => {
    const posts = getAllPosts();
    const dates = posts.map((p) => p.date);
    const sorted = [...dates].sort().reverse();
    expect(dates).toEqual(sorted);
  });
});

describe('getPostBySlug', () => {
  it('returns the matching post', () => {
    const post = getPostBySlug('comptia1202-lesson1');
    expect(post.title).toBe('Understanding the Windows Boot Process: A Complete Guide for CompTIA A+');
    expect(post.tags).toContain('comptia-a+');
  });

  it('throws for a missing slug', () => {
    expect(() => getPostBySlug('does-not-exist')).toThrow();
  });
});
