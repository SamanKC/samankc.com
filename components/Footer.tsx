import Link from 'next/link';
import SocialLinks from './SocialLinks';
import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <SocialLinks />
        <Link href="/contact" className="hover:text-violet-600 dark:hover:text-cyan-400">
          Contact
        </Link>
        <p>
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.{' '}
          <Link href="/admin" className="text-slate-400 hover:text-violet-600 dark:text-slate-600 dark:hover:text-cyan-400">
            Admin
          </Link>
        </p>
      </div>
    </footer>
  );
}
