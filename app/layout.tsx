import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { profile } from '@/data/profile';

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
});
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
});

const siteTitle = `${profile.name} — ${profile.title}`;
const siteDescription = `Portfolio of ${profile.name} — ${profile.title.toLowerCase()}. Projects, writing, and background.`;

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain-here.com'),
  title: {
    default: siteTitle,
    template: '%s | ' + profile.name,
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: siteTitle }],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable} ${ibmPlexSans.variable}`} suppressHydrationWarning>
      <body className="bg-ink-50 font-sans text-ink-950 antialiased dark:bg-ink-950 dark:text-ink-100">
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
