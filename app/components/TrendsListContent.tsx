'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, ExternalLink, ChevronDown, Check, Calendar as CalendarIcon, Sparkles, Building2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
  _id?: string | MongoObjectId;
  name?: string;
  Title?: string;
  topics?: string[];
  status?: string;
  assignedTo?: string;
  assignedBy?: string;
  assignedDate?: string;
  completedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string;
  companyName?: string; // Added company name field
  volume?: number;
  change?: number;
  relevanceScore?: number;
  workshopUrl?: string;
  pushedTo?: string;
  assignmentCompleted?: boolean;
  date?: string;
}

interface Company {
  _id: string | MongoObjectId;
  name: string;
}

interface TrendsData {
  trends: Trend[];
  users: User[];
  companies?: Company[];
}

export default function TrendsListContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendsData, setTrendsData] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingTrends, setIsGeneratingTrends] = useState(false);
  const [findTrendDialogOpen, setFindTrendDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [filterByCompany, setFilterByCompany] = useState<string>('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [generatingForCompany, setGeneratingForCompany] = useState<string | null>(null);
  const [updatingCompanyForTrend, setUpdatingCompanyForTrend] = useState<string | null>(null);

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
          console.log(`Trend ${index} (${trend.Title || trend.name || 'Unnamed'}): pushedTo = ${trend.pushedTo || 'null'}, assignmentCompleted = ${trend.assignmentCompleted}`);
        });
      }
        
        if (!data.trends || data.trends.length === 0) {
          console.warn('No trends data received, using fallback data');
          // Use fallback data if no trends are returned
          setTrendsData({
            trends: [
              { 
                _id: '1', 
                Title: 'AI Advancements', 
                volume: 24500, 
                change: 12,
                topics: ['AI', 'Technology'],
                status: 'Active'
              },
              { 
                _id: '2', 
                Title: 'Web3 Updates', 
                volume: 18900, 
                change: 8,
                topics: ['Web3', 'Blockchain'],
                status: 'Pending'
              }
            ],
            users: [
              { _id: '1', name: 'Sebastin Peter', email: 'sebastin@example.com' },
              { _id: '2', name: 'Jane Jacob', email: 'jane@example.com' }
            ],
            companies: [
              { _id: '1', name: 'Acme Corp' },
              { _id: '2', name: 'Tech Innovations' },
              { _id: '3', name: 'Global Solutions' }
            ]
          });
        } else {
          // If companies are not included in the API response, add mock companies
          if (!data.companies || data.companies.length === 0) {
            data.companies = [
              { _id: '1', name: 'Acme Corp' },
              { _id: '2', name: 'Tech Innovations' },
              { _id: '3', name: 'Global Solutions' },
              { _id: '4', name: 'Digital Frontiers' },
              { _id: '5', name: 'Future Enterprises' }
            ];
          }
          setTrendsData(data);
          setCompanies(data.companies || []);
        }
      } catch (err) {
        console.error('Error fetching trends:', err);
        // Use fallback data on error
        setTrendsData({
          trends: [
            { 
              _id: '1', 
              Title: 'AI Advancements', 
              volume: 24500, 
              change: 12,
              topics: ['AI', 'Technology'],
              status: 'Active'
            },
            { 
                _id: '2', 
                Title: 'Web3 Updates', 
                volume: 18900, 
                change: 8,
                topics: ['Web3', 'Blockchain'],
                status: 'Pending'
            }
          ],
          users: [
            { _id: '1', name: 'Sebastin Peter', email: 'sebastin@example.com' },
            { _id: '2', name: 'Jane Jacob', email: 'jane@example.com' }
          ],
          companies: [
            { _id: '1', name: 'Acme Corp' },
            { _id: '2', name: 'Tech Innovations' },
            { _id: '3', name: 'Global Solutions' },
            { _id: '4', name: 'Digital Frontiers' },
            { _id: '5', name: 'Future Enterprises' }
          ]
        });
        setCompanies(trendsData?.companies || []);
        setError(null); // Clear error since we're using fallback data
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchTrends();
  }, []);
  
  // Handle generating trends for a selected company
  const handleGenerateTrends = async () => {
    if (!selectedCompany) {
      setError('Please select a company first');
      return;
    }
    
    try {
      setIsGeneratingTrends(true);
      setError(null);
      
      console.log('Generating trends for company:', selectedCompany);
      
      // Find the company object from the selected ID
      const company = companies.find(c => normalizeId(c._id) === selectedCompany);
      
      if (!company) {
        throw new Error('Selected company not found');
      }
      
      // Set the generating company to show loading animation
      setGeneratingForCompany(selectedCompany);
      
      // Show toast message
      toast.info(`Generating trend valuation for ${company.name}...`, {
        duration: 5000,
      });
      
      // First call our API to generate trends
      const apiResponse = await fetch('/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          trendId: 'generate', // Using a placeholder ID since the API requires trendId
          action: 'generateTrends',
          companyId: selectedCompany
        }),
      });
      
      console.log('API response status:', apiResponse.status);
      
      if (!apiResponse.ok) {
        const errorData = await apiResponse.json().catch(() => ({}));
        throw new Error(`Failed to generate trends: ${apiResponse.status} - ${errorData.error || ''}`);
      }
      
      const result = await apiResponse.json();
      console.log('Trend generation result:', result);
      
      // Also trigger the external webhook if needed
      try {
        const webhookUrl = `https://n8n.srv775152.hstgr.cloud/webhook/f4b913d5-7ba2-4435-af37-cd36df67b200?companyId=${encodeURIComponent(selectedCompany)}&companyName=${encodeURIComponent(company.name)}`;
        console.log('Triggering webhook for trend generation:', webhookUrl);
        
        const webhookResponse = await fetch(webhookUrl, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log('Webhook response status:', webhookResponse.status);
      } catch (webhookErr) {
        // Log but don't fail the whole operation if webhook fails
        console.error('Error triggering webhook:', webhookErr);
      }
      
      // Close the dialog
      setFindTrendDialogOpen(false);
      
      // Show success toast
      toast.success(`Successfully generated trends for ${company.name}`);
      
      // Set filter to show the newly generated trends
      setFilterByCompany(selectedCompany);
      
      // Refresh trends data after a short delay to allow processing
      setTimeout(() => {
        fetchTrends();
        // Clear the generating company indicator after data is loaded
        setTimeout(() => setGeneratingForCompany(null), 1000);
      }, 2000);
      
    } catch (err) {
      console.error('Error generating trends:', err);
      setError('Failed to generate trends. Please try again.');
      toast.error('Failed to generate trends. Please try again.');
      setGeneratingForCompany(null);
    } finally {
      setIsGeneratingTrends(false);
    }
  };

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
            console.log(`Updating trend ${trend.Title || trend.name || 'Unnamed'} in local state: pushedTo = ${userId || 'null'}`);
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

  // Filter trends based on search query and selected company
  const filteredTrends = trendsData?.trends?.filter((trend: Trend) => {
    // Filter by search query
    const matchesSearch = 
      (trend?.Title ? trend.Title.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      (trend?.name ? trend.name.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      (trend?.topics && Array.isArray(trend.topics) && trend.topics.some((topic: string) => 
        typeof topic === 'string' && topic.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    
    // Filter by company if selected
    const matchesCompany = !filterByCompany || 
      (trend.companyId && normalizeId(trend.companyId) === filterByCompany);
    
    return matchesSearch && matchesCompany;
  }) || [];

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
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trends..."
              className="w-full rounded-lg pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Company dropdown removed as requested */}
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" className="h-8">
            <Filter className="h-3 w-3 mr-1" />
            Filter
          </Button>
          {/* Find Trends button removed as requested */}
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
              <TableHead className="py-1 w-1/6">Status</TableHead>
              <TableHead className="py-1 w-1/2">Title</TableHead>
              <TableHead className="py-1 w-1/6">Date</TableHead>
              <TableHead className="py-1 w-1/6">Company</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                    <p>Loading trends...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredTrends.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-16 text-center">
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
                    case 'archived': return 'bg-gray-100 text-gray-700 border-gray-300';
                    case 'discarded': return 'bg-red-100 text-red-800 border-red-300';
                    case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
                    default: return 'bg-gray-100 text-gray-800 border-gray-300';
                  }
                };
                
                // Handle status change
                const handleStatusChange = async (trendId: string, newStatus: string) => {
                  try {
                    console.log('Updating status for trend:', trendId, 'to', newStatus);
                    
                    // Optimistically update UI first for better user experience
                    setTrendsData(prev => {
                      if (!prev) return prev;
                      
                      return {
                        ...prev,
                        trends: prev.trends.map(t => {
                          if (normalizeId(t._id) === trendId) {
                            return { ...t, status: newStatus };
                          }
                          return t;
                        })
                      };
                    });
                    
                    // Determine if this is mock data (short IDs like '1', '2') or real data
                    const action = trendId.length <= 2 ? 'updateStatusInMemory' : 'updateStatus';
                    
                    const response = await fetch('/api/trends', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        trendId,
                        action,
                        status: newStatus
                      }),
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                      throw new Error(data.error || data.details || `Failed to update status: ${response.status}`);
                    }
                    
                    console.log('Status updated successfully:', data);
                    
                  } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    console.error('Error updating status:', errorMessage);
                    setError(`Failed to update status: ${errorMessage}`);
                    
                    // Revert the optimistic update if there was an error
                    fetchTrends();
                  }
                };

                // Handle company change
                const handleCompanyChange = async (trendId: string, companyId: string) => {
                  try {
                    console.log('Updating company for trend:', trendId, 'to', companyId);
                    
                    // Set the updating state for this trend
                    setUpdatingCompanyForTrend(trendId);
                    
                    // Find the company name for the toast message
                    const selectedCompany = companies.find(c => normalizeId(c._id) === companyId);
                    const companyName = selectedCompany?.name || `Company ${companyId}`;
                    
                    // Show toast message that we're generating trend details
                    toast.info(`Generating trend details for ${companyName}...`, {
                      duration: 5000,
                    });
                    
                    // Call the webhook with company ID and trend ID
                    try {
                      const webhookUrl = `https://n8n.srv775152.hstgr.cloud/webhook/9fca0628-b48f-44ce-89d1-d5f4851d92un?companyId=${encodeURIComponent(companyId)}&trendId=${encodeURIComponent(trendId)}`;
                      console.log('Calling webhook:', webhookUrl);
                      
                      // Use fetch to call the webhook (non-blocking)
                      fetch(webhookUrl, {
                        method: 'GET',
                        headers: {
                          'Cache-Control': 'no-cache'
                        }
                      }).then(response => {
                        console.log('Webhook response status:', response.status);
                      }).catch(webhookErr => {
                        console.error('Error calling webhook:', webhookErr);
                      });
                    } catch (webhookErr) {
                      // Log but don't fail the whole operation if webhook setup fails
                      console.error('Error setting up webhook call:', webhookErr);
                    }
                    
                    // Optimistically update UI first for better user experience
                    setTrendsData(prev => {
                      if (!prev) return prev;
                      
                      return {
                        ...prev,
                        trends: prev.trends.map(t => {
                          if (normalizeId(t._id) === trendId) {
                            return { ...t, companyId };
                          }
                          return t;
                        })
                      };
                    });
                    
                    // Determine if this is mock data (short IDs like '1', '2') or real data
                    const action = trendId.length <= 2 ? 'updateCompanyInMemory' : 'updateCompany';
                    
                    const response = await fetch('/api/trends', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        trendId,
                        action,
                        companyId
                      }),
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) {
                      throw new Error(data.error || data.details || `Failed to update company: ${response.status}`);
                    }
                    
                    console.log('Company updated successfully:', data);
                    
                  } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    console.error('Error updating company:', errorMessage);
                    setError(`Failed to update company: ${errorMessage}`);
                    
                    // Revert the optimistic update if there was an error
                    fetchTrends();
                  } finally {
                    // Clear the updating state
                    setUpdatingCompanyForTrend(null);
                  }
                };
                
                return (
                  <TableRow key={normalizeId(trend._id) || `trend-${index}`} className="h-14 hover:bg-muted/30 transition-colors">
                    <TableCell className="py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className={`h-8 px-3 ${getStatusColor(trend?.status)} hover:bg-opacity-80 transition-colors`}
                          >
                            <span className="mr-1">{trend?.status || 'Not Set'}</span>
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                          <DropdownMenuItem 
                            className="text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusChange(normalizeId(trend._id), 'Active')}
                          >
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            Active
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-amber-700 hover:bg-amber-50"
                            onClick={() => handleStatusChange(normalizeId(trend._id), 'Pending')}
                          >
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-purple-700 hover:bg-purple-50"
                            onClick={() => handleStatusChange(normalizeId(trend._id), 'New')}
                          >
                            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
                            New
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-blue-700 hover:bg-blue-50"
                            onClick={() => handleStatusChange(normalizeId(trend._id), 'Completed')}
                          >
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            Completed
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-emerald-700 hover:bg-emerald-50"
                            onClick={() => handleStatusChange(normalizeId(trend._id), 'Approved')}
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                            Approved
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-gray-700 hover:bg-gray-50"
                            onClick={() => handleStatusChange(normalizeId(trend._id), 'Archived')}
                          >
                            <span className="w-2 h-2 rounded-full bg-gray-500 mr-2"></span>
                            Archived
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-700 hover:bg-red-50"
                            onClick={() => handleStatusChange(normalizeId(trend._id), 'Discarded')}
                          >
                            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                            Discarded
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      {/* Spinner moved to company dropdown */}
                    </TableCell>
                    <TableCell className="font-medium py-2 truncate max-w-xs">
                      <div className="line-clamp-2">{trend?.Title || trend?.name || 'Unnamed Trend'}</div>
                      {trend.companyId && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {trend.companyName || companies.find(c => normalizeId(c._id) === normalizeId(trend.companyId))?.name || 'Unknown Company'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{formattedDate}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-3 bg-blue-50 text-blue-800 border-blue-300 hover:bg-opacity-80 transition-colors"
                              >
                                <span className="mr-1">
                                  {trend.companyName || companies.find(c => normalizeId(c._id) === normalizeId(trend.companyId))?.name || 'Select Company'}
                                </span>
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              {companies.map((company) => (
                                <DropdownMenuItem 
                                  key={normalizeId(company._id)}
                                  className="hover:bg-blue-50"
                                  onClick={() => handleCompanyChange(normalizeId(trend._id), normalizeId(company._id))}
                                >
                                  <Building2 className="h-3 w-3 mr-2 text-muted-foreground" />
                                  {company.name}
                                  {normalizeId(company._id) === normalizeId(trend.companyId) && (
                                    <Check className="h-3 w-3 ml-auto" />
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          {updatingCompanyForTrend === normalizeId(trend._id) && (
                            <span className="ml-2 inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></span>
                          )}
                        </div>
                        {/* Spinner already added above */}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
            </TableBody>
          </Table>
        </div>
      
      {/* Find Trends Dialog removed as requested */}
    </div>
  );
}
