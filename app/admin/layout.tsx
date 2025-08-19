import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { 
  Users, 
  FileText, 
  LayoutDashboard, 
  Settings, 
  TrendingUp, 
  BarChart, 
  Building, 
  LogOut,
  Bell,
  User
} from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  console.log('Admin layout - session:', JSON.stringify(session, null, 2));
  
  // Log session info but don't redirect - middleware handles redirects now
  console.log('Admin layout - user role:', session?.user?.role);
  
  // No need to redirect here - the middleware is handling all redirects
  // This prevents redirect loops between middleware and layout
  
  // We can assume that if we've reached this point, the user is authenticated
  // and has the admin role, because the middleware would have redirected otherwise

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
    >
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <aside className="w-64 bg-card shadow-md flex flex-col border-r border-border">
        <div className="p-4 border-b border-border flex items-center">
          <Image 
            src="/logo/Binate Logo wide sqr white.png" 
            alt="Binate Logo" 
            width={120} 
            height={40} 
            className="mr-2"
          />
          <h1 className="text-xl font-bold text-primary">Admin</h1>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">Main</p>
            <div className="space-y-1">
              <Link 
                href="/admin/dashboard" 
                className="flex items-center px-4 py-2 text-foreground hover:bg-accent rounded-md"
              >
                <LayoutDashboard className="h-4 w-4 mr-3" />
                Dashboard
              </Link>
              <Link 
                href="/admin/users" 
                className="flex items-center px-4 py-2 text-foreground hover:bg-accent rounded-md"
              >
                <Users className="h-4 w-4 mr-3" />
                Users
              </Link>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">Content</p>
            <div className="space-y-1">
              <Link 
                href="/admin/content" 
                className="flex items-center px-4 py-2 text-foreground hover:bg-accent rounded-md"
              >
                <FileText className="h-4 w-4 mr-3" />
                Content Management
              </Link>
              <Link 
                href="/admin/trends" 
                className="flex items-center px-4 py-2 text-foreground hover:bg-accent rounded-md"
              >
                <TrendingUp className="h-4 w-4 mr-3" />
                Trends
              </Link>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">Analytics</p>
            <div className="space-y-1">
              <Link 
                href="/admin/analytics" 
                className="flex items-center px-4 py-2 text-foreground hover:bg-accent rounded-md"
              >
                <BarChart className="h-4 w-4 mr-3" />
                Reports
              </Link>
              <Link 
                href="/admin/companies" 
                className="flex items-center px-4 py-2 text-foreground hover:bg-accent rounded-md"
              >
                <Building className="h-4 w-4 mr-3" />
                Companies
              </Link>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">System</p>
            <div className="space-y-1">
              <Link 
                href="/admin/settings" 
                className="flex items-center px-4 py-2 text-foreground hover:bg-accent rounded-md"
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Link>
              <Link 
                href="/admin/notifications" 
                className="flex items-center px-4 py-2 text-foreground hover:bg-accent rounded-md"
              >
                <Bell className="h-4 w-4 mr-3" />
                Notifications
              </Link>
            </div>
          </div>
        </nav>
        
        {/* User Profile Section */}
        <div className="border-t border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-accent rounded-full p-2 mr-2">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
            </div>
            <Link 
              href="/api/auth/signout" 
              className="text-destructive hover:text-destructive/80"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
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
      </div>
    </ThemeProvider>
  );
}
