export type Profile = {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  bio: string[];
  social: { github: string; linkedin: string; email: string };
  resumeUrl: string;
};

export const profile: Profile = {
  name: 'Your Name Here',
  title: 'Software Engineer',
  tagline: 'I build fast, thoughtful products for the web.',
  intro:
    'Placeholder intro — replace with a short, punchy summary of who you are and what you do.',
  bio: [
    'Placeholder bio paragraph one — replace with your real background, what got you into software, and what you care about as an engineer.',
    'Placeholder bio paragraph two — replace with more detail on your focus areas, the kinds of problems you like solving, and what you are doing now.',
  ],
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
    email: 'you@example.com',
  },
  resumeUrl: '/resume-placeholder.pdf',
};
