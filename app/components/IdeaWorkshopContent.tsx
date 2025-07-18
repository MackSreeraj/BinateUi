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

interface Idea {
  _id: string;
  content: string;
  userId?: string;
  attachmentPath?: string;
  createdAt: string;
}

const IdeaWorkshopContent = () => {
  const [ideaKeyword, setIdeaKeyword] = useState('hotels');
  const [status, setStatus] = useState('Draft');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Selected values
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedWriter, setSelectedWriter] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [selectedIdea, setSelectedIdea] = useState<string>('');
  
  // Data from API
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [writers, setWriters] = useState<Writer[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState({
    companies: true,
    users: true,
    writers: true,
    platforms: true,
    ideas: true
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
        const response = await fetch('/api/ideas');
        if (!response.ok) throw new Error('Failed to fetch ideas');
        const data = await response.json();
        setIdeas(data);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setIsLoading(prev => ({ ...prev, ideas: false }));
      }
    };

    fetchCompanies();
    fetchUsers();
    fetchWriters();
    fetchPlatforms();
    fetchIdeas();
  }, []);
  
  const generateContent = async () => {
    if (!selectedCompany || !selectedWriter || !selectedPlatform || !selectedIdea) {
      alert('Please select company, writer, platform and idea before generating content');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate content generation (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success message
      alert('Content generated successfully!');
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
          <Select defaultValue={ideaKeyword}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select keyword" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hotels">hotels</SelectItem>
              <SelectItem value="travel">travel</SelectItem>
              <SelectItem value="vacation">vacation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Panel Card */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Idea Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="idea" className="text-sm font-medium">
                Idea
              </Label>
              <Select value={selectedIdea} onValueChange={setSelectedIdea}>
                <SelectTrigger id="idea" className="w-full">
                  {isLoading.ideas ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select idea" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  {ideas.map((idea) => (
                    <SelectItem key={idea._id} value={idea._id}>
                      {idea.content.length > 30 ? `${idea.content.substring(0, 30)}...` : idea.content}
                    </SelectItem>
                  ))}
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
        <div className="space-y-4">
          <Label className="text-sm font-medium">Specificities Draft</Label>
          <Textarea 
            placeholder="Enter specificities draft here..." 
            className="min-h-[150px]"
          />
        </div>
        <div className="space-y-4">
          <Label className="text-sm font-medium">Specificities for Images</Label>
          <Textarea 
            placeholder="Enter specificities for images here..." 
            className="min-h-[150px]"
          />
        </div>
      </div>

      {/* Push ALL drafts bar */}
      <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
          <span className="font-medium">Push ALL drafts to Content Pipeline</span>
        </div>
        <Button variant="outline" className="h-8">
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
