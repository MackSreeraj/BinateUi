'use client';

import { PenTool, Search, Grid, List, Filter, Plus, Image as ImageIcon, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function WriterProfilesContent() {
  // This will be replaced with actual data
  const writers = [
    { id: 1, name: 'test', description: 'rwtwt' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <PenTool className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Writer Profiles</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Writer Profile
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
        {/* Left Panel - Writer List */}
        <div className="w-64 border-r overflow-y-auto">
          <div className="space-y-1 p-2">
            {writers.map((writer) => (
              <div
                key={writer.id}
                className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-muted/50"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                  <PenTool className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="font-medium">{writer.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{writer.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Writer Details */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Writer Name */}
            <div>
              <Input 
                className="text-2xl font-bold border-0 shadow-none px-0 focus-visible:ring-0" 
                placeholder="Writer Profile Name"
                defaultValue="test"
              />
            </div>

            {/* Profile Picture and Description */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture Upload */}
              <div className="w-full md:w-1/3 space-y-2">
                <div className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/20">
                  <div className="text-center p-4">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Profile Picture</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Attach File
                </Button>
              </div>

              {/* Description */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Input 
                  placeholder="Enter description..." 
                  defaultValue="rwtwt"
                />
              </div>
            </div>

            {/* Style Analysis Section */}
            <div className="border-t pt-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Style Analysis</h2>
                <Button variant="outline">
                  Train Model
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Training Google Doc URL</label>
                  <Input 
                    placeholder="Please provide the URL of a Google Document containing all your training resources before pressing on 'Train Model'" 
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Training Documents</label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag and drop files here, or click to browse
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Browse Files
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Full Style Guide</label>
                  <Textarea 
                    className="min-h-[100px]" 
                    placeholder="Enter full style guide..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Do & Don't List</label>
                  <Textarea 
                    className="min-h-[100px]" 
                    placeholder="List of dos and don'ts..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Example Transformations</label>
                  <Textarea 
                    className="min-h-[100px]" 
                    placeholder="Enter example transformations..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Style Profile Summary</label>
                  <Textarea 
                    className="min-h-[100px]" 
                    placeholder="Enter style profile summary..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">API-Ready Instructions</label>
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
