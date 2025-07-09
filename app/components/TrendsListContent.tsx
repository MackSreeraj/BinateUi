'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, ExternalLink, ChevronDown } from 'lucide-react';
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
  _id: string;
  name: string;
  email: string;
}

interface Trend {
  _id: string;
  name: string; // Changed from title to name to match database structure
  volume?: number; // Added volume field from database
  change?: number; // Added change field from database
  relevanceScore?: number;
  workshopUrl?: string;
  pushedTo?: string;
  topics?: string[];
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
  useEffect(() => {
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
                topics: ['AI', 'Technology']
              },
              { 
                _id: '2', 
                name: 'Web3 Updates', 
                volume: 18900, 
                change: 8,
                topics: ['Web3', 'Blockchain']
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
              topics: ['AI', 'Technology']
            },
            { 
              _id: '2', 
              name: 'Web3 Updates', 
              volume: 18900, 
              change: 8,
              topics: ['Web3', 'Blockchain']
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

    fetchTrends();
  }, []);

  // Handle pushing a trend to a user
  const handlePushToUser = async (trendId: string, userId: string) => {
    try {
      console.log('Pushing trend to user:', { trendId, userId });
      
      // Don't proceed if either ID is empty
      if (!trendId || !userId) {
        console.error('Missing trendId or userId');
        setError('Cannot update: Missing trend or user information');
        return;
      }
      
      const response = await fetch('/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ trendId, userId }),
      });

      console.log('Push response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`Failed to update trend: ${response.status} - ${errorData.error || ''}`);
      }

      // Update local state to reflect the change
      if (trendsData) {
        const updatedTrends = trendsData.trends.map(trend => {
          // Check if the trend ID matches, handling both string and ObjectId formats
          const isMatch = 
            trend._id === trendId || 
            trend._id === trendId.toString() || 
            (trend._id && trend._id.$oid && trend._id.$oid === trendId);
          
          return isMatch ? { ...trend, pushedTo: userId } : trend;
        });
        
        setTrendsData({ ...trendsData, trends: updatedTrends });
      }
      
      console.log('Trend successfully pushed to user');
    } catch (err) {
      console.error('Error pushing trend to user:', err);
      setError('Failed to update trend. Please try again.');
    }
  };

  // Filter trends based on search query
  const filteredTrends = trendsData?.trends?.filter(trend => 
    (trend?.name ? trend.name.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
    (trend?.topics && trend.topics.some(topic => topic?.toLowerCase?.().includes(searchQuery.toLowerCase()) || false))
  ) || [];

  // Find user name by ID
  const getUserNameById = (userId: string | null) => {
    if (!userId || !trendsData?.users) return 'Unassigned';
    
    // Handle different ID formats (string, ObjectId)
    const user = trendsData.users.find(u => {
      if (!u || !u._id) return false;
      
      // Direct string comparison
      if (u._id === userId) return true;
      
      // Handle MongoDB ObjectId format
      if (typeof u._id === 'object' && u._id.$oid && u._id.$oid === userId) return true;
      
      return false;
    });
    
    return user?.name || 'Unassigned';
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header with Search */}
      <div className="flex flex-col space-y-4 p-6 pb-0">
        <h1 className="text-2xl font-semibold">Trends List</h1>
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
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Trend
            </Button>
          </div>
        </div>
      </div>

      {/* Trends Table */}
      <div className="flex-1 overflow-y-auto p-6 pt-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading trends data...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead className="w-[150px]">Relevance Score</TableHead>
                  <TableHead className="w-[150px]">Open Workshop</TableHead>
                  <TableHead className="w-[200px]">Pushed To</TableHead>
                  <TableHead>Topics</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTrends.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No trends found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTrends.map((trend, index) => (
                    <TableRow key={trend._id || index}>
                      <TableCell className="font-medium">{trend?.name || 'Unnamed Trend'}</TableCell>
                      <TableCell>
                        {trend?.relevanceScore ? trend.relevanceScore.toFixed(2) : 
                         (trend?.volume ? (trend.volume / 1000).toFixed(2) : 'N/A')}
                      </TableCell>
                      <TableCell>
                        {trend?.workshopUrl ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={trend.workshopUrl} target="_blank">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open
                            </Link>
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not available</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              {getUserNameById(trend?.pushedTo)}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Assign to User</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {trendsData?.users && trendsData.users.length > 0 ? (
                              trendsData.users.map((user) => (
                                <DropdownMenuItem 
                                  key={user?._id || index}
                                  onClick={() => handlePushToUser(trend?._id || '', user?._id || '')}
                                  className="flex flex-col items-start py-2"
                                >
                                  <span className="font-medium">{user?.name || 'Unknown User'}</span>
                                  {user?.email && (
                                    <span className="text-xs text-muted-foreground">{user.email}</span>
                                  )}
                                  {user?.role && (
                                    <span className="text-xs text-muted-foreground mt-1">{user.role}</span>
                                  )}
                                </DropdownMenuItem>
                              ))
                            ) : (
                              <DropdownMenuItem disabled>No users available</DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handlePushToUser(trend?._id || '', '')}
                              className="text-muted-foreground"
                            >
                              Clear Assignment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {trend?.topics && trend.topics.length > 0 ? trend.topics.map((topic, index) => (
                            <Badge key={index} variant="outline">
                              {topic || 'Unknown'}
                            </Badge>
                          )) : <span className="text-muted-foreground text-sm">No topics</span>}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
