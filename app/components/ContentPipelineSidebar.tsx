'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Plus, Clock, Archive } from "lucide-react";

interface ContentPipelineSidebarProps {
  activeSection?: string;
  onSectionChange: (section: string) => void;
}

/**
 * ContentPipelineSidebar component
 * 
 * Note: This component is kept for backward compatibility but the content pipeline
 * functionality has been integrated directly into the main sidebar.
 */
export default function ContentPipelineSidebar({ 
  activeSection = 'content-overview',
  onSectionChange 
}: ContentPipelineSidebarProps) {
  // Define the content pipeline sections
  const sections = [
    { icon: Calendar, label: 'Overview', param: 'content-overview' },
    { icon: Plus, label: 'Add New Post', param: 'add-new-post' },
    { icon: Clock, label: 'Scheduled Posts', param: 'scheduled-posts' },
    { icon: Archive, label: 'Past Posts', param: 'past-posts' }
  ];

  return (
    <div className="w-full border-r bg-muted/20">
      <div className="p-4">
        <div className="space-y-1">
          {sections.map((section) => {
            const SectionIcon = section.icon;
            const isActive = activeSection === section.param;
            
            return (
              <Button
                key={section.param}
                onClick={() => onSectionChange(section.param)}
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start text-sm ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                <SectionIcon className="mr-2 h-4 w-4" />
                {section.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
