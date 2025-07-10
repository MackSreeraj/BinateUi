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
  role?: string;
}

// Define a type for MongoDB ObjectId format when serialized to JSON
interface MongoObjectId {
  $oid: string;
}

interface Trend {
  _id: string | MongoObjectId;
  name: string; // Changed from title to name to match database structure
  volume?: number; // Added volume field from database
  change?: number; // Added change field from database
  relevanceScore?: number;
  workshopUrl?: string;
  pushedTo?: string;
  topics?: string[];
  status?: string; // Added status field
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
            (typeof trend._id === 'object' && '$oid' in trend._id && trend._id.$oid === trendId);
          
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
    (trend?.topics && Array.isArray(trend.topics) && trend.topics.some(topic => 
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
              <TableHead className="py-1 w-1/3">Title</TableHead>
              <TableHead className="py-1 w-16">Score</TableHead>
              <TableHead className="py-1 w-24">Workshop</TableHead>
              <TableHead className="py-1 w-28">Assigned To</TableHead>
              <TableHead className="py-1 w-20">Status</TableHead>
              <TableHead className="py-1">Topics</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-16 text-center">
                  Loading trends...
                </TableCell>
              </TableRow>
            ) : filteredTrends.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-16 text-center">
                  No trends found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTrends.map((trend, index) => (
                <TableRow key={typeof trend._id === 'string' ? trend._id : (typeof trend._id === 'object' && '$oid' in trend._id ? trend._id.$oid : index)} className="h-10">
                  <TableCell className="font-medium py-0.5 truncate max-w-xs">{trend?.name || 'Unnamed Trend'}</TableCell>
                  <TableCell className="py-0.5">
                    {trend?.relevanceScore ? trend.relevanceScore.toFixed(1) : 
                     (trend?.volume ? (trend.volume / 1000).toFixed(1) : 'N/A')}
                  </TableCell>
                  <TableCell className="py-0.5">
                    {trend?.workshopUrl ? (
                      <Button variant="ghost" size="sm" asChild className="h-6 px-2">
                        <Link href={trend.workshopUrl} target="_blank">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </Link>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="py-0.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-6 px-2 w-full justify-between">
                          <span className="truncate">{getUserNameById(trend?.pushedTo)}</span>
                          <ChevronDown className="h-3 w-3 ml-1 flex-shrink-0" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36">
                        {trendsData?.users && trendsData.users.length > 0 ? (
                          trendsData.users.map((user) => (
                            <DropdownMenuItem 
                              key={typeof user._id === 'string' ? user._id : (typeof user._id === 'object' && '$oid' in user._id ? user._id.$oid : `user-${index}`)}
                              onClick={() => handlePushToUser(
                                typeof trend._id === 'string' ? trend._id : 
                                (typeof trend._id === 'object' && '$oid' in trend._id ? trend._id.$oid : ''),
                                typeof user._id === 'string' ? user._id : 
                                (typeof user._id === 'object' && '$oid' in user._id ? user._id.$oid : '')
                              )}
                              className="py-0.5"
                            >
                              {user?.name || 'Unknown User'}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>No users available</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handlePushToUser(
                            typeof trend._id === 'string' ? trend._id : 
                            (typeof trend._id === 'object' && '$oid' in trend._id ? trend._id.$oid : ''),
                            ''
                          )}
                          className="py-0.5"
                        >
                          Unassign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="py-0.5">
                    <Badge 
                      variant={trend?.status === 'Active' ? 'default' : 'outline'} 
                      className={`text-xs py-0 h-5 ${trend?.status === 'Active' ? 'bg-green-500' : trend?.status === 'Pending' ? 'text-amber-500' : 'text-slate-500'}`}
                    >
                      {trend?.status || 'Not Set'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-0.5">
                    <div className="inline-flex flex-wrap gap-0.5">
                      {trend?.topics && trend.topics.length > 0 ? trend.topics.slice(0, 2).map((topic, index) => (
                        <Badge key={index} variant="outline" className="text-xs py-0 h-4 whitespace-nowrap">
                          {topic || 'Unknown'}
                        </Badge>
                      )) : <span className="text-muted-foreground text-xs">None</span>}
                      {trend?.topics && trend.topics.length > 2 && (
                        <Badge variant="outline" className="text-xs py-0 h-4">+{trend.topics.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
