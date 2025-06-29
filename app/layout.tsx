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