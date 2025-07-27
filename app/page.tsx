'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './components/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SettingsDialog } from './components/SettingsDialog';
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
  Zap,
  Pen,
  Globe,
  Search,
  Bell,
  HelpCircle,
  User,
  LogOut,
  Plus,
  Clock,
  Archive,
  ChevronRight
} from 'lucide-react';

const navigationItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Users, label: 'Users' },
  { icon: Building2, label: 'Company Profiles' },
  { icon: PenTool, label: 'Writer Profiles' },
  { icon: MonitorPlay, label: 'Platform Profiles' },
  { icon: TrendingUp, label: 'Trends List' },
  { icon: Wrench, label: 'Trend Workshop' },
  { icon: Lightbulb, label: 'Ideas List' },
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
    title: 'Watch Demo: AI Content Engine',
    url: 'https://thebinate.com/demo',
    external: true
  },
  {
    icon: BookOpen,
    title: 'Documentation & Guides',
    url: 'https://thebinate.com/docs',
    external: true
  },
  {
    icon: Zap,
    title: 'Try Binate AI Beta',
    url: 'https://thebinate.com/beta',
    external: true
  },
  {
    icon: ExternalLink,
    title: 'Visit Binate Website',
    url: 'https://thebinate.com',
    external: true
  },
  {
    icon: Phone,
    title: 'Schedule a Discovery Call',
    url: 'https://thebinate.com/ai_discovery_call/',
    external: true
  },
  {
    icon: FileText,
    title: 'AI Agents: Future of Technology',
    url: 'https://thebinate.com/are-ai-agents-the-future-of-technology-exploring-trends-and-possibilities/',
    external: true
  },
  {
    icon: BookOpen,
    title: 'Latest AI Trends Blog',
    url: 'https://thebinate.com/blog',
    external: true
  },
  {
    icon: Zap,
    title: 'AI Content Case Studies',
    url: 'https://thebinate.com/case-studies',
    external: true
  },
];

// Import the content components
import UsersContent from './components/UsersContent';
import ContentPipelineSidebar from './components/ContentPipelineSidebar';
import IdeasContent from './components/IdeasContent';
import IdeaWorkshopContent from './components/IdeaWorkshopContent';
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
  const [contentPipelineExpanded, setContentPipelineExpanded] = useState(false);
  // Settings now use a dedicated page instead of a dialog

  // Update active nav based on URL
  useEffect(() => {
    const nav = searchParams.get('tab');
    if (nav) {
      setActiveNav(nav);
    }
  }, [searchParams]);

  // Update URL when active nav changes
  const handleNavClick = (nav: string) => {
    // If clicking on Content Pipeline, toggle the expanded state
    if (nav === 'Content Pipeline') {
      setContentPipelineExpanded(!contentPipelineExpanded);
    } else {
      // Set the active nav and update URL
      setActiveNav(nav);
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', nav);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };
  
  // Handle sub-item click for Content Pipeline
  const handleSubItemClick = (section: string) => {
    setActiveNav('Content Pipeline');
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', 'Content Pipeline');
    params.set('section', section);
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
    'Ideas List': () => <IdeasContent />,
    'Idea Workshop': () => <IdeaWorkshopContent />,
    'Content Pipeline': () => {
      // Get the current section from the URL
      const section = searchParams.get('section') || 'content-overview';
      
      // Render different content based on the section
      switch(section) {
        case 'add-new-post':
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Plus className="h-5 w-5" />
                <h1 className="text-2xl font-bold">Add New Post</h1>
              </div>
              <p>Create a new post for your content calendar.</p>
              {/* Add New Post content would go here */}
            </div>
          );
        case 'scheduled-posts':
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-5 w-5" />
                <h1 className="text-2xl font-bold">Scheduled Posts</h1>
              </div>
              <p>View and manage your scheduled content.</p>
              {/* Scheduled Posts content would go here */}
            </div>
          );
        case 'past-posts':
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Archive className="h-5 w-5" />
                <h1 className="text-2xl font-bold">Past Posts</h1>
              </div>
              <p>Review your published content history.</p>
              {/* Past Posts content would go here */}
            </div>
          );
        default:
          return (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Calendar className="h-5 w-5" />
                <h1 className="text-2xl font-bold">Content Calendar Overview</h1>
              </div>
              <p>Manage your content publishing schedule and track performance.</p>
              {/* Overview content would go here */}
            </div>
          );
      }
    },
    'Content List': () => <ContentList />,
    // Add other content components here as needed
  };

  // Get the current content component or default to Home
  const CurrentContent = contentComponents[activeNav] || contentComponents['Home'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed Position */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm">
        <div className="relative flex h-16 items-center justify-between px-6">
          {/* Left side - Theme Toggle */}
          <div>
            <ThemeToggle />
          </div>
          
          {/* Center - Logo (absolutely positioned) */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative h-10 w-32">
              <Image 
                src="/logo/Binate Logo wide sqr white.png" 
                alt="Binate Logo" 
                width={128} 
                height={40} 
                className="object-contain dark:opacity-100 light:opacity-80"
                priority
              />
            </div>
          </div>
          
          {/* Right side - Controls */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-16"></div>

      <div className="flex">
        {/* Left Sidebar - Fixed position */}
        <aside className="w-64 border-r bg-muted/20 h-[calc(100vh-4rem)] flex flex-col justify-between fixed top-16 left-0 overflow-y-auto">
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-green-500">Content Engine</h2>
            </div>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.label;
                const isContentPipeline = item.label === 'Content Pipeline';
                
                return (
                  <div key={item.label} className="flex flex-col">
                    <button
                      onClick={() => handleNavClick(item.label)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                        isActive && !isContentPipeline
                          ? 'bg-accent text-accent-foreground' 
                          : isContentPipeline && contentPipelineExpanded
                          ? 'bg-accent/80 text-accent-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </div>
                      {isContentPipeline && (
                        <ChevronRight className={`h-4 w-4 transition-transform ${contentPipelineExpanded ? 'rotate-90' : ''}`} />
                      )}
                    </button>
                    
                    {/* Content Pipeline Sub-items */}
                    {isContentPipeline && (
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out pl-7 ${contentPipelineExpanded ? 'max-h-48 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="space-y-1 py-1">
                          {[
                            { icon: Calendar, label: 'Overview', param: 'content-overview' },
                            { icon: Plus, label: 'Add New Post', param: 'add-new-post' },
                            { icon: Clock, label: 'Scheduled Posts', param: 'scheduled-posts' },
                            { icon: Archive, label: 'Past Posts', param: 'past-posts' }
                          ].map((subItem) => {
                            const SubIcon = subItem.icon;
                            const isSubActive = searchParams.get('section') === subItem.param && activeNav === 'Content Pipeline';
                            
                            return (
                              <button
                                key={subItem.param}
                                onClick={() => handleSubItemClick(subItem.param)}
                                className={`flex w-full items-center rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground ${
                                  isSubActive 
                                    ? 'bg-accent/50 text-accent-foreground' 
                                    : 'text-muted-foreground'
                                }`}
                              >
                                <SubIcon className="mr-2 h-3.5 w-3.5" />
                                {subItem.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
          
          {/* User Profile and Settings Section */}
          <div className="mt-auto border-t border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sebastin Peter</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push('/settings')}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 p-6 ml-64 ${activeNav === 'Home' ? 'mr-80' : ''}`}>
          <CurrentContent />
        </main>
        
        {/* Content Pipeline is now integrated directly into the main sidebar */}

        {/* Settings Dialog - Now using dedicated settings page instead */}
        
        {/* Right Sidebar - Only shown on Home page - Fixed Position */}
        {activeNav === 'Home' && (
          <aside className="w-80 border-l bg-muted/20 h-[calc(100vh-4rem)] fixed top-16 right-0">
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
                          <a 
                            key={link.title} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <Button
                              variant="ghost"
                              className="w-full justify-start h-auto p-2 text-xs"
                            >
                              <Icon className="mr-2 h-3 w-3" />
                              {link.title}
                              {link.external && <ExternalLink className="ml-1 h-2 w-2" />}
                            </Button>
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2 text-sm">About Binate AI</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Binate AI helps businesses create engaging content at scale by leveraging the latest in artificial intelligence technology. Our platform streamlines content creation, trend analysis, and audience engagement.                      
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