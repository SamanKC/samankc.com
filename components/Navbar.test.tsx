import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Navbar from './Navbar';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navbar', () => {
  it('opens and closes the mobile menu', async () => {
    render(<Navbar />);

    const openButton = screen.getByRole('button', { name: /open menu/i });
    fireEvent.click(openButton);

    const closeButton = screen.getByRole('button', { name: /close menu/i });
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);

    // MobileMenu unmounts via framer-motion's AnimatePresence exit animation,
    // which completes asynchronously (not within the same tick as the click),
    // so we wait for the close button to actually leave the DOM.
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument();
    });
  });
});
