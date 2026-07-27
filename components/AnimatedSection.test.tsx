import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnimatedSection from './AnimatedSection';

const mockUseReducedMotion = vi.fn();

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual<typeof import('framer-motion')>('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => mockUseReducedMotion(),
  };
});

describe('AnimatedSection', () => {
  it('starts hidden (opacity 0) when motion is not reduced', () => {
    mockUseReducedMotion.mockReturnValue(false);
    const { container } = render(<AnimatedSection>content</AnimatedSection>);
    expect(container.firstChild).toHaveStyle({ opacity: '0' });
  });

  it('is immediately visible when motion is reduced', () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { container } = render(<AnimatedSection>content</AnimatedSection>);
    expect(container.firstChild).toHaveStyle({ opacity: '1' });
  });
});
