import Link from 'next/link';
import { profile } from '@/data/profile';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/60 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <div className="flex gap-6">
          <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 dark:hover:text-cyan-400">
            GitHub
          </a>
          <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 dark:hover:text-cyan-400">
            LinkedIn
          </a>
          <a href={`mailto:${profile.social.email}`} className="hover:text-violet-600 dark:hover:text-cyan-400">
            Email
          </a>
          <Link href="/contact" className="hover:text-violet-600 dark:hover:text-cyan-400">
            Contact
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
