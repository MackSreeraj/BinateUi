'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, ExternalLink, ChevronDown, Check, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';

// Define types for our data
interface User {
  _id: string | MongoObjectId;
  name: string;
  email: string;
  role?: string;
}

// Define a type for MongoDB ObjectId format when serialized to JSON
interface MongoObjectId {
  $oid: string;
}

interface Trend {
  _id: string | MongoObjectId;
  Title: string;
  date?: string;
  status?: string;
  topics?: string[];
  // Keep these for backward compatibility
  volume?: number;
  change?: number;
  relevanceScore?: number;
  workshopUrl?: string;
  pushedTo?: string;
  assignmentCompleted?: boolean;
}

interface TrendsData {
  trends: Trend[];
  users: User[];
}

export default function TrendsListContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trends data from the API
  const fetchTrends = async () => {
    try {
      console.log('Starting to fetch trends data...');
      setLoading(true);
      
      // Add a small delay to ensure the API route is ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await fetch('/api/trends', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      console.log('API response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch trends data: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      console.log('Trends count:', data?.trends?.length || 0);
      console.log('Users count:', data?.users?.length || 0);
      
      // Debug: Log each trend's pushedTo field
      if (data?.trends) {
        console.log('DEBUG - Trends pushedTo fields:');
        data.trends.forEach((trend: Trend, index: number) => {
          console.log(`Trend ${index} (${trend.name}): pushedTo = ${trend.pushedTo || 'null'}, assignmentCompleted = ${trend.assignmentCompleted}`);
        });
      }
        
        if (!data.trends || data.trends.length === 0) {
          console.warn('No trends data received, using fallback data');
          // Use fallback data if no trends are returned
          setTrendsData({
            trends: [
              { 
                _id: '1', 
                name: 'AI Advancements', 
                volume: 24500, 
                change: 12,
                topics: ['AI', 'Technology'],
                status: 'Active'
              },
              { 
                _id: '2', 
                name: 'Web3 Updates', 
                volume: 18900, 
                change: 8,
                topics: ['Web3', 'Blockchain'],
                status: 'Pending'
              }
            ],
            users: [
              { _id: '1', name: 'John Doe', email: 'john@example.com' },
              { _id: '2', name: 'Jane Smith', email: 'jane@example.com' }
            ]
          });
        } else {
          setTrendsData(data);
        }
      } catch (err) {
        console.error('Error fetching trends:', err);
        // Use fallback data on error
        setTrendsData({
          trends: [
            { 
              _id: '1', 
              name: 'AI Advancements', 
              volume: 24500, 
              change: 12,
              topics: ['AI', 'Technology'],
              status: 'Active'
            },
            { 
                _id: '2', 
                name: 'Web3 Updates', 
                volume: 18900, 
                change: 8,
                topics: ['Web3', 'Blockchain'],
                status: 'Pending'
            }
          ],
          users: [
            { _id: '1', name: 'John Doe', email: 'john@example.com' },
            { _id: '2', name: 'Jane Smith', email: 'jane@example.com' }
          ]
        });
        setError(null); // Clear error since we're using fallback data
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTrends();
  }, []);

  // Handle pushing a trend to a user
  const handlePushToUser = async (trendId: string, userId: string) => {
    try {
      console.log('Pushing trend to user:', { trendId, userId });
      
      // Don't proceed if either ID is empty
      if (!trendId) {
        console.error('Missing trendId');
        setError('Cannot update: Missing trend information');
        return;
      }
      
      const response = await fetch('/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ trendId, userId, action: 'assign' }),
      });

      console.log('Push response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to update trend: ${response.status} - ${errorData.error || ''}`);
      }

      const result = await response.json();
      console.log('Assignment API response:', result);

      // Update local state to reflect the change
      if (trendsData) {
        const updatedTrends = trendsData.trends.map(trend => {
          // Check if the trend ID matches using our normalizeId helper
          const isMatch = normalizeId(trend._id) === trendId;
          
          if (isMatch) {
            console.log(`Updating trend ${trend.name} in local state: pushedTo = ${userId || 'null'}`);
            return { ...trend, pushedTo: userId || undefined, assignmentCompleted: false };
          }
          return trend;
        });
        
        setTrendsData({ ...trendsData, trends: updatedTrends });
      }
      
      console.log('Trend successfully pushed to user');
      
      // Trigger webhook when a user is assigned to a trend (not when unassigning)
      if (userId) {
        try {
          const webhookUrl = `https://n8n.srv775152.hstgr.cloud/webhook/f4b913d5-7ba2-4435-af37-cd36df67b200?userId=${encodeURIComponent(userId)}&trendId=${encodeURIComponent(trendId)}`;
          console.log('Triggering webhook:', webhookUrl);
          
          const webhookResponse = await fetch(webhookUrl, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache'
            }
          });
          
          console.log('Webhook response status:', webhookResponse.status);
          if (!webhookResponse.ok) {
            console.warn('Webhook trigger failed, but continuing with assignment process');
          } else {
            console.log('Webhook triggered successfully');
          }
        } catch (webhookErr) {
          // Log but don't fail the whole operation if webhook fails
          console.error('Error triggering webhook:', webhookErr);
        }
      }
      
      // Refresh the trends data to ensure we have the latest state
      await fetchTrends();
      
    } catch (err) {
      console.error('Error pushing trend to user:', err);
      setError('Failed to update trend. Please try again.');
    }
  };

  // Handle completing a trend assignment
  const handleCompleteAssignment = async (trendId: string) => {
    try {
      console.log('Completing trend assignment:', { trendId });
      
      // Don't proceed if ID is empty
      if (!trendId) {
        console.error('Missing trendId');
        setError('Cannot update: Missing trend information');
        return;
      }
      
      // Find the trend to get the assigned user
      const trend = trendsData?.trends.find(t => {
        return normalizeId(t._id) === trendId;
      });
      
      if (!trend || !trend.pushedTo) {
        console.error('Cannot complete: Trend not found or no user assigned');
        setError('Cannot complete: No user assigned to this trend');
        return;
      }
      
      const response = await fetch('/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ 
          trendId, 
          action: 'complete'
        }),
      });

      console.log('Complete response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to complete assignment: ${response.status} - ${errorData.error || ''}`);
      }

      const result = await response.json();
      console.log('Completion API response:', result);

      // Update local state to reflect the change
      if (trendsData) {
        const updatedTrends = trendsData.trends.map(t => {
          // Check if the trend ID matches, handling both string and ObjectId formats
          const isMatch = 
            t._id === trendId || 
            t._id === trendId.toString() || 
            (typeof t._id === 'object' && '$oid' in t._id && t._id.$oid === trendId);
          
          if (isMatch) {
            console.log(`Completing assignment for trend ${t.name}`);
            return { ...t, assignmentCompleted: true };
          }
          return t;
        });
        
        setTrendsData({ ...trendsData, trends: updatedTrends });
      }
      
      console.log('Trend assignment successfully completed');
      
      // Refresh the trends data to ensure we have the latest state
      await fetchTrends();
      
    } catch (err) {
      console.error('Error completing trend assignment:', err);
      setError('Failed to complete assignment. Please try again.');
    }
  };

  // Filter trends based on search query
  const filteredTrends = trendsData?.trends?.filter((trend: Trend) => 
    (trend?.name ? trend.name.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
    (trend?.topics && Array.isArray(trend.topics) && trend.topics.some((topic: string) => 
      typeof topic === 'string' && topic.toLowerCase().includes(searchQuery.toLowerCase())
    ))
  ) || [];

  // Find user name by ID
  const getUserNameById = (userId: string | null | undefined) => {
    if (!userId || !trendsData?.users) return 'Unassigned';
    
    // Handle different ID formats (string, ObjectId)
    const user = trendsData.users.find(u => {
      if (!u || !u._id) return false;
      
      // Direct string comparison
      if (u._id === userId) return true;
      
      // Handle MongoDB ObjectId format
      if (typeof u._id === 'object' && '$oid' in u._id && u._id.$oid === userId) return true;
      
      return false;
    });
    
    return user?.name || 'Unassigned';
  };
  
  // Helper function to normalize IDs for comparison
  const normalizeId = (id: string | MongoObjectId | undefined): string => {
    if (!id) return '';
    if (typeof id === 'string') return id;
    if (typeof id === 'object' && '$oid' in id) return id.$oid;
    return '';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search trends..."
            className="w-full rounded-lg pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="h-8">
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
          <Button size="sm" className="h-8">
            <Plus className="h-3 w-3 mr-1" />
            Add Trend
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="py-1 w-1/2">Title</TableHead>
              <TableHead className="py-1 w-1/4">Date</TableHead>
              <TableHead className="py-1 w-1/4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="h-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                    <p>Loading trends...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTrends.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-16 text-center">
                  <p className="mb-2">No trends found.</p>
                  <Button size="sm" className="mx-auto">
                    <Plus className="h-3 w-3 mr-1" />
                    Add New Trend
                  </Button>
                </TableCell>
              </TableRow>
            ) : (
              filteredTrends.map((trend: Trend, index: number) => {
                // Format the date nicely if it exists
                const formattedDate = trend?.date ? new Date(trend.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'No date';
                
                // Determine status color
                const getStatusColor = (status: string | undefined) => {
                  switch(status?.toLowerCase()) {
                    case 'active': return 'bg-green-100 text-green-800 border-green-300';
                    case 'pending': return 'bg-amber-100 text-amber-800 border-amber-300';
                    case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300';
                    case 'new': return 'bg-purple-100 text-purple-800 border-purple-300';
                    default: return 'bg-gray-100 text-gray-800 border-gray-300';
                  }
                };
                
                return (
                  <TableRow key={normalizeId(trend._id) || `trend-${index}`} className="h-14 hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium py-2 truncate max-w-xs">
                      <div className="line-clamp-2">{trend?.name || 'Unnamed Trend'}</div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formattedDate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge 
                        variant="outline" 
                        className={`px-3 py-1 ${getStatusColor(trend?.status)}`}
                      >
                        {trend?.status || 'Not Set'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
      </Table>
      </div>
    </div>
  );
}
