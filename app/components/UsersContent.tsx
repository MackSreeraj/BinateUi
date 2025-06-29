'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Grid, List, Plus, X, Upload, User, Loader2, Calendar, Image as ImageIcon, Trash2, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface User {
  _id: string;
  username: string;
  imageUrl: string;
  createdAt: string;
}

export default function UsersContent() {
  // State for add user dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for user detail dialog
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle user card click
  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setEditUsername(user.username);
    // Ensure we have the full URL for the preview
    const imageUrl = user.imageUrl?.startsWith('https') || user.imageUrl?.startsWith('/')
      ? user.imageUrl 
      : user.imageUrl 
        ? `/uploads/${user.imageUrl}`
        : null;
    setEditPreview(imageUrl);
    setEditImage(null);
    setIsEditMode(false);
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    // Confirm before deleting
    const confirmDelete = window.confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (!confirmDelete) return;
    
    const toastId = toast.loading('Deleting user...');
    try {
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete user');
      }

      // Update the users list
      setUsers(users.filter(user => user._id !== selectedUser._id));
      setSelectedUser(null);
      
      toast.success('User deleted successfully', { id: toastId });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user', { 
        id: toastId,
        description: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  };

  // Handle update user
  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    const formData = new FormData();
    formData.append('username', editUsername);
    if (editImage) {
      formData.append('profileImage', editImage);
    }

    const toastId = toast.loading('Updating user...');
    try {
      const response = await fetch(`/api/users/${selectedUser._id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user');
      }

      // Update the users list with the updated user data
      setUsers(users.map(user => 
        user._id === selectedUser._id 
          ? { 
              ...user, 
              username: editUsername,
              imageUrl: result.user.imageUrl || user.imageUrl,
              updatedAt: new Date().toISOString()
            } 
          : user
      ));
      
      // Update the selected user in state
      const updatedUser = {
        ...selectedUser,
        username: editUsername,
        imageUrl: result.user.imageUrl || selectedUser.imageUrl,
        updatedAt: new Date().toISOString()
      };
      
      setSelectedUser(updatedUser);
      setIsEditMode(false);
      
      // Update the preview URL if we have a new image
      if (result.user.imageUrl) {
        const imageUrl = result.user.imageUrl.startsWith('http')
          ? result.user.imageUrl
          : `/uploads/${result.user.imageUrl}`;
        setEditPreview(imageUrl);
      }
      
      toast.success('User updated successfully', { id: toastId });
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user', { 
        id: toastId,
        description: error instanceof Error ? error.message : 'An error occurred'
      });
    }
  };

  // Handle edit image change
  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }
    
    setEditImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Unknown date';
      }
      return format(date, 'MMM d, yyyy h:mm a');
    } catch (e) {
      return 'Unknown date';
    }
  };

  // Safe format for join date (just month and year)
  const formatJoinDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return format(date, 'MMM yyyy');
    } catch (e) {
      return '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size should be less than 2MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        // Sort by creation date, newest first
        const sortedUsers = data.sort((a: User, b: User) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating user...');

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }

      // Update the users list
      setUsers(prev => [result.user, ...prev]);
      
      // Reset form
      setUsername('');
      setProfileImage(null);
      setPreview(null);
      setIsDialogOpen(false);
      
      toast.success('User created successfully!', {
        id: toastId,
        description: `${username} has been added to the system.`
      });
      
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user', {
        id: toastId,
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
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
      <div className="py-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as 'grid' | 'list')}
            className="w-full sm:w-auto"
          >
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
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-lg">
            <User className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No users found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? 'Try a different search term' : 'Get started by adding a new user'}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {filteredUsers.map((user) => (
              <div 
                key={user._id} 
                onClick={() => handleUserClick(user)}
                className="group flex flex-col items-center p-6 rounded-xl hover:bg-accent/30 transition-colors cursor-pointer border border-border/50 hover:border-primary/30"
              >
                <div className="relative w-32 h-32 mb-4">
                  <div className="absolute inset-0 rounded-full overflow-hidden border-2 border-border/50 group-hover:border-primary/50 transition-all">
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/50 rounded-full">
                        <User className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-medium text-base">
                    {user.username}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {user.createdAt ? `Joined ${formatJoinDate(user.createdAt)}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user._id} className="hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.imageUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{user.username}</h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to your organization
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label>Profile Image (Optional)</Label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div 
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={triggerFileInput}
              >
                {preview ? (
                  <div className="relative">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="mx-auto max-h-40 rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute -top-2 -right-2 h-8 w-8 p-0 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreview(null);
                        setProfileImage(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      SVG, PNG, JPG or GIF (max. 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create User'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                {isEditMode ? 'Update user information' : 'View user details'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col items-center py-4">
              {/* Profile Image */}
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-border">
                {editPreview ? (
                  // Show edit preview if available
                  <img
                    key="edit-preview"
                    src={editPreview}
                    alt={editUsername}
                    className="w-full h-full object-cover"
                  />
                ) : selectedUser?.imageUrl ? (
                  // Show user's image if available
                  <img
                    key={`user-${selectedUser._id}`}
                    src={selectedUser.imageUrl.startsWith('http') || selectedUser.imageUrl.startsWith('/')
                      ? selectedUser.imageUrl 
                      : `/uploads/${selectedUser.imageUrl}`}
                    alt={editUsername}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Hide the image on error
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  // Fallback avatar when no image is available
                  <div className="w-full h-full flex items-center justify-center bg-muted/50">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                {/* Add a semi-transparent overlay when in edit mode */}
                {isEditMode && !editPreview && selectedUser && !selectedUser.imageUrl && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Upload className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              {isEditMode && (
                <>
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                    <Edit className="h-4 w-4" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleEditImageChange}
                    />
                  </label>
                  {editImage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditImage(null);
                        setEditPreview(selectedUser?.imageUrl 
                          ? selectedUser.imageUrl.startsWith('http')
                            ? selectedUser.imageUrl 
                            : `/uploads/${selectedUser.imageUrl}`
                          : null
                        );
                      }}
                      className="absolute top-0 right-0 bg-destructive text-destructive-foreground p-1 rounded-full hover:bg-destructive/90 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Username */}
            <div className="mt-6 w-full">
              <Label htmlFor="edit-username" className="text-right">
                Username
              </Label>
              {isEditMode ? (
                <Input
                  id="edit-username"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-medium mt-1">{editUsername}</p>
              )}
            </div>

            {/* Join Date */}
            <div className="mt-4 w-full">
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="text-sm">
                {selectedUser && formatDate(selectedUser.createdAt)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between mt-6">
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={isSubmitting}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            
            {isEditMode ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditMode(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateUser}
                  disabled={isSubmitting || !editUsername.trim()}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditMode(true)}
                variant="outline"
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
