'use client';

import { useState } from 'react';
import { MonitorPlay, Search, Grid, List, Filter, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlatformConnections } from './PlatformConnections';
import { CreatePlatformModal } from './CreatePlatformModal';

export default function PlatformProfilesContent() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <MonitorPlay className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Platform Profiles</h1>
        </div>
        <CreatePlatformModal onSuccess={handleSuccess} />
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="relative w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search platforms..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Platform Connections */}
      <div className="flex-1 overflow-hidden">
        <PlatformConnections key={refreshKey} />
      </div>
    </div>
  );
}
