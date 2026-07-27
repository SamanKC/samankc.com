export type TimelineEntry = {
  kind: 'job' | 'education' | 'achievement';
  title: string;
  organization: string;
  dateRange: string;
  description: string;
};

export const timeline: TimelineEntry[] = [
  {
    kind: 'education',
    title: 'Master of Information Technology (MIT)',
    organization: "King's Own Institute, Sydney, Australia",
    dateRange: '2024 — 2026',
    description:
      'Full-time postgraduate study building on a computing background, with coursework spanning software engineering, systems, and applied development.',
  },
  {
    kind: 'job',
    title: 'Java Lecturer (Part-time)',
    organization: 'Itahari Namuna College, Nepal',
    dateRange: 'Aug 2022 — Jan 2024',
    description:
      'Delivered Java programming instruction to 30+ students per cohort, covering core language fundamentals, OOP principles, and hands-on coding practice. Designed coding assessments and evaluated student projects, and resolved software/environment issues during live lab sessions.',
  },
  {
    kind: 'job',
    title: 'Flutter Developer and Intern Supervisor',
    organization: 'Thulo Technology, Nepal',
    dateRange: 'Jan 2023 — Apr 2023',
    description:
      'Designed and developed cross-platform mobile applications using Flutter and Dart, including an HTML editor app that let learners write and preview code directly on-device. Diagnosed and fixed build, performance, and cross-platform compatibility issues, and supervised a team of interns on development practices.',
  },
  {
    kind: 'job',
    title: 'Software Engineer',
    organization: 'Innovate Tech',
    dateRange: 'Jan 2022 — Apr 2022',
    description:
      'Built front-end state management with Redux for a production React application, replacing scattered component state with a single predictable data flow. Reviewed peer code and flagged issues before merge, helping the team hold a consistent quality bar inside a fast-moving Agile sprint cycle.',
  },
  {
    kind: 'education',
    title: 'Bachelor of Science in Computing (Hons)',
    organization: 'Itahari International College, Nepal',
    dateRange: '2018 — 2021',
    description:
      'Undergraduate honours degree covering the foundations of programming, systems, and software development practices.',
  },
  {
    kind: 'job',
    title: 'Flutter Developer (Internship)',
    organization: 'Featherwebs Pvt. Ltd., Nepal',
    dateRange: 'Jul 2020 — Dec 2020',
    description:
      'Owned the Books Reader app from requirements through deployment, delivering a complete cross-platform build as a solo intern contributor. Tested device compatibility across multiple hardware configurations and resolved environment-specific bugs before release.',
  },
];
