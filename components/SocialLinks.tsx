import { Mail } from 'lucide-react';
import { profile } from '@/data/profile';
import { GithubIcon, LinkedinIcon } from './icons';

const linkClassName =
  'flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-violet-600 hover:text-violet-600 dark:border-white/10 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400';

export default function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className ?? ''}`}>
      <a
        href={profile.social.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className={linkClassName}
      >
        <GithubIcon />
      </a>
      <a
        href={profile.social.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className={linkClassName}
      >
        <LinkedinIcon />
      </a>
      <a
        href={`mailto:${profile.social.email}`}
        aria-label="Email"
        className={linkClassName}
      >
        <Mail className="h-5 w-5" />
      </a>
    </div>
  );
}
