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
  name: 'Saman KC',
  title: 'Software Developer',
  tagline: 'Building and shipping cross-platform apps, from Flutter to React.',
  intro:
    'Software developer with a Master of Information Technology and hands-on experience building and shipping cross-platform mobile and web applications — from Flutter and React through to published apps on Google Play and pub.dev.',
  bio: [
    'Software developer with a Master of Information Technology and hands-on experience building and shipping cross-platform mobile and web applications. Background spans Flutter, Java, and React across development, teaching, and mentoring roles, with published apps on Google Play and pub.dev.',
    'Works across the full build cycle, from requirements through deployment and release — including diagnosing cross-platform compatibility issues, reviewing peer code to hold a consistent quality bar, and mentoring other developers along the way.',
  ],
  social: {
    github: 'https://github.com/samankc',
    linkedin: 'https://linkedin.com/in/saman-kc',
    email: 'saman.kc1641@gmail.com',
  },
  resumeUrl: '/resume-placeholder.pdf',
};
