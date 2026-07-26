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
