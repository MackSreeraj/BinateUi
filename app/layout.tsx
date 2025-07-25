import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { FontErrorBoundary } from '@/components/FontErrorBoundary';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
});

export const metadata: Metadata = {
  title: 'Binate - AI Content Engine',
  description: 'AI-Enhanced Content Creation System for Businesses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <FontErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                unstyled: false,
                classNames: {
                  toast: 'bg-gray-800 text-white border border-gray-700 rounded-lg p-4 shadow-lg',
                  title: 'font-medium',
                  description: 'text-gray-300',
                  actionButton: 'bg-blue-600 hover:bg-blue-700 text-white',
                  cancelButton: 'bg-gray-700 hover:bg-gray-600 text-white',
                },
              }}
            />
          </ThemeProvider>
        </FontErrorBoundary>
      </body>
    </html> 
  );
}