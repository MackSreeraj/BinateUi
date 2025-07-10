'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Calendar,
  List,
  Leaf,
  ExternalLink,
  Play,
  BookOpen,
  Phone,
  FileText,
  Zap
} from 'lucide-react';

const navigationItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Users, label: 'Users' },
  { icon: Building2, label: 'Company Profiles' },
  { icon: PenTool, label: 'Writer Profiles' },
  { icon: MonitorPlay, label: 'Platform Profiles' },
  { icon: TrendingUp, label: 'Trends List' },
  { icon: Wrench, label: 'Trend Workshop' },
  { icon: List, label: 'Ideas List' },
  { icon: Lightbulb, label: 'Idea Workshop' },
  { icon: Settings, label: 'Content Pipeline' },
];

const contentEngineCards = [
  {
    icon: Users,
    title: 'Users',
    description: 'Manage user accounts and permissions for your content team'
  },
  {
    icon: Building2,
    title: 'Company Profiles',
    description: 'Define brand voice, tone, and company-specific guidelines'
  },
  {
    icon: PenTool,
    title: 'Writer Profiles',
    description: 'Set up writer personas and content creation preferences'
  },
  {
    icon: MonitorPlay,
    title: 'Platform Profiles',
    description: 'Configure publishing settings for different social platforms'
  },
  {
    icon: Calendar,
    title: 'Content Calendar',
    description: 'Schedule and organize your content publishing timeline'
  },
  {
    icon: TrendingUp,
    title: 'Trends List',
    description: 'Track industry trends and viral content opportunities'
  },
  {
    icon: List,
    title: 'Ideas List',
    description: 'Collect and organize content ideas from various sources'
  },
];

const resourceLinks = [
  {
    icon: Play,
    title: 'AI Content Engine Presentation',
    external: true
  },
  {
    icon: Play,
    title: 'Installation Video',
    external: true
  },
  {
    icon: Zap,
    title: 'AI Content Engine Gamma',
    external: true
  },
  {
    icon: ExternalLink,
    title: 'Wind Growth Website',
    external: true
  },
  {
    icon: Phone,
    title: 'Book a Meeting With Us',
    external: true
  },
  {
    icon: FileText,
    title: 'Free Onboarding Template',
    external: true
  },
  {
    icon: Settings,
    title: 'Start Using N8N Now',
    external: true
  },
  {
    icon: ExternalLink,
    title: 'Make.com Link',
    external: true
  },
];

// Import the content components
import UsersContent from './components/UsersContent';
import CompanyProfilesContent from './components/CompanyProfilesContent';
import WriterProfilesContent from './components/WriterProfilesContent';
import PlatformProfilesContent from './components/PlatformProfilesContent';
import TrendsListContent from './components/TrendsListContent';
import TrendWorkshopContent from './components/TrendWorkshopContent';
import ContentList from './components/ContentList';

// Add a type for the content components
type ContentComponents = {
  [key: string]: () => JSX.Element;
};

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeNav, setActiveNav] = useState('Home');

  // Update active nav based on URL
  useEffect(() => {
    const nav = searchParams.get('tab');
    if (nav) {
      setActiveNav(nav);
    }
  }, [searchParams]);

  // Update URL when active nav changes
  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', nav);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Define the content components
  const contentComponents: ContentComponents = {
    'Home': () => (
      <>
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Home className="h-5 w-5" />
            <h1 className="text-2xl font-bold">Home</h1>
          </div>
          <p className="text-muted-foreground">
            Smart content, crafted for your brand—powered by your profile, tone, and channels.
          </p>
          <div className="mt-2">
            <Button variant="link" className="px-0 text-xs text-muted-foreground h-auto">
              Made with love by <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">AI Content Engine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contentEngineCards.map((card) => {
              const Icon = card.icon;
              return (
                <Card 
                  key={card.title} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleNavClick(card.title)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                        <Icon className="h-4 w-4" />
                      </div>
                      <CardTitle className="text-base">{card.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </>
    ),
    'Users': () => <UsersContent />,
    'Company Profiles': () => <CompanyProfilesContent />,
    'Writer Profiles': () => <WriterProfilesContent />,
    'Platform Profiles': () => <PlatformProfilesContent />,
    'Trends List': () => <TrendsListContent />,
    'Trend Workshop': () => <TrendWorkshopContent />,
    'Content List': () => <ContentList />,
    // Add other content components here as needed
  };

  // Get the current content component or default to Home
  const CurrentContent = contentComponents[activeNav] || contentComponents['Home'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex h-16 items-center justify-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            Binate
          </h1>
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
                const isActive = activeNav === item.label;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNavClick(item.label)}
                    className={`flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                      isActive 
                        ? 'bg-accent text-accent-foreground' 
                        : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6`}>
          <CurrentContent />
        </main>

        {/* Right Sidebar - Only shown on Home page */}
        {activeNav === 'Home' && (
          <aside className="w-80 border-l bg-muted/20 min-h-[calc(100vh-4rem)]">
            <div className="p-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Welcome to the AI Content Engine Interface</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-green-500">Resources</h4>
                    <div className="space-y-2">
                      {resourceLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Button
                            key={link.title}
                            variant="ghost"
                            className="w-full justify-start h-auto p-2 text-xs"
                          >
                            <Icon className="mr-2 h-3 w-3" />
                            {link.title}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2 text-sm">Usage Rights & Legal Notice</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      This AI Content Engine interface is proprietary software. All reproduction, 
                      distribution, or usage rights are governed by the terms of service. 
                      Unauthorized copying or redistribution is strictly prohibited.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}