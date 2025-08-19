import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

// This is a separate layout for the admin login page only
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      {/* Simple layout with no sidebar or admin dashboard elements */}
      <div className="min-h-screen bg-background">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            unstyled: false,
            classNames: {
              toast: 'bg-background text-foreground border-border',
              title: 'text-foreground',
              description: 'text-muted-foreground',
              actionButton: 'bg-primary text-primary-foreground',
              cancelButton: 'bg-muted text-muted-foreground',
              error: 'bg-destructive text-destructive-foreground',
              success: 'bg-success text-success-foreground',
            },
          }}
        />
      </div>
    </ThemeProvider>
  );
}
