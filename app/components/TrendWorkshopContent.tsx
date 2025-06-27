'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Check, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

// Mock data
const ideas = [
  { id: 1, title: 'test' },
  { id: 2, title: 'Record...' },
];

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TrendWorkshopContent() {
  const [selectedIdea, setSelectedIdea] = useState(ideas[0]);
  const [isIdeaDropdownOpen, setIsIdeaDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isUserSelectorOpen, setIsUserSelectorOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Mock users
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="flex flex-col h-full bg-background p-6">
      {/* Idea Selection Dropdown */}
      <div className="relative mb-6 w-64">
        <button
          className="w-full flex items-center justify-between p-2 border rounded-md bg-white"
          onClick={() => setIsIdeaDropdownOpen(!isIdeaDropdownOpen)}
        >
          <span>{selectedIdea?.title}</span>
          {isIdeaDropdownOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {isIdeaDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
            {ideas.map(idea => (
              <div
                key={idea.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelectedIdea(idea);
                  setIsIdeaDropdownOpen(false);
                }}
              >
                {idea.title}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Section 1: Basic Metadata */}
        <div className="bg-muted/30 p-4 rounded-lg">
          <h2 className="font-medium mb-3">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Status</label>
              <div className="relative mt-1">
                <button
                  className="w-full flex items-center justify-between p-2 border rounded-md bg-white"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                >
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                    {selectedStatus.label}
                  </Badge>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isStatusDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                    {statusOptions.map(status => (
                      <div
                        key={status.value}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                        onClick={() => {
                          setSelectedStatus(status);
                          setIsStatusDropdownOpen(false);
                        }}
                      >
                        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                          {status.label}
                        </Badge>
                        {selectedStatus.value === status.value && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Relevance Score</label>
              <div className="mt-1 p-2">—</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Discovery Date</label>
              <div className="mt-1 p-2">—</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">URL</label>
              <div className="mt-1 p-2">—</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Topics</label>
              <div className="mt-1 p-2">—</div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Source</label>
              <div className="mt-1 p-2">—</div>
            </div>
          </div>
        </div>

        {/* Section 2: Social Stats Summary */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-medium mb-3">Social Stats Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Views</label>
                <div className="mt-1 p-2">—</div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Likes</label>
                <div className="mt-1 p-2">—</div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Comments</label>
                <div className="mt-1 p-2">—</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Summary</label>
                <div className="mt-1 p-2">—</div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Shares</label>
                <div className="mt-1 p-2">—</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: User Selection */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-white border rounded-lg p-4">
            <h2 className="font-medium mb-3">Idea Generation</h2>
            <p className="text-lg font-medium mb-4">
              Select one or many users to the right to generate an Idea for them. 👉
            </p>
            
            {/* Additional Idea Fields - Left Side */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Score Explanation</label>
                <Textarea className="mt-1" rows={3} placeholder="Enter score explanation..." />
              </div>
              <div>
                <label className="text-sm font-medium">Suggestions to leverage this content for marketing</label>
                <Textarea className="mt-1" rows={3} placeholder="Enter suggestions..." />
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea className="mt-1" rows={3} placeholder="Enter notes..." />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea className="mt-1" rows={4} placeholder="Enter content..." />
              </div>
            </div>
          </div>

          {/* User Selection Sidebar */}
          <div className="w-full md:w-80 bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Select Users</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUserSelectorOpen(!isUserSelectorOpen)}
              >
                <Users className="h-4 w-4 mr-2" />
                {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : 'Select'}
              </Button>
            </div>

            {isUserSelectorOpen && (
              <div className="border rounded-md p-2 mb-4 max-h-60 overflow-y-auto">
                {users.map(user => (
                  <div
                    key={user.id}
                    className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${
                      selectedUsers.includes(user.id) ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => toggleUserSelection(user.id)}
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                    {selectedUsers.includes(user.id) && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Right Side Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Pushed To</label>
                <div className="mt-1 flex items-center">
                  <select className="w-full p-2 border rounded-md">
                    <option>Select platform...</option>
                    <option>LinkedIn</option>
                    <option>Twitter</option>
                    <option>Facebook</option>
                  </select>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Content Ideas</label>
                <Textarea className="mt-1" rows={3} placeholder="Enter content ideas..." />
              </div>
              <div>
                <label className="text-sm font-medium">Target Pain Points</label>
                <Textarea className="mt-1" rows={3} placeholder="Enter pain points..." />
              </div>
              <div>
                <label className="text-sm font-medium">Key Themes</label>
                <Textarea className="mt-1" rows={3} placeholder="Enter key themes..." />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Draft</Button>
          <Button variant="default">Generate Ideas</Button>
        </div>
      </div>
    </div>
  );
}
