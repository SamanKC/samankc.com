import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import { timeline } from '@/data/timeline';
import TimelineItem from '@/components/TimelineItem';
import ResumeButton from '@/components/ResumeButton';
import AnimatedSection from '@/components/AnimatedSection';

export const metadata: Metadata = {
  title: 'About',
  description: `About ${profile.name} — background, experience, and education.`,
  openGraph: {
    title: 'About',
    description: `About ${profile.name} — background, experience, and education.`,
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="font-display text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">About</h1>
      <div className="mt-6 space-y-4 text-slate-600 dark:text-slate-300">
        {profile.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <ResumeButton className="mt-8" />

      <AnimatedSection className="mt-16">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Experience & Education</h2>
        <div className="mt-8">
          {timeline.map((entry, i) => (
            <TimelineItem key={i} entry={entry} />
          ))}
        </div>
      </AnimatedSection>
    </div>
  );
}
