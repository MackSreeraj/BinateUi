'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const IdeaWorkshopContent = () => {
  const [selectedIdeaTitle, setSelectedIdeaTitle] = useState<string>('');
  const [status, setStatus] = useState('Draft');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Selected values
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedWriter, setSelectedWriter] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedIdea, setSelectedIdea] = useState<string>('');
  const [selectedTrend, setSelectedTrend] = useState<string>('');
  
  // Form values and demo data
  const demoSpecificitiesDraft = "Target audience: Marketing professionals aged 30-45\nTone: Professional yet conversational\nKey points to cover:\n- The impact of AI on content creation workflows\n- How automation can save up to 15 hours per week\n- Case studies from enterprise companies\n- Integration with existing marketing tools\n\nCall to action: Schedule a personalized demo";
  
  const demoSpecificitiesForImages = "Style: Modern, minimalist with blue and purple gradient\nElements to include:\n- Person using laptop with AI visualization\n- Split screen showing before/after workflow\n- Data visualization showing time savings\n- Clean white background with subtle grid pattern\n\nBranding: Include Binate logo in bottom right corner\nDimensions: 1200x628px (optimal for LinkedIn)";
  
  const demoDraftContent = "# How AI is Transforming Content Creation\n\nIn today's fast-paced digital landscape, content creation has become both more important and more challenging than ever. Marketing teams are expected to produce high-quality, engaging content across multiple platforms while maintaining brand consistency and driving measurable results.\n\n## The Challenge\n\nMany marketing professionals are spending up to 60% of their week on content creation tasks that could be automated or streamlined. This includes:\n\n- Researching trending topics\n- Drafting initial content versions\n- Formatting for different platforms\n- Basic editing and proofreading\n\n## The Binate Solution\n\nBinate's AI Content Engine helps marketing teams reclaim their time by automating the repetitive aspects of content creation while enhancing creativity and strategic thinking.\n\n### Key Benefits:\n\n1. **Time Savings**: Reduce content production time by up to 70%\n2. **Consistency**: Maintain brand voice across all channels\n3. **Scalability**: Create more content without adding headcount\n4. **Quality**: AI-powered suggestions improve engagement metrics\n\nReady to transform your content workflow? [Schedule a demo today](#)";
  
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
    trends: true
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
    } catch (error) {
      console.error('Error generating content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
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
                setSelectedTrend(value);
                // Also update selectedIdea for backward compatibility with existing code
                setSelectedIdea(value);
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

      {/* Draft & Processing Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-800 hover:shadow-md transition-shadow bg-black">
          <CardHeader className="bg-black pb-2 border-b border-gray-800">
            <CardTitle className="text-base font-medium flex items-center gap-2 text-white">
              <span className="text-purple-400">✦</span> Specificities Draft
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-black">
            <div className="p-4 min-h-[150px] whitespace-pre-wrap text-gray-200 leading-relaxed">
              {specificitiesDraft || demoSpecificitiesDraft}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-800 hover:shadow-md transition-shadow bg-black">
          <CardHeader className="bg-black pb-2 border-b border-gray-800">
            <CardTitle className="text-base font-medium flex items-center gap-2 text-white">
              <span className="text-blue-400">🖼️</span> Specificities for Images
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-black">
            <div className="p-4 min-h-[150px] whitespace-pre-wrap text-gray-200 leading-relaxed">
              {specificitiesForImages || demoSpecificitiesForImages}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Display Draft Content */}
      <Card className="shadow-sm border-gray-800 hover:shadow-md transition-shadow mt-6 bg-black">
        <CardHeader className="bg-black pb-2 border-b border-gray-800">
          <CardTitle className="text-base font-medium flex items-center gap-2 text-white">
            <span className="text-emerald-400">✨</span> Specificities of Draft
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-black">
          <div className="p-4 whitespace-pre-wrap text-gray-200 leading-relaxed">
            {draftContent || demoDraftContent}
          </div>
        </CardContent>
      </Card>

      {/* Push ALL drafts bar */}
      <div className="bg-black border border-gray-800 rounded-md p-3 flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
          <span className="font-medium text-white">Push ALL drafts to Content Pipeline</span>
        </div>
        <Button variant="outline" className="h-8 border-gray-700 text-gray-200 hover:bg-gray-900">
          Push
        </Button>
      </div>

      {/* Processing Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <Check className="mr-2 h-4 w-4" /> Processing
        </Button>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <Check className="mr-2 h-4 w-4" /> Processing
        </Button>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <Check className="mr-2 h-4 w-4" /> Processing
        </Button>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <Check className="mr-2 h-4 w-4" /> Processing
        </Button>
      </div>

      {/* Drafts Section */}
      <Card>
        <CardHeader>
          <CardTitle>Drafts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4">
            <div className="flex flex-col space-y-3">
              <div className="font-medium">hotels</div>
              
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground w-40">Content Idea:</span>
                <Badge variant="outline">
                  {ideas.find(i => i._id === selectedIdea)?.content || '–'}
                </Badge>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground w-40">Company:</span>
                <Badge variant="outline">
                  {companies.find(c => c._id === selectedCompany)?.name || '–'}
                </Badge>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground w-40">Writer:</span>
                <Badge variant="outline">
                  {writers.find(w => w._id === selectedWriter)?.name || '–'}
                </Badge>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground w-40">Platform:</span>
                <Badge variant="outline">
                  {platforms.find(p => p._id === selectedPlatform)?.name || '–'}
                </Badge>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground w-40">User:</span>
                <Badge variant="outline">
                  {users.find(u => u._id === selectedUser)?.username || '–'}
                </Badge>
              </div>
              
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground w-40">Is In Content Pipeline:</span>
                <X className="h-4 w-4 text-red-500" />
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default IdeaWorkshopContent;
