'use client';

import { Building2, Search, Grid, List, Filter, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CompanyProfilesContent() {
  // This will be replaced with actual data
  const companies = [
    { id: 1, name: 'Nvidia' },
    { id: 2, name: 'AMD' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Company Profiles</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Company
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

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Company List */}
        <div className="w-64 border-r overflow-y-auto">
          <div className="space-y-1">
            {companies.map((company) => (
              <div
                key={company.id}
                className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-muted/50"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-muted flex items-center justify-center mr-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="font-medium">{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Company Details */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <Input 
                className="text-2xl font-bold border-0 shadow-none px-0 focus-visible:ring-0" 
                placeholder="Company Name"
              />
            </div>

            {/* Logo and About Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo Upload */}
              <div className="w-full md:w-1/3 space-y-2">
                <div className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/20">
                  <div className="text-center p-4">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Company Logo</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Attach file
                </Button>
              </div>

              {/* About Section */}
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">About the business</label>
                <Textarea 
                  className="min-h-[120px]" 
                  placeholder="Tell us about your business..."
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">What Service do you offer?</label>
                <Input placeholder="Enter services..." />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Mission of the business</label>
                <Input placeholder="Enter mission statement..." />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Unique Value Proposition</label>
                <Textarea placeholder="What makes your business unique?" />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Ideal client's top three pain points</label>
                <Textarea placeholder="List the main challenges your clients face..." />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">How do you want to come across to your target audience?</label>
                <Textarea placeholder="Describe your desired brand voice and tone..." />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
