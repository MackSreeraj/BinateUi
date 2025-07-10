'use client';

import { useState } from 'react';
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
import { X, Plus, Search, Filter, Inbox } from 'lucide-react';

interface User {
  id: string;
  name: string;
}

interface FilterState {
  idea: {
    condition: 'contains' | 'equals' | 'startsWith' | 'endsWith';
    value: string;
  };
  users: string[];
}

const IdeasContent = () => {
  const [filters, setFilters] = useState<FilterState>({
    idea: {
      condition: 'contains',
      value: '',
    },
    users: ['Deleted user', 'Deleted user'],
  });

  const [showResults, setShowResults] = useState(false);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <span>💡</span> Ideas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Filter and manage content ideas for your campaigns
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

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-16">
        <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
          <Inbox className="h-12 w-12 text-blue-300" />
        </div>
        <h3 className="text-xl font-medium text-center mb-2">No contents exist or match the current filters</h3>
        <p className="text-muted-foreground text-center mb-6">
          Try adjusting your filters or add new content
        </p>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add content
        </Button>
      </div>
    </div>
  );
};

export default IdeasContent;
