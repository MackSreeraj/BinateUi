'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditCompanyModalProps {
  company: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedCompany: any) => void;
  onDelete: (companyId: string) => Promise<void>;
}

export function EditCompanyModal({ company, open, onOpenChange, onSave, onDelete }: EditCompanyModalProps) {
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        about: company.about || '',
        services: company.services || '',
        mission: company.mission || '',
        valueProposition: company.valueProposition || '',
        painPoints: company.painPoints || '',
        brandVoice: company.brandVoice || '',
        logo: company.logo || ''
      });
    }
  }, [company]);

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
      await onSave({
        ...formData,
        _id: company._id
      });
      onOpenChange(false);
      toast.success('Company updated successfully!');
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update company');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(company._id);
      onOpenChange(false);
      setShowDeleteConfirm(false);
      toast.success('Company deleted successfully!');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to delete company');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
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
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const uploadPrompt = document.getElementById('edit-upload-prompt');
                      if (uploadPrompt) uploadPrompt.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div id="edit-upload-prompt" className={`text-center p-4 ${formData.logo ? 'hidden' : 'flex flex-col items-center'}`}>
                  <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Upload Logo</p>
                </div>
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="edit-logo-upload"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      
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
                    }
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => document.getElementById('edit-logo-upload')?.click()}
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
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mission of the business</label>
              <Input
                name="mission"
                value={formData.mission}
                onChange={handleChange}
                placeholder="Enter mission..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Unique Value Proposition</label>
              <Textarea
                name="valueProposition"
                value={formData.valueProposition}
                onChange={handleChange}
                placeholder="What makes your business unique?"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Client Pain Points</label>
              <Textarea
                name="painPoints"
                value={formData.painPoints}
                onChange={handleChange}
                placeholder="What problems do your clients face that you solve?"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Brand Voice</label>
              <Textarea
                name="brandVoice"
                value={formData.brandVoice}
                onChange={handleChange}
                placeholder="Describe your brand's voice and tone..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button 
              type="button"
              variant="outline" 
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={handleDeleteClick}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Company
            </Button>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting || isDeleting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isDeleting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <DialogTitle>Delete Company</DialogTitle>
            </div>
            <DialogDescription className="pt-4">
              Are you sure you want to delete <span className="font-semibold">{company.name}</span>? 
              This action cannot be undone and all associated data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : 'Delete Company'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
