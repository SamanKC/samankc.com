import { describe, it, expect } from 'vitest';
import { projects, getProjectBySlug, getFeaturedProjects } from './projects';

describe('projects data', () => {
  it('has at least one project, all with unique slugs', () => {
    expect(projects.length).toBeGreaterThan(0);
    const slugs = new Set(projects.map((p) => p.slug));
    expect(slugs.size).toBe(projects.length);
  });

  it('getProjectBySlug returns the matching project', () => {
    const project = getProjectBySlug(projects[0].slug);
    expect(project?.title).toBe(projects[0].title);
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
