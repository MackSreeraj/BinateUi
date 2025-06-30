'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon } from 'lucide-react';

export function AddCompanyModal({ onSave }: { onSave: (company: any) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    services: '',
    mission: '',
    valueProposition: '',
    painPoints: '',
    brandVoice: '',
    logo: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save company');
      }

      const savedCompany = await response.json();
      onSave(savedCompany);
      setOpen(false);
      // Reset form
      setFormData({
        name: '',
        about: '',
        services: '',
        mission: '',
        valueProposition: '',
        painPoints: '',
        brandVoice: '',
        logo: ''
      });
    } catch (error) {
      console.error('Error saving company:', error);
      // Handle error (e.g., show toast)
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" /> Add Company
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Company Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 space-y-2">
              <label className="text-sm font-medium block">Company Logo</label>
              <div className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/20 overflow-hidden">
                {formData.logo ? (
                  <img 
                    src={formData.logo.startsWith('http') ? formData.logo : formData.logo.startsWith('/uploads/') ? formData.logo : `/uploads/${formData.logo}`}
                    alt="Logo preview"
                    className="w-full h-full object-contain p-2"
                    onError={(e) => {
                      // If image fails to load, show the upload prompt
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const uploadPrompt = document.getElementById('upload-prompt');
                      if (uploadPrompt) uploadPrompt.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div id="upload-prompt" className={`text-center p-4 ${formData.logo ? 'hidden' : 'flex flex-col items-center'}`}>
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload Logo</p>
                </div>
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="logo-upload"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      // Create form data to send the file
                      const formData = new FormData();
                      formData.append('file', file);
                      
                      // Upload the file
                      const response = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      
                      if (!response.ok) {
                        throw new Error('Failed to upload file');
                      }
                      
                      const { filePath } = await response.json();
                      setFormData(prev => ({ ...prev, logo: filePath }));
                    } catch (error) {
                      console.error('Error uploading file:', error);
                      // Optionally show an error message to the user
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {formData.logo ? 'Change Logo' : 'Upload Logo'}
              </Button>
              {formData.logo && (
                <p className="text-xs text-muted-foreground truncate" title={formData.logo}>
                  {formData.logo.split('/').pop()}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">About the business</label>
              <Textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell us about your business..."
                className="min-h-[120px]"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">What Service do you offer?</label>
              <Input
                name="services"
                value={formData.services}
                onChange={handleChange}
                placeholder="Enter services..."
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mission of the business</label>
              <Input
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                placeholder="Enter mission statement..."
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Unique Value Proposition</label>
              <Textarea
                name="valueProposition"
                value={formData.valueProposition}
                onChange={handleChange}
                placeholder="What makes your business unique?"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Ideal client's top three pain points</label>
              <Textarea
                name="painPoints"
                value={formData.painPoints}
                onChange={handleChange}
                placeholder="List the main challenges your clients face..."
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">How do you want to come across to your target audience?</label>
              <Textarea
                name="brandVoice"
                value={formData.brandVoice}
                onChange={handleChange}
                placeholder="Describe your desired brand voice and tone..."
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Company</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
