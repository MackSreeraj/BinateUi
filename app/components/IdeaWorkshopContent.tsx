'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, X, AlertTriangle, ChevronDown, Plus, Loader2, Sparkles } from 'lucide-react';

interface Company {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  username: string;
  imageUrl?: string;
}

interface Writer {
  _id: string;
  name: string;
}

interface Platform {
  _id: string;
  name: string;
}

interface Trend {
  _id: string;
  name: string;
  volume?: number;
  change?: number;
  relevanceScore?: number;
  workshopUrl?: string;
  pushedTo?: string | null;
  assignmentCompleted?: boolean;
  topics?: string[];
  discoveryDate?: string;
  source?: string | null;
  status?: string;
  likes?: number | null;
  comments?: number | null;
  shares?: number | null;
  summary?: string | null;
}

interface Idea {
  _id: string;
  content: string;
  userId?: string;
  trendId?: string;
  specificitiesDraft?: string;
  specificitiesForImages?: string;
  writer?: string;
  platform?: string;
  drafts?: string;
  company?: string;
  status?: string;
  createdAt: string;
}

interface Draft {
  _id: string;
  content: string;
  trendId: string;
  createdAt: string;
  platform: string; // Changed from optional to required
  title?: string;
}

const IdeaWorkshopContent = () => {
  const [selectedIdeaTitle, setSelectedIdeaTitle] = useState<string>('');
  const [status, setStatus] = useState('Draft');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingDrafts, setIsFetchingDrafts] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  
  // Dialog state for full content view
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDraftContent, setCurrentDraftContent] = useState<string>('');
  const [currentDraftTitle, setCurrentDraftTitle] = useState<string>('');
  
  // Selected values
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedWriter, setSelectedWriter] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedIdea, setSelectedIdea] = useState<string>('');
  const [selectedTrend, setSelectedTrend] = useState<string>('');
  
  // Drafts from the database
  const [drafts, setDrafts] = useState<Draft[]>([]);
  
  // Form values

  
  const [specificitiesDraft, setSpecificitiesDraft] = useState<string>('');
  const [specificitiesForImages, setSpecificitiesForImages] = useState<string>('');
  const [draftContent, setDraftContent] = useState<string>('');
  
  // Data from API
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [writers, setWriters] = useState<Writer[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState({
    companies: true,
    users: true,
    writers: true,
    platforms: true,
    ideas: true,
    trends: true,
    drafts: false
  });

  // Fetch data from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('/api/companies');
        if (!response.ok) throw new Error('Failed to fetch companies');
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, companies: false }));
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, users: false }));
      }
    };

    const fetchWriters = async () => {
      try {
        const response = await fetch('/api/writer-profiles');
        if (!response.ok) throw new Error('Failed to fetch writers');
        const data = await response.json();
        setWriters(data);
      } catch (error) {
        console.error('Error fetching writers:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, writers: false }));
      }
    };

    const fetchPlatforms = async () => {
      try {
        const response = await fetch('/api/platforms');
        if (!response.ok) throw new Error('Failed to fetch platforms');
        const data = await response.json();
        setPlatforms(data);
      } catch (error) {
        console.error('Error fetching platforms:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, platforms: false }));
      }
    };
    
    const fetchIdeas = async () => {
      try {
        const response = await fetch('/api/content-ideas');
        if (!response.ok) throw new Error('Failed to fetch content ideas');
        const data = await response.json();
        setIdeas(data);
      } catch (error) {
        console.error('Error fetching content ideas:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, ideas: false }));
      }
    };

    const fetchTrends = async () => {
      try {
        const response = await fetch('/api/trends');
        if (!response.ok) throw new Error('Failed to fetch trends');
        const data = await response.json();
        setTrends(data.trends || []);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, trends: false }));
      }
    };

    fetchCompanies();
    fetchUsers();
    fetchWriters();
    fetchPlatforms();
    fetchIdeas();
    fetchTrends();
  }, []);
  
  // Handle idea selection and populate form fields
  useEffect(() => {
    if (selectedIdea) {
      const selectedIdeaData = ideas.find(idea => idea._id === selectedIdea);
      if (selectedIdeaData) {
        // Set form values from selected idea
        setSpecificitiesDraft(selectedIdeaData.specificitiesDraft || '');
        setSpecificitiesForImages(selectedIdeaData.specificitiesForImages || '');
        
        // Set draft content if available
        setDraftContent(selectedIdeaData.drafts || '');
        
        // Set dropdown values if they exist in the idea
        if (selectedIdeaData.company) setSelectedCompany(selectedIdeaData.company);
        if (selectedIdeaData.writer) setSelectedWriter(selectedIdeaData.writer);
        if (selectedIdeaData.platform) setSelectedPlatform(selectedIdeaData.platform);
        if (selectedIdeaData.status) setStatus(selectedIdeaData.status);
        if (selectedIdeaData.userId) setSelectedUser(selectedIdeaData.userId);
      }
    }
  }, [selectedIdea, ideas]);

  // Fetch all drafts or drafts for a specific trend
  const fetchDrafts = async (trendId?: string) => {
    console.log(`🔍 Fetching drafts${trendId ? ` for trend ID: ${trendId}` : ' (all drafts)'}`);
    setIsLoading(prev => ({ ...prev, drafts: true }));
    setIsFetchingDrafts(true);
    
    try {
      const apiUrl = trendId ? `/api/drafts?trendId=${trendId}` : '/api/drafts';
      console.log(`📡 Making API request to: ${apiUrl}`);
      
      const response = await fetch(apiUrl);
      console.log(`📥 API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API error response: ${errorText}`);
        throw new Error(`Failed to fetch drafts: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`📊 Received drafts data:`, data);
      
      setDrafts(data.drafts || []);
      console.log(`📋 Number of drafts found: ${data.drafts?.length || 0}`);
      
      // If drafts are found, update the draft content with the most recent draft
      if (data.drafts && data.drafts.length > 0) {
        // Sort drafts by creation date (newest first)
        const sortedDrafts = [...data.drafts].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        console.log(`✅ Setting draft content from most recent draft:`, sortedDrafts[0]);
        // Set the draft content to the most recent draft
        setDraftContent(sortedDrafts[0].content || '');
      } else {
        console.log(`ℹ️ No drafts found, using demo content`);
      }
    } catch (error) {
      console.error('❌ Error fetching drafts:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, drafts: false }));
      setIsFetchingDrafts(false);
      console.log(`🏁 Draft fetching process completed`);
    }
  };
  
  // Fetch all drafts on component load
  useEffect(() => {
    fetchDrafts();
  }, []);
  
  // Fetch drafts when trend is selected
  useEffect(() => {
    if (selectedTrend) {
      fetchDrafts(selectedTrend);
    }
  }, [selectedTrend]);

  const generateContent = async () => {
    if (!selectedCompany || !selectedWriter || !selectedPlatform || !selectedTrend) {
      alert('Please select company, writer, platform and trend before generating content');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Get the selected trend details
      const selectedTrendData = trends.find(trend => trend._id === selectedTrend);
      
      if (!selectedTrendData) {
        throw new Error('Selected trend not found');
      }
      
      // Log the selected trend for debugging
      console.log('Selected trend:', selectedTrend);
      console.log('Selected trend data:', selectedTrendData);
      
      // Prepare the payload for our proxy API
      const proxyPayload = {
        trendId: selectedTrend,
        trendName: selectedTrendData.name || '',
        companyId: selectedCompany,
        writerId: selectedWriter,
        platformId: selectedPlatform,
        userId: selectedUser || '',
        status: status,
        specificitiesDraft: specificitiesDraft || '',
        specificitiesForImages: specificitiesForImages || '',
        timestamp: new Date().toISOString()
      };
      
      console.log('Sending request to n8n proxy API with payload:', proxyPayload);
      
      // Call our proxy API endpoint instead of the external webhook directly
      const response = await fetch('/api/webhook/n8n-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(proxyPayload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger external webhook');
      }
      
      // Also log the generation in our internal system
      try {
        const internalResponse = await fetch('/api/webhook/content-generation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contentIdeaId: selectedTrend, // Use trendId as contentIdeaId for backward compatibility
            content: selectedTrendData.name || '',
            trendId: selectedTrend,
            trendName: selectedTrendData.name || '',
            companyId: selectedCompany,
            writerId: selectedWriter,
            platformId: selectedPlatform,
            userId: selectedUser || '',
            status: status,
            specificitiesDraft: specificitiesDraft,
            specificitiesForImages: specificitiesForImages,
            timestamp: new Date().toISOString()
          }),
        });
        
        if (!internalResponse.ok) {
          console.warn('Internal logging API returned non-OK status:', internalResponse.status);
        }
      } catch (internalError) {
        console.error('Error calling internal logging API:', internalError);
        // Continue execution even if internal logging fails
      }
      
      const result = await response.json().catch((error) => {
        console.error('Error parsing webhook response:', error);
        return {};
      });
      console.log('External webhook response:', result);
      
      // Refetch content ideas to update the list
      try {
        const ideasResponse = await fetch('/api/content-ideas');
        if (ideasResponse.ok) {
          const updatedIdeas = await ideasResponse.json();
          setIdeas(updatedIdeas);
          console.log('Content ideas refreshed after generation');
        }
      } catch (refreshError) {
        console.error('Error refreshing ideas:', refreshError);
        // Continue with success message even if refresh fails
      }
      
      // Success message
      alert('Content generation initiated successfully!');
      
      console.log(`🔄 Fetching drafts after content generation for trend: ${selectedTrend}`);
      // Fetch drafts for the selected trend after generation
      await fetchDrafts(selectedTrend);
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const pushToPipeline = async () => {
    if (!selectedIdea || !selectedPlatform || drafts.length === 0) {
      alert('Please select an idea, platform, and ensure drafts are available before pushing to pipeline');
      return;
    }
    
    setIsPushing(true);
    
    try {
      // Prepare the webhook URL with query parameters
      const webhookUrl = new URL('https://n8n.srv775152.hstgr.cloud/webhook/6277cfcb-c443-49eb-9478-2dc71fe5cb12');
      
      // Add query parameters
      webhookUrl.searchParams.append('draftId', drafts[0]?._id || ''); // Use the first draft (latest)
      webhookUrl.searchParams.append('ideaId', selectedIdea);
      webhookUrl.searchParams.append('platformId', selectedPlatform);
      
      console.log(`🚀 Pushing to content pipeline with URL: ${webhookUrl.toString()}`);
      
      // Call the webhook
      const response = await fetch(webhookUrl.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to push to pipeline: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json().catch(() => ({}));
      console.log('Pipeline push response:', result);
      
      // Success message
      alert('Successfully pushed to content pipeline!');
    } catch (error: unknown) {
      console.error('Error pushing to pipeline:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to push to content pipeline: ${errorMessage}`);
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <span>💡</span> Idea Workshop
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and refine content ideas for your campaigns
          </p>
        </div>
      </div>

      {/* Top Bar with Dropdown */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Select value={selectedIdeaTitle} onValueChange={(value) => {
            setSelectedIdeaTitle(value);
            const selectedIdeaData = ideas.find(idea => idea._id === value);
            if (selectedIdeaData) {
              setSelectedIdea(value);
            }
          }}>
            <SelectTrigger className="w-[300px]">
              {isLoading.ideas ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  <span>Loading ideas...</span>
                </div>
              ) : (
                <SelectValue placeholder="Select an idea" />
              )}
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {ideas.length === 0 && !isLoading.ideas ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No ideas found
                </div>
              ) : (
                ideas.map((idea) => (
                  <SelectItem key={idea._id} value={idea._id}>
                    {idea.content.length > 50 ? `${idea.content.substring(0, 50)}...` : idea.content}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Panel Card */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Trend Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="trend" className="text-sm font-medium">
                Trend
              </Label>
              <Select value={selectedTrend} onValueChange={(value) => {
                console.log(`🔄 Trend selected: ${value}`);
                setSelectedTrend(value);
                // Also update selectedIdea for backward compatibility with existing code
                setSelectedIdea(value);
                // Fetch drafts for the selected trend
                fetchDrafts(value);
              }}>
                <SelectTrigger id="trend" className="w-full">
                  {isLoading.trends ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select trend" />
                  )}
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {trends.length === 0 && !isLoading.trends ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      No trends found
                    </div>
                  ) : (
                    trends.map((trend) => (
                      <SelectItem key={trend._id} value={trend._id}>
                        {trend.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Company Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company
              </Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger id="company" className="w-full">
                  {isLoading.companies ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select company" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Writer Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="writer" className="text-sm font-medium">
                Writer
              </Label>
              <Select value={selectedWriter} onValueChange={setSelectedWriter}>
                <SelectTrigger id="writer" className="w-full">
                  {isLoading.writers ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select writer" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {writers.map((writer) => (
                    <SelectItem key={writer._id} value={writer._id}>
                      {writer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Platform Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-sm font-medium">
                Platform
              </Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger id="platform" className="w-full">
                  {isLoading.platforms ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select platform" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform._id} value={platform._id}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger 
                  id="status" 
                  style={{
                    backgroundColor: status === 'Draft' ? '#374151' : 
                                    status === 'In Review' ? '#1e40af' : 
                                    status === 'Posted' ? '#065f46' : 
                                    status === 'Archived' ? '#991b1b' : '#1f2937',
                    color: 'white'
                  }}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft" className="hover:bg-gray-700 data-[highlighted]:bg-gray-700 data-[highlighted]:text-white">Draft</SelectItem>
                  <SelectItem value="In Review" className="hover:bg-blue-700 data-[highlighted]:bg-blue-700 data-[highlighted]:text-white">In Review</SelectItem>
                  <SelectItem value="Posted" className="hover:bg-green-700 data-[highlighted]:bg-green-700 data-[highlighted]:text-white">Posted</SelectItem>
                  <SelectItem value="Archived" className="hover:bg-red-700 data-[highlighted]:bg-red-700 data-[highlighted]:text-white">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* User Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="user" className="text-sm font-medium">
                User
              </Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user" className="w-full">
                  {isLoading.users ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select user" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Generate Content Button - Centered */}
            <div className="flex items-end justify-center col-span-1 md:col-span-2 lg:col-span-3 mt-4">
              <Button 
                className="bg-purple-500 hover:bg-purple-600 text-white h-10 px-8"
                onClick={generateContent}
                disabled={isGenerating || !selectedCompany || !selectedWriter || !selectedPlatform || !selectedIdea}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate Content
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Push ALL drafts bar */}
      <div className="bg-black border border-gray-800 rounded-md p-3 flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
          <span className="font-medium text-white">Push ALL drafts to Content Pipeline</span>
        </div>
        <Button 
          variant="outline" 
          className="h-8 border-gray-700 text-gray-200 hover:bg-gray-900"
          onClick={pushToPipeline}
          disabled={isPushing || !selectedIdea || !selectedPlatform || drafts.length === 0}
        >
          {isPushing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Pushing...
            </>
          ) : (
            'Push'
          )}
        </Button>
      </div>



      {/* Drafts Section */}
      <Card className="shadow-md border-gray-800 bg-black">
        <CardHeader className="flex flex-row items-center justify-between bg-black border-b border-gray-800">
          <CardTitle className="text-xl font-bold flex items-center">
            <span className="text-gray-400 mr-2">📄</span> Drafts
            {drafts.length > 0 && <Badge className="ml-2 bg-gray-800 text-gray-300">{drafts.length}</Badge>}
          </CardTitle>
          {isLoading.drafts && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
        </CardHeader>
        <CardContent className="p-0 bg-black">
          {drafts.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {drafts.map((draft, index) => (
                <div 
                  key={draft._id} 
                  className="p-5 hover:bg-gray-900 transition-colors cursor-pointer bg-black" 
                  onClick={() => setDraftContent(draft.content)}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center">
                        <span className="text-gray-400 mr-2">{index === 0 ? '✨' : '📄'}</span>
                        Draft {index + 1}
                      </h3>
                      <Badge variant={index === 0 ? "default" : "outline"} className={index === 0 ? "bg-gray-800 text-gray-300" : "border-gray-700 text-gray-400"}>
                        {index === 0 ? "Latest" : new Date(draft.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-950 rounded-md p-3 border border-gray-800">
                        <div className="text-sm text-gray-500 mb-1">Trend</div>
                        <div className="font-medium flex items-center">
                          {draft.trendId ? (
                            <Badge className="bg-black text-gray-400 hover:bg-gray-900 border border-gray-800">
                              {trends.find(t => t._id === draft.trendId)?.name || draft.trendId}
                            </Badge>
                          ) : (
                            <span className="text-gray-500">Not specified</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-950 rounded-md p-3 border border-gray-800">
                        <div className="text-sm text-gray-500 mb-1">Platform</div>
                        <div className="font-medium flex items-center">
                          {(draft as any).platform ? (
                            <Badge className="bg-black text-gray-400 hover:bg-gray-900 border border-gray-800">
                              {platforms.find(p => p._id === selectedPlatform)?.name || (draft as any).platform}
                            </Badge>
                          ) : (
                            <span className="text-gray-500">Not specified</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-gray-950 rounded-md p-3 border border-gray-800">
                        <div className="text-sm text-gray-500 mb-1">Writer</div>
                        <div className="font-medium text-gray-300">
                          {writers.find(w => w._id === selectedWriter)?.name || '–'}
                        </div>
                      </div>
                      
                      <div className="bg-gray-950 rounded-md p-3 border border-gray-800">
                        <div className="text-sm text-gray-500 mb-1">Created</div>
                        <div className="font-medium text-gray-300">
                          {new Date(draft.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-950 rounded-md p-4 border border-gray-800">
                      <div className="text-sm text-gray-500 mb-2">Content Preview</div>
                      <div className="text-sm text-gray-300 space-y-2">
                        {draft.content.split('\n').slice(0, 3).map((line, i) => {
                          // Format headings (lines starting with ### or ##)
                          if (line.startsWith('###')) {
                            return (
                              <div key={i} className="font-semibold text-gray-100">
                                {line.replace(/^###\s*/, '')}
                              </div>
                            );
                          }
                          // Format bold text (text between ** **)
                          else if (line.includes('**')) {
                            return (
                              <div key={i} className="font-medium">
                                {line.split('**').map((part, j) => (
                                  j % 2 === 0 ? 
                                    <span key={j}>{part}</span> : 
                                    <span key={j} className="font-bold text-white">{part}</span>
                                ))}
                              </div>
                            );
                          } 
                          // Regular text
                          else {
                            return <div key={i} className="line-clamp-1">{
                              line.length > 100 ? `${line.substring(0, 100)}...` : line
                            }</div>;
                          }
                        })}
                        {draft.content.split('\n').length > 3 && (
                          <div className="text-xs text-gray-500 italic mt-1">More content available...</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 mr-2">Status:</span>
                        <Badge className="bg-gray-800 text-gray-300 border border-gray-700">
                          Draft
                        </Badge>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-gray-400 border-gray-700 hover:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDraftContent(draft.content);
                          setCurrentDraftContent(draft.content);
                          setCurrentDraftTitle(`Draft ${index + 1}${draft.title ? `: ${draft.title}` : ''}`);
                          setIsDialogOpen(true);
                        }}
                      >
                        View Full Content
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 bg-gray-800 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-medium text-lg">No drafts found</h3>
                <p className="text-gray-400 max-w-sm">
                  Select a trend and generate content to create drafts. They will appear here once created.
                </p>
                
                <div className="pt-4 grid grid-cols-2 gap-4 w-full max-w-md">
                  <div className="bg-gray-950 rounded-md p-3 border border-gray-800">
                    <div className="text-sm text-gray-400 mb-1">Selected Trend</div>
                    <div className="font-medium truncate">
                      {trends.find(t => t._id === selectedTrend)?.name || 'None selected'}
                    </div>
                  </div>
                  
                  <div className="bg-gray-950 rounded-md p-3 border border-gray-800">
                    <div className="text-sm text-gray-500 mb-1">Selected Platform</div>
                    <div className="font-medium truncate text-gray-300">
                      {platforms.find(p => p._id === selectedPlatform)?.name || 'None selected'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Attachments Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Illustrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">No attachments</p>
              <Button variant="ghost" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Illustration variations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-dashed rounded-md p-8 flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">No attachments</p>
              <Button variant="ghost" size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Content Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-gradient-to-b from-black to-gray-900 border border-gray-800 p-0">
          <div className="sticky top-0 z-10 bg-black border-b border-gray-800 p-6 backdrop-blur-sm bg-opacity-90">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-gray-400">📄</span>
                {currentDraftTitle}
              </DialogTitle>
            </DialogHeader>
          </div>
          
          <div className="p-6 pt-4">
            <div className="bg-gray-950 rounded-lg border border-gray-800 p-8 shadow-inner">
              <div className="prose prose-lg prose-invert max-w-none">
                {currentDraftContent.split('\n').map((line, index) => {
                  // Format H1 headings (lines starting with # or --- **)
                  if (line.startsWith('#') && !line.startsWith('##')) {
                    return (
                      <h1 key={index} className="text-3xl font-bold text-white mb-6 mt-8 pb-2 border-b border-gray-700">
                        {line.replace(/^#\s*/, '')}
                      </h1>
                    );
                  }
                  // Format H2 headings (lines starting with ##)
                  else if (line.startsWith('##') && !line.startsWith('###')) {
                    return (
                      <h2 key={index} className="text-2xl font-bold text-white mb-4 mt-6">
                        {line.replace(/^##\s*/, '')}
                      </h2>
                    );
                  }
                  // Format H3 headings (lines starting with ###)
                  else if (line.startsWith('###')) {
                    return (
                      <h3 key={index} className="text-xl font-semibold text-gray-100 mb-3 mt-5">
                        {line.replace(/^###\s*/, '')}
                      </h3>
                    );
                  }
                  // Format special title format (lines with --- **Title**)
                  else if (line.startsWith('---') && line.includes('**')) {
                    return (
                      <h1 key={index} className="text-3xl font-bold text-white mb-6 mt-8 pb-2 border-b border-gray-700">
                        {line.replace(/---\s*\*\*|\*\*/g, '')}
                      </h1>
                    );
                  }
                  // Format bold text (text between ** **)
                  else if (line.includes('**')) {
                    return (
                      <p key={index} className="mb-4 text-gray-200 leading-relaxed">
                        {line.split('**').map((part, j) => (
                          j % 2 === 0 ? 
                            <span key={j}>{part}</span> : 
                            <span key={j} className="font-bold text-white">{part}</span>
                        ))}
                      </p>
                    );
                  }
                  // Format emoji emphasis (text with 🌀 emoji)
                  else if (line.includes('🌀') || line.includes('💡') || line.includes('✨') || line.includes('🚀')) {
                    return (
                      <p key={index} className="mb-4 text-gray-200 leading-relaxed bg-gray-900 p-3 rounded-md border-l-4 border-purple-700">
                        {line}
                      </p>
                    );
                  }
                  // Empty line creates spacing
                  else if (line.trim() === '') {
                    return <div key={index} className="h-2"></div>;
                  }
                  // Regular paragraph
                  else {
                    return (
                      <p key={index} className="mb-4 text-gray-200 leading-relaxed">
                        {line}
                      </p>
                    );
                  }
                })}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button 
                variant="outline" 
                className="bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800 hover:text-white"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IdeaWorkshopContent;
