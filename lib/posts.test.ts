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
    const post = getPostBySlug('why-type-safety-matters');
    expect(post.title).toBe('Why Type Safety Matters More Than You Think');
    expect(post.tags).toEqual(['typescript', 'engineering']);
  });
});
