import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { FontErrorBoundary } from '@/components/FontErrorBoundary';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: 'AI Content System - Wind Growth',
  description: 'AI-Enhanced Operating Systems for Fast-Growth Service Businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <FontErrorBoundary>
          <ThemeProvider
          attribute="class"
          defaultTheme="dark"
            forcedTheme="dark"
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </FontErrorBoundary>
      </body>
    </html> 
  );
}