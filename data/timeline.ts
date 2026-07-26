export type TimelineEntry = {
  kind: 'job' | 'education' | 'achievement';
  title: string;
  organization: string;
  dateRange: string;
  description: string;
};

export const timeline: TimelineEntry[] = [
  {
    kind: 'job',
    title: 'Senior Software Engineer',
    organization: 'Company Name Here',
    dateRange: '2024 — Present',
    description: 'Placeholder description of responsibilities and impact in this role.',
  },
  {
    kind: 'achievement',
    title: 'Speaker, Example Tech Conference',
    organization: 'Example Tech Conference',
    dateRange: '2023',
    description: 'Placeholder description of the talk given and its topic.',
  },
  {
    kind: 'job',
    title: 'Software Engineer',
    organization: 'Previous Company Name',
    dateRange: '2021 — 2024',
    description: 'Placeholder description of responsibilities and impact in this role.',
  },
  {
    kind: 'achievement',
    title: 'Published Open Source Project with 1k+ Stars',
    organization: 'GitHub',
    dateRange: '2020',
    description: 'Placeholder description of the project and its adoption.',
  },
  {
    kind: 'education',
    title: 'B.S. in Computer Science',
    organization: 'University Name Here',
    dateRange: '2017 — 2021',
    description: 'Placeholder description of coursework, honors, or activities.',
  },
  {
    kind: 'job',
    title: 'Software Engineering Intern',
    organization: 'Internship Company Name',
    dateRange: '2020',
    description: 'Placeholder description of responsibilities and impact in this role.',
  },
];
