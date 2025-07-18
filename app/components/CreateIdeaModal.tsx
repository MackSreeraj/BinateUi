'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload } from 'lucide-react';

interface User {
  _id: string;
  username: string;
}

interface CreateIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIdeaCreated: () => void;
}

export default function CreateIdeaModal({ isOpen, onClose, onIdeaCreated }: CreateIdeaModalProps) {
  const [idea, setIdea] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users when the modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setAttachment(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!idea.trim()) {
      toast.error('Please enter an idea');
      return;
    }

    const formData = new FormData();
    formData.append('content', idea);
    if (selectedUser && selectedUser !== 'unassigned') {
      formData.append('userId', selectedUser);
    }
    if (attachment) {
      formData.append('attachment', attachment);
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating idea...');

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create idea');
      }
      
      // Reset form
      setIdea('');
      setAttachment(null);
      setSelectedUser('');
      
      // Close modal and notify parent
      onClose();
      onIdeaCreated();
      
      toast.success('Idea created successfully!', {
        id: toastId
      });
      
    } catch (error) {
      console.error('Error creating idea:', error);
      toast.error('Failed to create idea', {
        id: toastId,
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIdea('');
    setAttachment(null);
    setSelectedUser('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Content Idea</DialogTitle>
          <DialogDescription>
            Create a new content idea and assign it to a user
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="idea">Idea</Label>
            <Textarea
              id="idea"
              placeholder="Enter your content idea here..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachment"
                type="file"
                onChange={handleAttachmentChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('attachment')?.click()}
                className="w-full justify-start"
              >
                <Upload className="mr-2 h-4 w-4" />
                {attachment ? attachment.name : 'Upload file'}
              </Button>
              {attachment && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAttachment(null)}
                >
                  Clear
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Max file size: 5MB
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="user">Assign to User (optional)</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger id="user">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </div>
                ) : (
                  <>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.username}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
