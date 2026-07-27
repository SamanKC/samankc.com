import '@testing-library/jest-dom/vitest';

// jsdom does not implement window.matchMedia. next-themes calls it
// unconditionally (even with enableSystem={false}), so polyfill a minimal
// stub for the test environment.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}

// jsdom does not implement IntersectionObserver. framer-motion's
// `whileInView` feature (used by AnimatedSection) constructs one as soon as
// the component mounts, regardless of reduced-motion state, so polyfill a
// minimal stub for the test environment.
if (typeof window !== 'undefined' && !window.IntersectionObserver) {
  class MockIntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly scrollMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe = () => {};
    unobserve = () => {};
    disconnect = () => {};
    takeRecords = () => [];
  }
  window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}
