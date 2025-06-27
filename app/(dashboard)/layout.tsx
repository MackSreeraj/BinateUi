'use client';

import { 
  Home, 
  Users, 
  Building2, 
  PenTool, 
  MonitorPlay, 
  TrendingUp,
  Wrench,
  Lightbulb,
  Settings,
  List
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigationItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Users, label: 'Users', href: '/users' },
    { icon: Building2, label: 'Company Profiles', href: '/company-profiles' },
    { icon: PenTool, label: 'Writer Profiles', href: '#' },
    { icon: MonitorPlay, label: 'Platform Profiles', href: '#' },
    { icon: TrendingUp, label: 'Trends List', href: '#' },
    { icon: Wrench, label: 'Trend Workshop', href: '#' },
    { icon: List, label: 'Ideas List', href: '#' },
    { icon: Lightbulb, label: 'Idea Workshop', href: '#' },
    { icon: Settings, label: 'Content Pipeline', href: '#' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex h-16 items-center justify-center">
          <h1 className="text-2xl font-bold">Binate</h1>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 border-r bg-muted/20 min-h-[calc(100vh-4rem)]">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-green-500">AI Content System N8N</h2>
            </div>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const pathname = usePathname();
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActive 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
