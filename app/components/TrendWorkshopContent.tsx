'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Check, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Define types for our data
interface MongoObjectId {
  $oid: string;
}

interface Trend {
  _id: string | MongoObjectId;
  name: string;
  Title?: string;
  volume?: number;
  change?: number;
  relevanceScore?: number;
  workshopUrl?: string;
  pushedTo?: string;
  topics?: string[];
  status?: string;
  discoveryDate?: string;
  date?: string;
  source?: string;
  // Social stats
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  summary?: string | null;
  companyName?: string | null;
  companyId?: string | null;
}

interface User {
  _id: string | MongoObjectId;
  name: string;
  email: string;
  role?: string;
}

interface TrendsData {
  trends: Trend[];
  users: User[];
}

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function TrendWorkshopContent() {
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [isTrendDropdownOpen, setIsTrendDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(statusOptions[0]);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isUserSelectorOpen, setIsUserSelectorOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch trends data from the API
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/trends', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch trends data: ${response.status}`);
        }
        
        const data = await response.json();
        setTrendsData(data);
        
        // Set the first trend as selected by default
        if (data.trends && data.trends.length > 0) {
          setSelectedTrend(data.trends[0]);
        }
      } catch (err) {
        console.error('Error fetching trends:', err);
        setError('Failed to load trends. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };
  
  // Helper function to get ID string from either string or MongoObjectId
  const getIdString = (id: string | MongoObjectId | undefined): string => {
    if (!id) return '';
    if (typeof id === 'string') return id;
    if (typeof id === 'object' && '$oid' in id) return id.$oid;
    return '';
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
    <div className="flex flex-col h-full p-6">
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <p>Loading trends data...</p>
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 border rounded-md">{error}</div>
      ) : (
        <>
          {/* Trend Selection Dropdown */}
          <div className="relative mb-6 w-full">
            <h1 className="text-2xl font-bold mb-4">Trend Workshop</h1>
            <label className="block text-sm font-medium mb-2">Select a trend to work with:</label>
            <div className="relative">
              <button
                className="w-full flex items-center justify-between p-3 border rounded-md bg-card text-card-foreground hover:bg-accent/50"
                onClick={() => setIsTrendDropdownOpen(!isTrendDropdownOpen)}
              >
                <span className="font-medium">{selectedTrend?.Title || selectedTrend?.name || 'Select a trend'}</span>
                {isTrendDropdownOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {isTrendDropdownOpen && trendsData?.trends && (
                <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {trendsData.trends.map(trend => (
                    <div
                      key={getIdString(trend._id)}
                      className="p-3 hover:bg-accent/50 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setSelectedTrend(trend);
                        setIsTrendDropdownOpen(false);
                      }}
                    >
                      <div className="font-medium">{trend.Title || trend.name}</div>
                      {trend.companyName && (
                        <div className="text-xs text-muted-foreground mt-1">Company: {trend.companyName}</div>
                      )}
                      {trend.date && (
                        <div className="text-xs text-muted-foreground">{formatDate(trend.date)}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {selectedTrend && (
        <div className="space-y-6">
          {/* Trend Title Display */}
          <div className="bg-card border p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-2">{selectedTrend.Title || selectedTrend.name}</h1>
            {selectedTrend.companyName && (
              <div className="text-sm text-muted-foreground mb-4">Company: {selectedTrend.companyName}</div>
            )}
          </div>

          {/* Section 1: Basic Metadata */}
          <div className="bg-card border p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <div className="relative">
                  <button
                    className="w-full flex items-center justify-between p-2 border rounded-md bg-card hover:bg-accent/50"
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                  >
                    <Badge className="bg-purple-900/30 text-purple-300 hover:bg-purple-800/50">
                      {selectedTrend.status || selectedStatus.label}
                    </Badge>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {isStatusDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg">
                      {statusOptions.map(status => (
                        <div
                          key={status.value}
                          className="p-2 hover:bg-accent/50 cursor-pointer flex items-center justify-between"
                          onClick={() => {
                            setSelectedStatus(status);
                            setIsStatusDropdownOpen(false);
                          }}
                        >
                          <Badge className="bg-purple-900/30 text-purple-300 hover:bg-purple-800/50">
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Relevance Score</label>
                <div className="p-2 border rounded-md">{selectedTrend.relevanceScore || '—'}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Discovery Date</label>
                <div className="p-2 border rounded-md">{formatDate(selectedTrend.discoveryDate || selectedTrend.date)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">URL</label>
                <div className="p-2 border rounded-md">
                  {selectedTrend.workshopUrl ? (
                    <Button variant="ghost" size="sm" asChild className="h-6 px-2 -ml-2">
                      <Link href={selectedTrend.workshopUrl} target="_blank">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open URL
                      </Link>
                    </Button>
                  ) : '—'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Topics</label>
                <div className="p-2 border rounded-md min-h-[40px]">
                  {selectedTrend.topics && selectedTrend.topics.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {selectedTrend.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs py-0 h-5">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  ) : '—'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Source</label>
                <div className="p-2 border rounded-md">{selectedTrend.source || '—'}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Social Stats Summary */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Social Stats Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Views</label>
                  <div className="p-2 border rounded-md">{selectedTrend.volume?.toLocaleString() || '—'}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Likes</label>
                  <div className="p-2 border rounded-md">{selectedTrend.likes?.toLocaleString() || '—'}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Comments</label>
                  <div className="p-2 border rounded-md">{selectedTrend.comments?.toLocaleString() || '—'}</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Summary</label>
                  <div className="p-2 border rounded-md min-h-[100px]">{selectedTrend.summary || '—'}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Shares</label>
                  <div className="p-2 border rounded-md">{selectedTrend.shares?.toLocaleString() || '—'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: User Selection */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-card border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Idea Generation</h2>
              <p className="text-base mb-4">
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
            <div className="w-full md:w-80 bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Select Users</h3>
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
                <div className="border rounded-md p-2 mb-4 max-h-60 overflow-y-auto bg-background">
                  {trendsData?.users && trendsData.users.map(user => (
                    <div
                      key={getIdString(user._id)}
                      className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${
                        selectedUsers.includes(getIdString(user._id)) ? 'bg-blue-900/20' : 'hover:bg-accent/50'
                      }`}
                      onClick={() => toggleUserSelection(getIdString(user._id))}
                    >
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                      {selectedUsers.includes(getIdString(user._id)) && (
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
          <div className="flex justify-end space-x-3 pt-6">
            <Button variant="outline" size="lg">Cancel</Button>
            <Button variant="secondary" size="lg">Save Draft</Button>
            <Button variant="default" size="lg">Generate Ideas</Button>
          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
}
