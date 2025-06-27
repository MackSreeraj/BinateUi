'use client';

import { useState } from 'react';
import { Plus, X, Filter, Search, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type Filter = {
  id: string;
  field: string;
  condition: string;
  value: string;
};

type User = {
  id: string;
  name: string;
};

export default function ContentList() {
  const [filters, setFilters] = useState<Filter[]>([
    { id: '1', field: 'Idea', condition: 'contains', value: '' },
    { id: '2', field: 'User', condition: 'has any of', value: '' },
  ]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([
    { id: '1', name: 'Deleted user' },
  ]);
  const [isUserSelectorOpen, setIsUserSelectorOpen] = useState(false);

  const fieldOptions = [
    { value: 'Idea', label: 'Idea' },
    { value: 'User', label: 'User' },
    { value: 'Status', label: 'Status' },
    { value: 'Date', label: 'Date' },
  ];

  const conditionOptions = [
    { value: 'contains', label: 'contains' },
    { value: 'does not contain', label: 'does not contain' },
    { value: 'is', label: 'is' },
    { value: 'is not', label: 'is not' },
    { value: 'has any of', label: 'has any of' },
  ];

  const addFilter = () => {
    setFilters([
      ...filters,
      {
        id: Date.now().toString(),
        field: 'Idea',
        condition: 'contains',
        value: '',
      },
    ]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  const updateFilter = (id: string, field: string, value: string) => {
    setFilters(
      filters.map(filter =>
        filter.id === id ? { ...filter, [field]: value } : filter
      )
    );
  };

  const removeUser = (id: string) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== id));
  };

  const resetFilters = () => {
    setFilters([
      { id: '1', field: 'Idea', condition: 'contains', value: '' },
      { id: '2', field: 'User', condition: 'has any of', value: '' },
    ]);
    setSelectedUsers([{ id: '1', name: 'Deleted user' }]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter Bar */}
      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap items-start gap-3">
          {filters.map((filter, index) => (
            <div key={filter.id} className="flex items-center gap-2 bg-background p-2 rounded-md">
              <select
                className="text-sm border rounded px-2 py-1 bg-background"
                value={filter.field}
                onChange={e => updateFilter(filter.id, 'field', e.target.value)}
              >
                {fieldOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                className="text-sm border rounded px-2 py-1 bg-background"
                value={filter.condition}
                onChange={e => updateFilter(filter.id, 'condition', e.target.value)}
              >
                {conditionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {filter.field === 'User' ? (
                <div className="relative">
                  <div 
                    className="min-w-[200px] border rounded px-2 py-1 bg-background cursor-pointer flex items-center gap-1 flex-wrap"
                    onClick={() => setIsUserSelectorOpen(!isUserSelectorOpen)}
                  >
                    {selectedUsers.length > 0 ? (
                      selectedUsers.map(user => (
                        <Badge 
                          key={user.id} 
                          variant="secondary" 
                          className="flex items-center gap-1"
                        >
                          {user.name}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeUser(user.id);
                            }}
                          />
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">Select users</span>
                    )}
                  </div>
                  {isUserSelectorOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg p-2">
                      {/* User selection options would go here */}
                      <div className="p-2 text-sm text-muted-foreground">
                        User selection would appear here
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder="Enter a value"
                  className="w-40"
                  value={filter.value}
                  onChange={e => updateFilter(filter.id, 'value', e.target.value)}
                />
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => removeFilter(filter.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          <Button variant="outline" size="sm" onClick={addFilter}>
            <Plus className="h-4 w-4 mr-1" />
            Add Filter
          </Button>
          
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="relative w-48 h-48 mb-6">
          <div className="absolute inset-0 bg-muted/50 rounded-lg blur-sm">
            <div className="h-1/2 border-b border-muted-foreground/20">
              <div className="h-4 w-3/4 bg-muted-foreground/10 rounded m-2"></div>
              <div className="h-3 w-1/2 bg-muted-foreground/10 rounded m-2"></div>
            </div>
            <div className="h-1/2">
              <div className="h-4 w-3/4 bg-muted-foreground/10 rounded m-2"></div>
              <div className="h-3 w-1/2 bg-muted-foreground/10 rounded m-2"></div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="h-12 w-12 text-muted-foreground/30" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">No contents exist or match the current filters</h3>
        <p className="text-muted-foreground mb-6">
          Try adjusting your filters or add new content to get started
        </p>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add content
        </Button>
      </div>
    </div>
  );
}
