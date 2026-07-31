import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import SocialLinks from '@/components/SocialLinks';
import ResumeButton from '@/components/ResumeButton';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with ${profile.name}.`,
  openGraph: {
    title: 'Contact',
    description: `Get in touch with ${profile.name}.`,
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-bold text-ink-950 dark:text-ink-100 sm:text-4xl">Get in Touch</h1>
      <p className="mt-4 text-ink-600 dark:text-ink-400">
        Whether it's a role, a project, or just a question — email or LinkedIn is the fastest way to reach me.
      </p>
      <div className="mt-8">
        <SocialLinks />
      </div>
      <ResumeButton className="mt-8" />
    </div>
  );
}
