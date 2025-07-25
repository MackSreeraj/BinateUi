'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Search, Filter, Inbox, Paperclip, User, Wrench } from 'lucide-react';
import CreateIdeaModal from './CreateIdeaModal';

interface User {
  id: string;
  name: string;
}

interface Idea {
  _id: string;
  content: string;
  userId: string | null;
  trendId: string | null;
  specificitiesDraft: string | null;
  specificitiesForImages: string | null;
  writer: string | null;
  platform: string | null;
  drafts: string | null;
  company: string | null;
  status: string;
  createdAt: string;
}

interface FilterState {
  idea: {
    condition: 'contains' | 'equals' | 'startsWith' | 'endsWith';
    value: string;
  };
  users: string[];
}

const IdeasContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    idea: {
      condition: 'contains',
      value: '',
    },
    users: ['Deleted user', 'Deleted user'],
  });

  const [showResults, setShowResults] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleResetFilters = () => {
    setFilters({
      idea: {
        condition: 'contains',
        value: '',
      },
      users: [],
    });
    setShowResults(false);
  };

  const handleIdeaConditionChange = (value: 'contains' | 'equals' | 'startsWith' | 'endsWith') => {
    setFilters({
      ...filters,
      idea: {
        ...filters.idea,
        condition: value,
      },
    });
  };

  const handleIdeaValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      idea: {
        ...filters.idea,
        value: e.target.value,
      },
    });
  };

  const handleRemoveUser = (userId: string) => {
    setFilters({
      ...filters,
      users: filters.users.filter(id => id !== userId),
    });
  };
  
  // Fetch ideas when component mounts
  useEffect(() => {
    fetchIdeas();
  }, []);
  
  const fetchIdeas = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/content-ideas', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch content ideas');
      }
      const data = await response.json();
      setIdeas(data);
      setShowResults(data.length > 0);
    } catch (error) {
      console.error('Error fetching content ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleIdeaCreated = () => {
    fetchIdeas();
  };
  
  // Handle navigation to Idea Workshop with the selected idea ID
  const handleNavClick = (nav: string, ideaId?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', nav);
    if (ideaId) {
      params.set('ideaId', ideaId);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <span>💡</span> Content Ideas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Filter and manage content ideas generated from trends
          </p>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="idea-filter" className="text-sm font-medium">
                  Idea
                </Label>
                <div className="flex gap-2">
                  <Select 
                    value={filters.idea.condition}
                    onValueChange={(value: any) => handleIdeaConditionChange(value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="startsWith">Starts with</SelectItem>
                      <SelectItem value="endsWith">Ends with</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="idea-filter"
                    value={filters.idea.value}
                    onChange={handleIdeaValueChange}
                    placeholder="Filter by idea content..."
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <Label className="text-sm font-medium">User</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">has any of</span>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[38px] p-2 border rounded-md">
                    {filters.users.map((user, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="px-2 py-1 flex items-center gap-1"
                      >
                        {user}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveUser(user)} 
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                  className="whitespace-nowrap"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ideas List or Empty State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading ideas...</span>
        </div>
      ) : showResults && ideas.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Content Ideas ({ideas.length})</h3>
            <Button className="gap-2" onClick={handleOpenModal}>
              <Plus className="h-4 w-4" /> Add content
            </Button>
          </div>
          <div className="grid gap-4">
            {ideas.map((idea) => (
              <Card key={idea._id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`${idea.status === 'Draft' ? 'bg-purple-100 text-purple-800' : idea.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {idea.status || 'Draft'}
                        </Badge>
                        {idea.platform && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            {idea.platform}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mt-2">{idea.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        {idea.trendId && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            From Trend
                          </Badge>
                        )}
                        {idea.userId && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {idea.writer || 'Assigned'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button 
                        size="sm" 
                        className="bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                        onClick={() => handleNavClick('Idea Workshop', idea._id)}
                      >
                        <Wrench className="h-3 w-3 mr-1" /> Open Workshop
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
            <Inbox className="h-12 w-12 text-blue-300" />
          </div>
          <h3 className="text-xl font-medium text-center mb-2">No contents exist or match the current filters</h3>
          <p className="text-muted-foreground text-center mb-6">
            Try adjusting your filters or add new content
          </p>
          <Button className="gap-2" onClick={handleOpenModal}>
            <Plus className="h-4 w-4" /> Add content
          </Button>
        </div>
      )}
      
      {/* Create Idea Modal */}
      <CreateIdeaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onIdeaCreated={handleIdeaCreated}
      />
    </div>
  );
};

export default IdeasContent;
