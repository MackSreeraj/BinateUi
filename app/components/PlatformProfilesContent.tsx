'use client';

import { MonitorPlay, Search, Grid, List, Filter, Plus, Image as ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function PlatformProfilesContent() {
  // This will be replaced with actual data
  const platforms = [
    { id: 1, name: 'LinkedIn', description: 'Professional networking platform' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <MonitorPlay className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Platform Profiles</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Platform
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between pb-4">
        <div className="relative w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
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

      <div className="flex flex-1 overflow-hidden border rounded-lg">
        {/* Left Panel - Platform List */}
        <div className="w-64 border-r overflow-y-auto">
          <div className="space-y-1 p-2">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-muted/50"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                  <MonitorPlay className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">{platform.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{platform.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Platform Details */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Platform Name */}
            <div>
              <label className="text-sm font-medium mb-2 block">Platform Name</label>
              <Input 
                className="text-xl font-bold" 
                placeholder="Enter platform name"
                defaultValue="LinkedIn"
              />
            </div>

            {/* Platform Summary */}
            <div>
              <label className="text-sm font-medium mb-2 block">Platform Summary</label>
              <Textarea 
                className="min-h-[80px]" 
                placeholder="Enter platform summary..."
                defaultValue="Professional networking platform"
              />
            </div>

            {/* Logo Upload */}
            <div className="w-full md:w-1/2">
              <label className="text-sm font-medium mb-2 block">Platform Logo</label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/20">
                <div className="w-32 h-32 mx-auto mb-4 rounded-lg bg-white border flex items-center justify-center">
                  <MonitorPlay className="h-12 w-12 text-blue-600" />
                </div>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Attach File
                </Button>
              </div>
            </div>

            {/* Platform Analysis Section */}
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Platform Analysis</h2>
                <Button variant="outline">
                  Train Model
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Training Google Doc URL</label>
                  <Input 
                    placeholder="Enter Google Doc URL with training resources..." 
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Training Documents</label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Content Structure Guide</label>
                  <Textarea 
                    className="min-h-[100px]" 
                    placeholder="Describe the ideal content structure..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Engagement Techniques</label>
                  <Textarea 
                    className="min-h-[100px]" 
                    placeholder="List effective engagement techniques..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Visual Elements</label>
                  <Textarea 
                    className="min-h-[80px]" 
                    placeholder="Describe preferred visual elements..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Algo Considerations</label>
                  <Textarea 
                    className="min-h-[80px]" 
                    placeholder="List algorithm considerations..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Platform Culture</label>
                  <Textarea 
                    className="min-h-[80px]" 
                    placeholder="Describe the platform's culture..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Technical Guidelines</label>
                  <Textarea 
                    className="min-h-[80px]" 
                    placeholder="List technical requirements and guidelines..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Do & Don't List</label>
                  <Textarea 
                    className="min-h-[80px]" 
                    placeholder="List of dos and don'ts for this platform..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Example Transformations</label>
                  <Textarea 
                    className="min-h-[100px]" 
                    placeholder="Show examples of content transformations..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">API Ready Instructions</label>
                  <Textarea 
                    className="min-h-[100px] font-mono text-sm" 
                    placeholder="Enter API-ready instructions..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
