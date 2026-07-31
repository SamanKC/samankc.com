'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MobileMenu from './MobileMenu';
import { NAV_LINKS } from './navLinks';
import { profile } from '@/data/profile';

const normalize = (p: string) => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p);

export default function Navbar() {
  const pathname = usePathname();
  const currentPath = normalize(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-ink-50 dark:border-ink-700 dark:bg-ink-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold text-ink-950 dark:text-ink-100">
          {profile.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === '/' ? currentPath === '/' : currentPath.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-display text-sm font-medium transition hover:text-ember-600 dark:hover:text-ember-400 ${
                  isActive ? 'text-ember-600 dark:text-ember-400' : 'text-ink-600 dark:text-ink-400'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-600 dark:text-ink-400 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
