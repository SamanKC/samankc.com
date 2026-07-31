import { Mail } from 'lucide-react';
import { profile } from '@/data/profile';
import { GithubIcon, LinkedinIcon } from './icons';

const linkClassName =
  'flex h-11 w-11 items-center justify-center rounded-full border border-ink-200 text-ink-600 transition hover:border-ember-600 hover:text-ember-600 dark:border-ink-700 dark:text-ink-400 dark:hover:border-ember-400 dark:hover:text-ember-400';

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
