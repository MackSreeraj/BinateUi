'use client';

import { Home, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const contentEngineCards = [
  {
    icon: Home,
    title: 'Users',
    description: 'Manage user accounts and permissions for your content team'
  },
  {
    icon: Home,
    title: 'Company Profiles',
    description: 'Define brand voice, tone, and company-specific guidelines'
  },
  {
    icon: Home,
    title: 'Writer Profiles',
    description: 'Manage writer profiles and their specific writing styles'
  },
  {
    icon: Home,
    title: 'Platform Profiles',
    description: 'Configure settings for different publishing platforms'
  },
  {
    icon: Home,
    title: 'Trends List',
    description: 'Track and analyze current content trends'
  },
  {
    icon: Home,
    title: 'Trend Workshop',
    description: 'Create and refine content based on trending topics'
  }
];

export default function HomePage() {
  return (
    <div className="p-6">
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
              <Card key={card.title} className="hover:shadow-md transition-shadow cursor-pointer">
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
    </div>
  );
}
