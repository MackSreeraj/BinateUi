'use client';

import { useState } from 'react';
import { Plus, Bot } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function CreateWriterProfileModal({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    documentUrl: ''
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/writer-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create writer profile');
      }

      const data = await response.json();
      toast.success('Writer profile created successfully');
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating writer profile:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create writer profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Writer Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Writer Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter writer's name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a brief description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>AI Profile</Label>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                  <Bot className="h-8 w-8 text-white" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">AI Writer</p>
                <p className="text-sm text-muted-foreground">Powered by advanced AI</p>
              </div>
            </div>
          </div>

<div className="space-y-2">
            <Label htmlFor="documentUrl">Google Doc URL or Upload Document</Label>
            <Input
              id="documentUrl"
              name="documentUrl"
              type="url"
              value={formData.documentUrl}
              onChange={handleChange}
              placeholder="https://docs.google.com/document/..."
            />
            <div className="text-sm text-muted-foreground mt-1">
              Or upload a document:
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                className="mt-2"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData(prev => ({
                      ...prev,
                      documentUrl: file.name
                    }));
                  }
                }}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Profile'}
            </Button>
          </div>
        </form>

      </DialogContent>
    </Dialog>
  );
}
