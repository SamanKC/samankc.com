import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: {
    default: 'Your Name Here — Software Engineer',
    template: '%s | Your Name Here',
  },
  description: 'Portfolio of Your Name Here — software engineer. Projects, writing, and background.',
  openGraph: {
    title: 'Your Name Here — Software Engineer',
    description: 'Portfolio of Your Name Here — software engineer. Projects, writing, and background.',
    images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Your Name Here — Software Engineer' }],
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="bg-white font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
