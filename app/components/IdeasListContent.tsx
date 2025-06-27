'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data for ideas
const statusGroups = [
  {
    status: 'New',
    count: 2,
    ideas: [
      { id: 1, title: 'test', status: 'New' },
      { id: 2, title: 'Record...', status: 'New' },
    ],
  },
  {
    status: 'In Progress',
    count: 0,
    ideas: [],
  },
  {
    status: 'Completed',
    count: 0,
    ideas: [],
  },
];

export default function IdeasListContent() {
  const [expandedGroups, setExpandedGroups] = useState<{[key: string]: boolean}>({ 'New': true });

  const toggleGroup = (status: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  const handleOpenWorkshop = (id: number) => {
    console.log('Open workshop for idea:', id);
    // Add your workshop opening logic here
  };

  const getStatusBadge = (status: string) => {
    const statusColors: {[key: string]: string} = {
      'New': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'In Progress': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'Completed': 'bg-green-100 text-green-800 hover:bg-green-200',
    };

    return (
      <Badge 
        className={`text-xs font-medium rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {status}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-semibold">Ideas List</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="border rounded-lg overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-gray-50 border-b p-2 text-sm font-medium text-gray-500">
          <div className="col-span-5 px-4 py-2">Title</div>
          <div className="col-span-2 px-4 py-2">Relevance S...</div>
          <div className="col-span-2 px-4 py-2">Open Workshop</div>
          <div className="col-span-2 px-4 py-2">Pushed To</div>
          <div className="px-4 py-2">Topics</div>
        </div>

        {/* Status Groups */}
        <div className="divide-y">
          {statusGroups.map((group) => (
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
                    <div key={idea.id} className="grid grid-cols-12 items-center p-2 hover:bg-gray-50">
                      <div className="col-span-5 px-4 py-2 flex items-center">
                        <div className="mr-2">
                          {getStatusBadge(idea.status)}
                        </div>
                        <span className="text-sm font-medium">{idea.title}</span>
                      </div>
                      <div className="col-span-2 px-4 py-2 text-sm text-gray-500">—</div>
                      <div className="col-span-2 px-4 py-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenWorkshop(idea.id);
                          }}
                        >
                          Open Workshop
                        </Button>
                      </div>
                      <div className="col-span-2 px-4 py-2 text-sm text-gray-500">—</div>
                      <div className="px-4 py-2 text-sm text-gray-500">—</div>
                    </div>
                  ))}
                </div>
              ) : expandedGroups[group.status] ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No ideas in this status
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Add Record Button */}
        <div className="bg-gray-50 p-3 border-t">
          <button 
            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            onClick={() => console.log('Add new record')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Record
          </button>
        </div>
      </div>
    </div>
  );
}
