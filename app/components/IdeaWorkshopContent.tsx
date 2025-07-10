'use client';

import { useState } from 'react';
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
import { Check, X, AlertTriangle, ChevronDown, Plus } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
}

const IdeaWorkshopContent = () => {
  const [ideaKeyword, setIdeaKeyword] = useState('hotels');
  const [companyTags, setCompanyTags] = useState<Tag[]>([{ id: '1', name: 'Nvidia' }]);
  const [writerTags, setWriterTags] = useState<Tag[]>([{ id: '1', name: 'test' }]);
  const [platformTags, setPlatformTags] = useState<Tag[]>([{ id: '1', name: 'LinkedIn' }]);
  const [status, setStatus] = useState('Posted');
  const [newTagText, setNewTagText] = useState('');

  const addTag = (tagType: string, tagName: string) => {
    if (!tagName.trim()) return;
    
    const newTag = { id: Date.now().toString(), name: tagName.trim() };
    
    switch (tagType) {
      case 'company':
        setCompanyTags([...companyTags, newTag]);
        break;
      case 'writer':
        setWriterTags([...writerTags, newTag]);
        break;
      case 'platform':
        setPlatformTags([...platformTags, newTag]);
        break;
    }
    
    setNewTagText('');
  };

  const removeTag = (tagType: string, tagId: string) => {
    switch (tagType) {
      case 'company':
        setCompanyTags(companyTags.filter(tag => tag.id !== tagId));
        break;
      case 'writer':
        setWriterTags(writerTags.filter(tag => tag.id !== tagId));
        break;
      case 'platform':
        setPlatformTags(platformTags.filter(tag => tag.id !== tagId));
        break;
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
            {/* Idea Input */}
            <div className="space-y-2">
              <Label htmlFor="idea" className="text-sm font-medium">
                Idea
              </Label>
              <Input 
                id="idea" 
                value={ideaKeyword} 
                onChange={(e) => setIdeaKeyword(e.target.value)}
              />
            </div>

            {/* Company Tags */}
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company
              </Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                {companyTags.map(tag => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary"
                    className="px-2 py-1 flex items-center gap-1"
                  >
                    {tag.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag('company', tag.id)} 
                    />
                  </Badge>
                ))}
                <Input
                  placeholder="Add company..."
                  className="border-0 p-0 h-6 flex-grow min-w-[100px]"
                  value={newTagText}
                  onChange={(e) => setNewTagText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addTag('company', newTagText);
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>

            {/* Writer Tags */}
            <div className="space-y-2">
              <Label htmlFor="writer" className="text-sm font-medium">
                Writer
              </Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                {writerTags.map(tag => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary"
                    className="px-2 py-1 flex items-center gap-1"
                  >
                    {tag.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag('writer', tag.id)} 
                    />
                  </Badge>
                ))}
                <Input
                  placeholder="Add writer..."
                  className="border-0 p-0 h-6 flex-grow min-w-[100px]"
                  value={newTagText}
                  onChange={(e) => setNewTagText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addTag('writer', newTagText);
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>

            {/* Platform Tags */}
            <div className="space-y-2">
              <Label htmlFor="platform" className="text-sm font-medium">
                Platform
              </Label>
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[40px]">
                {platformTags.map(tag => (
                  <Badge 
                    key={tag.id} 
                    variant="secondary"
                    className="px-2 py-1 flex items-center gap-1"
                  >
                    {tag.name}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag('platform', tag.id)} 
                    />
                  </Badge>
                ))}
                <Input
                  placeholder="Add platform..."
                  className="border-0 p-0 h-6 flex-grow min-w-[100px]"
                  value={newTagText}
                  onChange={(e) => setNewTagText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addTag('platform', newTagText);
                      e.preventDefault();
                    }
                  }}
                />
              </div>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select defaultValue={status} onValueChange={setStatus}>
                <SelectTrigger id="status" className="bg-green-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="In Review">In Review</SelectItem>
                  <SelectItem value="Posted">Posted</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* User Field */}
            <div className="space-y-2">
              <Label htmlFor="user" className="text-sm font-medium">
                User
              </Label>
              <div className="h-10 flex items-center px-3 border rounded-md">
                <span className="text-muted-foreground">–</span>
              </div>
            </div>

            {/* Generated Button */}
            <div className="flex items-end">
              <Button className="bg-green-500 hover:bg-green-600 text-white w-full h-10">
                <Check className="mr-2 h-4 w-4" /> Generated
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
                <Badge variant="outline">{ideaKeyword}</Badge>
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
