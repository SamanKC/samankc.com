import Link from 'next/link';
import SocialLinks from './SocialLinks';
import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 py-10 dark:border-ink-700">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-sm text-ink-600 dark:text-ink-400">
        <SocialLinks />
        <Link href="/contact" className="font-display hover:text-ember-600 dark:hover:text-ember-400">
          Contact
        </Link>
        <p>
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
