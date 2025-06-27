'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock data for trends
const trendCategories = [
  {
    category: 'Technology',
    trends: [
      { id: 1, name: 'AI Advancements', volume: 24500, change: 12 },
      { id: 2, name: 'Web3 Updates', volume: 18900, change: 8 },
    ],
  },
  {
    category: 'Business',
    trends: [
      { id: 3, name: 'Market Trends', volume: 32000, change: -5 },
      { id: 4, name: 'Startup Funding', volume: 15000, change: 22 },
    ],
  },
  {
    category: 'Social Media',
    trends: [
      { id: 5, name: 'New Features', volume: 42000, change: 15 },
    ],
  },
];

export default function TrendsListContent() {
  const [expandedCategories, setExpandedCategories] = useState<{[key: string]: boolean}>({ 'Technology': true });
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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

      {/* Trends List */}
      <div className="flex-1 overflow-y-auto p-6 pt-4">
        {trendCategories.map(({ category, trends }) => (
          <div key={category} className="mb-6">
            <div 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center">
                {expandedCategories[category] ? (
                  <ChevronDown className="h-5 w-5 mr-2 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 mr-2 text-muted-foreground" />
                )}
                <h2 className="font-medium">{category}</h2>
                <span className="ml-2 text-sm text-muted-foreground">
                  {trends.length} {trends.length === 1 ? 'trend' : 'trends'}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-transparent">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>

            {expandedCategories[category] && (
              <div className="mt-2 space-y-2">
                {trends.map((trend) => (
                  <div 
                    key={trend.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{trend.name}</h3>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <span>{formatNumber(trend.volume)} mentions</span>
                        <span className="mx-2">•</span>
                        <span className={trend.change > 0 ? 'text-green-500' : 'text-red-500'}>
                          {trend.change > 0 ? '↑' : '↓'} {Math.abs(trend.change)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Analyze</Button>
                      <Button size="sm">Track</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
