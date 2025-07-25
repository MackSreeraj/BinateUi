'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check, Users, ExternalLink } from 'lucide-react';
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
  relevanceScore?: string | number;
  workshopUrl?: string;
  pushedTo?: string;
  topics?: string | string[];
  status?: string;
  discoveryDate?: string;
  date?: string;
  source?: string;
  url?: string;
  content?: string;
  // Social stats
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  summary?: string | null;
  companyName?: string | null;
  companyId?: string | null;
  // Additional fields
  notes?: string;
  suggestions?: string;
  "Suggestions to leverage this content for marketing"?: string;
  scoreExplanation?: string;
  "Score Explanation"?: string;
  targetPainPoints?: string;
  "Target pain points"?: string;
  keyThemes?: string;
  "Key Themes"?: string;
  "Relevance Score"?: string | number;
  Content?: string;
  Notes?: string;
  Topics?: string | string[];
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  
  // Fetch trends data from the API
  useEffect(() => {
    const fetchTrends = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        
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
        
        if (!data || !data.trends || data.trends.length === 0) {
          throw new Error('No trend data available');
        }
        
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
  }, [retryCount]); // Add retryCount as dependency to allow manual retries


  
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
  
  // Get status color based on status value - dark mode compatible
  const getStatusColor = (status: string | undefined): string => {
    if (!status) return 'bg-gray-800 text-gray-300 hover:bg-gray-700';
    
    switch(status.toLowerCase()) {
      case 'active':
        return 'bg-green-900 text-green-300 hover:bg-green-800';
      case 'new':
        return 'bg-blue-900 text-blue-300 hover:bg-blue-800';
      case 'pending':
        return 'bg-yellow-900 text-yellow-300 hover:bg-yellow-800';
      case 'completed':
        return 'bg-purple-900 text-purple-300 hover:bg-purple-800';
      default:
        return 'bg-gray-800 text-gray-300 hover:bg-gray-700';
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <p>Loading trends data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <Button 
            onClick={() => setRetryCount(prev => prev + 1)} 
            variant="outline" 
            className="hover:bg-red-100"
          >
            Retry Loading Trends
          </Button>
        </div>
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
            <h1 className="text-2xl font-bold mb-2 text-primary">{selectedTrend.Title || selectedTrend.name}</h1>
            {selectedTrend.companyName && (
              <div className="text-sm text-primary mb-4 flex items-center">
                <Users className="h-4 w-4 mr-1" /> 
                {selectedTrend.companyName}
              </div>
            )}
          </div>

          {/* Section 1: Basic Metadata */}
          <div className="bg-card border p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-primary border-l-4 border-blue-500 pl-3">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide">Status</label>
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
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Relevance Score</label>
                <div className="text-primary py-1">{selectedTrend.relevanceScore || '—'}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Discovery Date</label>
                <div className="text-primary py-1">{formatDate(selectedTrend.discoveryDate || selectedTrend.date)}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">URL</label>
                <div className="text-primary py-1">
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
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Topics</label>
                <div className="text-primary py-1">
                  {(() => {
                    const topicsData = selectedTrend.topics || selectedTrend.Topics;
                    if (!topicsData) return '—';
                    
                    if (Array.isArray(topicsData) && topicsData.length > 0) {
                      return (
                        <div className="flex flex-wrap gap-1">
                          {topicsData.map((topic: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs py-0 h-5 bg-slate-700 text-primary hover:bg-slate-600">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      );
                    } else if (typeof topicsData === 'string' && topicsData.trim()) {
                      return (
                        <div className="flex flex-wrap gap-1">
                          {topicsData.split(',').map((topic: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs py-0 h-5 bg-slate-700 text-primary hover:bg-slate-600">
                              {topic.trim()}
                            </Badge>
                          ))}
                        </div>
                      );
                    }
                    return '—';
                  })()}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Source</label>
                <div className="text-primary py-1">{selectedTrend.source || '—'}</div>
              </div>
            </div>
          </div>



          {/* Section 3: Social Stats */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-primary border-l-4 border-blue-500 pl-3">Social Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Likes</label>
                <div className="p-3 bg-card border rounded-md flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-400">{selectedTrend.likes || '0'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Comments</label>
                <div className="p-3 bg-card border rounded-md flex items-center justify-center">
                  <span className="text-lg font-bold text-green-400">{selectedTrend.comments || '0'}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Shares</label>
                <div className="p-3 bg-card border rounded-md flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-400">{selectedTrend.shares || '0'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Content */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-primary border-l-4 border-blue-500 pl-3">Content</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Content</label>
                <div className="whitespace-pre-wrap text-primary leading-relaxed py-1">
                  {selectedTrend.content || selectedTrend.Content || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Additional Trend Details */}
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-primary border-l-4 border-blue-500 pl-3">Additional Trend Details</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Notes</label>
                <div className="whitespace-pre-wrap text-primary leading-relaxed py-1">{selectedTrend.notes || selectedTrend.Notes || '—'}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Suggestions for Marketing</label>
                <div className="whitespace-pre-wrap text-primary leading-relaxed py-1">{selectedTrend.suggestions || selectedTrend["Suggestions to leverage this content for marketing"] || '—'}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Score Explanation</label>
                <div className="whitespace-pre-wrap text-primary leading-relaxed py-1">{selectedTrend.scoreExplanation || selectedTrend["Score Explanation"] || '—'}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Target Pain Points</label>
                <div className="whitespace-pre-wrap text-primary leading-relaxed py-1">{selectedTrend.targetPainPoints || selectedTrend["Target pain points"] || '—'}</div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Key Themes</label>
                <div className="whitespace-pre-wrap text-primary leading-relaxed py-1">
                  {selectedTrend.keyThemes || selectedTrend["Key Themes"] ? (
                    <div className="whitespace-pre-line">{selectedTrend.keyThemes || selectedTrend["Key Themes"]}</div>
                  ) : '—'}
                </div>
              </div>
            </div>
          </div>



          {/* User Selection Dropdown */}
          <div className="bg-card border rounded-lg p-6 shadow-sm mt-6">
            <h2 className="text-xl font-bold mb-4 text-primary border-l-4 border-blue-500 pl-3">Select User for Idea Generation</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-primary uppercase tracking-wide border-b border-gray-600 pb-1 inline-block">Select User</label>
                <select 
                  className="w-full p-2 border rounded-md bg-card text-primary" 
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Select a user...</option>
                  {trendsData?.users && trendsData.users.map(user => (
                    <option key={getIdString(user._id)} value={getIdString(user._id)}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {generateError && (
            <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-md mb-4">
              <p className="font-medium">Error: {generateError}</p>
            </div>
          )}
          
          {generateSuccess && (
            <div className="bg-green-900/20 border border-green-500 text-green-300 p-4 rounded-md mb-4">
              <p className="font-medium">Success! Idea generation has been triggered.</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6">
            <Button variant="outline" size="lg" className="text-primary">Cancel</Button>
            <Button 
              variant="default" 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={!selectedUser || isGenerating}
              onClick={async () => {
                if (!selectedUser || !selectedTrend) return;
                
                try {
                  setIsGenerating(true);
                  setGenerateError(null);
                  
                  const trendId = getIdString(selectedTrend._id);
                  const webhookUrl = 'https://n8n.srv775152.hstgr.cloud/webhook/f4b913d5-7ba2-4435-af37-cd36df67b200';
                  
                  const response = await fetch(`${webhookUrl}?userId=${selectedUser}&trendId=${trendId}`, {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  if (!response.ok) {
                    throw new Error(`Failed to trigger webhook: ${response.status}`);
                  }
                  
                  // Optional: Handle successful response
                  const data = await response.json();
                  console.log('Webhook triggered successfully:', data);
                  
                  // Show success message
                  setGenerateSuccess(true);
                  
                  // Auto-hide success message after 5 seconds
                  setTimeout(() => {
                    setGenerateSuccess(false);
                  }, 5000);
                } catch (err) {
                  console.error('Error triggering webhook:', err);
                  setGenerateError(err instanceof Error ? err.message : 'Failed to trigger idea generation');
                } finally {
                  setIsGenerating(false);
                }
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate Ideas'}
            </Button>
          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
}
