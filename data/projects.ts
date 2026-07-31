export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  techStack: string[];
  thumbnail: string;
  gallery: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
};

function thumbnailFor(slug: string) {
  return `https://picsum.photos/seed/${slug}/800/600`;
}

function galleryFor(slug: string) {
  return [1, 2, 3].map((n) => `https://picsum.photos/seed/${slug}-${n}/1200/800`);
}

export const projects: Project[] = [
  {
    slug: 'kinkhel',
    title: 'Kinkhel.com',
    shortDescription:
      'Fully functional e-commerce site with product listings, user management, and transactional features, built and managed end-to-end.',
    longDescription: [
      'Kinkhel.com is a fully functional e-commerce website covering product listings, user management, and transactional features.',
      'Managed end-to-end — from the underlying data model through to the customer-facing storefront.',
    ].join('\n\n'),
    techStack: ['Web', 'E-commerce', 'Full-Stack'],
    thumbnail: thumbnailFor('kinkhel'),
    gallery: galleryFor('kinkhel'),
    liveUrl: 'https://kinkhel.com',
    featured: true,
  },
  {
    slug: 'samd-edu-np',
    title: 'SAMD School Website',
    shortDescription: 'Responsive institutional school website covering content management and navigation.',
    longDescription: [
      'A responsive institutional website built for a school, covering content management and site navigation.',
      'Designed to be easy for non-technical staff to keep up to date.',
    ].join('\n\n'),
    techStack: ['Web', 'CMS', 'Responsive Design'],
    thumbnail: thumbnailFor('samd-edu-np'),
    gallery: galleryFor('samd-edu-np'),
    liveUrl: 'https://samd.edu.np',
    featured: false,
  },
  {
    slug: 'medical-pasal',
    title: 'Medical Pasal',
    shortDescription:
      'Cross-platform medical e-commerce app (final year project) with a Flutter frontend and Laravel REST API backend.',
    longDescription: [
      'Medical Pasal is a cross-platform medical e-commerce app built as a final year project, with a Flutter frontend backed by a Laravel REST API.',
      'Covers the full app experience — browsing, ordering, and account management — on both Android and iOS from a single Flutter codebase.',
    ].join('\n\n'),
    techStack: ['Flutter', 'Dart', 'Laravel', 'REST API'],
    thumbnail: thumbnailFor('medical-pasal'),
    gallery: galleryFor('medical-pasal'),
    githubUrl: 'https://github.com/samankc/FYPFrontendFinal',
    featured: true,
  },
  {
    slug: 'kabyu-books',
    title: 'Kabyu Books',
    shortDescription: 'Book browsing and reading app with real-time sync and user authentication.',
    longDescription: [
      'Kabyu Books is a Flutter app for browsing and reading books, backed by Firebase for real-time sync and user authentication.',
      'Focused on a smooth reading experience with data kept in sync across sessions.',
    ].join('\n\n'),
    techStack: ['Flutter', 'Dart', 'Firebase'],
    thumbnail: thumbnailFor('kabyu-books'),
    gallery: galleryFor('kabyu-books'),
    featured: false,
  },
  {
    slug: 'qr-code-generator',
    title: 'QR Code Generator',
    shortDescription:
      'Flutter app published on the Google Play Store — managed the full submission and release process independently.',
    longDescription: [
      'A Flutter-based QR code generator app, published on the Google Play Store.',
      'Managed the full submission and release process independently, end to end.',
    ].join('\n\n'),
    techStack: ['Flutter', 'Dart'],
    thumbnail: thumbnailFor('qr-code-generator'),
    gallery: galleryFor('qr-code-generator'),
    featured: true,
  },
  {
    slug: 'lorem-ipsum-generator',
    title: 'lorem_ipsum_generator',
    shortDescription: 'Flutter/Dart utility package published on pub.dev under the verified samankc.com.np publisher account.',
    longDescription: [
      'A Flutter/Dart utility package for generating placeholder Lorem Ipsum text, published on pub.dev.',
      'Published under the verified samankc.com.np publisher account.',
    ].join('\n\n'),
    techStack: ['Flutter', 'Dart', 'pub.dev'],
    thumbnail: thumbnailFor('lorem-ipsum-generator'),
    gallery: galleryFor('lorem-ipsum-generator'),
    liveUrl: 'https://pub.dev/packages/lorem_ipsum_generator',
    featured: false,
  },
  {
    slug: 'html-editor',
    title: 'HTML Editor',
    shortDescription: 'Mobile app for writing and previewing HTML code directly on-device, designed for beginner web developers.',
    longDescription: [
      'A Flutter mobile app that lets learners write and preview HTML code directly on-device.',
      'Designed for beginner web developers, letting them experiment with HTML without needing a full desktop setup.',
    ].join('\n\n'),
    techStack: ['Flutter', 'Dart'],
    thumbnail: thumbnailFor('html-editor'),
    gallery: galleryFor('html-editor'),
    featured: false,
  },
  {
    slug: 'income-tax-calculator-nepal',
    title: 'Income Tax Calculator Nepal',
    shortDescription: 'Flutter app that calculates Nepali income tax quickly and accurately to help with financial planning.',
    longDescription: [
      'Income Tax Calculator Nepal is a Flutter app that helps users calculate their income tax quickly and accurately.',
      'Especially useful for individuals who want to plan their finances and understand how much they need to set aside for taxes.',
    ].join('\n\n'),
    techStack: ['Flutter', 'Dart'],
    thumbnail: thumbnailFor('income-tax-calculator-nepal'),
    gallery: galleryFor('income-tax-calculator-nepal'),
    githubUrl: 'https://github.com/samankc/IncomeTaxCalculatorNepal',
    featured: false,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
