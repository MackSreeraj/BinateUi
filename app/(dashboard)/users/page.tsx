'use client';

import { Search, Grid, List, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UsersPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-2">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <span>👩‍💻</span> Users
          </h1>
        </div>
        <Button className="rounded-lg h-10 w-10 p-0 flex items-center justify-center">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="h-9 p-1 bg-muted/50">
              <TabsTrigger 
                value="grid" 
                className="rounded-md px-3 py-1 text-sm font-medium transition-all hover:bg-background data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid View
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                className="rounded-md px-3 py-1 text-sm font-medium transition-all hover:bg-background data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex flex-col items-center justify-center h-full text-center p-12 rounded-lg border-2 border-dashed border-muted-foreground/20">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">No users found</h3>
            <p className="text-sm text-muted-foreground">
              This page doesn't have any data yet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
