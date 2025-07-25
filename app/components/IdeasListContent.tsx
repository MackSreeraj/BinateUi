'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Define types for content ideas
interface ContentIdea {
  _id: string;
  userId: string;
  trendId: string;
  content: string;
  specificitiesDraft: string;
  specificitiesForImages: string;
  writer: string;
  platform: string;
  drafts: string;
  company: string;
  status: string;
  createdAt: string;
}

interface StatusGroup {
  status: string;
  count: number;
  ideas: ContentIdea[];
}

export default function IdeasListContent() {
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [statusGroups, setStatusGroups] = useState<StatusGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<{[key: string]: boolean}>({ 'Draft': true });

  // Fetch content ideas from the API
  useEffect(() => {
    const fetchContentIdeas = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/content-ideas', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content ideas: ${response.status}`);
        }
        
        const data = await response.json();
        setContentIdeas(data);
        
        // Group ideas by status
        const groupedIdeas = groupIdeasByStatus(data);
        setStatusGroups(groupedIdeas);
      } catch (err) {
        console.error('Error fetching content ideas:', err);
        setError('Failed to load content ideas. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchContentIdeas();
  }, []);

  // Group content ideas by status
  const groupIdeasByStatus = (ideas: ContentIdea[]): StatusGroup[] => {
    const statusMap: {[key: string]: ContentIdea[]} = {};
    
    // Group ideas by status
    ideas.forEach(idea => {
      const status = idea.status || 'Draft';
      if (!statusMap[status]) {
        statusMap[status] = [];
      }
      statusMap[status].push(idea);
    });
    
    // Convert map to array of status groups
    return Object.entries(statusMap).map(([status, ideas]) => ({
      status,
      count: ideas.length,
      ideas
    }));
  };

  const toggleGroup = (status: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  const handleOpenWorkshop = (id: string) => {
    console.log('Open workshop for idea:', id);
    // Navigate to the idea workshop page
    // You can implement this with Next.js router or Link component
  };

  const getStatusBadge = (status: string) => {
    const statusColors: {[key: string]: string} = {
      'Draft': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'In Progress': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'Completed': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Published': 'bg-green-100 text-green-800 hover:bg-green-200',
    };

    return (
      <Badge 
        className={`text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {status}
      </Badge>
    );
  };
  
  // Format date string
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-semibold">Content Ideas</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Content Idea
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading content ideas...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline" 
            className="hover:bg-red-100"
          >
            Retry Loading
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-gray-50 border-b p-2 text-sm font-medium text-gray-500">
            <div className="col-span-4 px-4 py-2">Content</div>
            <div className="col-span-2 px-4 py-2">Date</div>
            <div className="col-span-2 px-4 py-2">Status</div>
            <div className="col-span-2 px-4 py-2">Workshop</div>
            <div className="col-span-2 px-4 py-2">Platform</div>
          </div>

          {/* Status Groups */}
          <div className="divide-y">
            {statusGroups.length > 0 ? (
              statusGroups.map((group) => (
                <div key={group.status} className="bg-white">
                  {/* Group Header */}
                  <div 
                    className="flex items-center px-4 py-3 border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleGroup(group.status)}
                  >
                    {expandedGroups[group.status] ? (
                      <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-2 text-gray-500" />
                    )}
                    <span className="font-medium">Status: {group.status}</span>
                    <span className="ml-2 text-sm text-gray-500">({group.count})</span>
                  </div>

                  {/* Group Rows */}
                  {expandedGroups[group.status] && group.ideas.length > 0 ? (
                    <div className="divide-y">
                      {group.ideas.map((idea) => (
                        <div key={idea._id} className="grid grid-cols-12 items-center p-2 hover:bg-gray-50">
                          <div className="col-span-4 px-4 py-2 flex items-center">
                            <div className="mr-2">
                              {getStatusBadge(idea.status)}
                            </div>
                            <span className="text-sm font-medium truncate">
                              {idea.content.substring(0, 50)}{idea.content.length > 50 ? '...' : ''}
                            </span>
                          </div>
                          <div className="col-span-2 px-4 py-2 text-sm text-gray-500">
                            {formatDate(idea.createdAt)}
                          </div>
                          <div className="col-span-2 px-4 py-2 text-sm text-gray-500">
                            {idea.status || 'Draft'}
                          </div>
                          <div className="col-span-2 px-4 py-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenWorkshop(idea._id);
                              }}
                              asChild
                            >
                              <Link href={`/idea-workshop/${idea._id}`}>Open Workshop</Link>
                            </Button>
                          </div>
                          <div className="col-span-2 px-4 py-2 text-sm text-gray-500">
                            {idea.platform || '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : expandedGroups[group.status] ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      No content ideas in this status
                    </div>
                  ) : null}
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No content ideas found
              </div>
            )}
          </div>

          {/* Add Record Button */}
          <div className="bg-gray-50 p-3 border-t">
            <button 
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              onClick={() => console.log('Add new content idea')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Content Idea
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
