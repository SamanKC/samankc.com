import { Download } from 'lucide-react';
import { profile } from '@/data/profile';

export default function ResumeButton({ className }: { className?: string }) {
  return (
    <a
      href={profile.resumeUrl}
      download
      className={`inline-flex items-center gap-2 rounded-md bg-ember-600 px-6 py-3 font-display font-semibold text-white transition hover:opacity-90 dark:bg-ember-400 dark:text-ink-950 ${className ?? ''}`}
    >
      <Download className="h-4 w-4" />
      Download Resume
    </a>
  );
}
