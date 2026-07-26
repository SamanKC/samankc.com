import { describe, it, expect } from 'vitest';
import { projects, getProjectBySlug, getFeaturedProjects } from './projects';

describe('projects data', () => {
  it('has six projects with unique slugs', () => {
    expect(projects).toHaveLength(6);
    const slugs = new Set(projects.map((p) => p.slug));
    expect(slugs.size).toBe(6);
  });

  it('getProjectBySlug returns the matching project', () => {
    const project = getProjectBySlug('realtime-analytics-dashboard');
    expect(project?.title).toBe('Realtime Analytics Dashboard');
  });

  it('getProjectBySlug returns undefined for an unknown slug', () => {
    expect(getProjectBySlug('does-not-exist')).toBeUndefined();
  });

  it('getFeaturedProjects returns only featured projects', () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });
});
