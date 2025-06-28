'use client';

import { useState, useRef } from 'react';
import { Search, Grid, List, Plus, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function UsersContent() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ username, profileImage });
    // Reset form
    setUsername('');
    setProfileImage(null);
    setPreview(null);
    setIsDialogOpen(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <span>👩‍💻</span> Users
          </h1>
        </div>
        <Button 
          className="rounded-lg h-10 w-10 p-0 flex items-center justify-center"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Toolbar */}
      <div className="py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="h-9 p-1 bg-muted/50">
              <TabsTrigger 
                value="grid" 
                className="rounded-md px-3 py-1 text-sm font-medium transition-all hover:bg-background data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Grid className="h-4 w-4 mr-2" />
                Grid View
              </TabsTrigger>
              <TabsTrigger 
                value="list" 
                className="rounded-md px-3 py-1 text-sm font-medium transition-all hover:bg-background data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-4">
        <div className="flex flex-col items-center justify-center h-full text-center p-12 rounded-lg border-2 border-dashed border-muted-foreground/20">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-muted-foreground">No users found</h3>
            <p className="text-sm text-muted-foreground">
              This page doesn't have any data yet.
            </p>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                placeholder="Enter username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Profile Picture</Label>
              <div 
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={triggerFileInput}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                {preview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="h-24 w-24 rounded-full object-cover mb-2"
                    />
                    <span className="text-sm text-muted-foreground">Click to change</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG (max. 5MB)</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsDialogOpen(false);
                  setUsername('');
                  setProfileImage(null);
                  setPreview(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
