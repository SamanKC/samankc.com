import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ThemeProvider from './ThemeProvider';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  it('toggles the html class between dark and light on click', async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = await screen.findByRole('button', { name: /switch to light mode/i });
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    fireEvent.click(button);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });
});
