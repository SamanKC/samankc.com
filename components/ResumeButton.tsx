import { Download } from 'lucide-react';
import { profile } from '@/data/profile';

export default function ResumeButton({ className }: { className?: string }) {
  return (
    <a
      href={profile.resumeUrl}
      download
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-400 px-6 py-3 font-semibold text-white transition hover:opacity-90 ${className ?? ''}`}
    >
      <Download className="h-4 w-4" />
      Download Resume
    </a>
  );
}
