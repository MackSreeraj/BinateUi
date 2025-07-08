'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Upload, FileText, X } from 'lucide-react';

type PlatformType = 'linkedin' | 'twitter' | '';

interface CreatePlatformModalProps {
  onSuccess?: () => void;
}

interface Company {
  _id: string;
  name: string;
}

export function CreatePlatformModal({ onSuccess }: CreatePlatformModalProps) {
  const [open, setOpen] = useState(false);
  const [platformName, setPlatformName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('');
  const [docUrl, setDocUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    setFiles(prev => [...prev, ...validFiles]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const validFiles = Array.from(selectedFiles).filter(file => 
        file.type === 'application/pdf' || 
        file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to fetch companies');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompany) {
      toast.error('Please select a company');
      return;
    }
    
    try {
      const formData = {
        name: platformName,
        platformType: selectedPlatform,
        docUrl: docUrl || null,
        files: files.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type
        })),
        companyId: selectedCompany,
      };

      const response = await fetch('/api/platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save platform');
      }

      const result = await response.json();
      
      // Show success toast
      toast.success('Platform added successfully');
      
      // Reset form and close modal
      setPlatformName('');
      setSelectedPlatform('');
      setDocUrl('');
      setFiles([]);
      setOpen(false);
      
      // Refresh platforms list
      onSuccess?.();
      
    } catch (error) {
      console.error('Error saving platform:', error);
      toast.error('Failed to connect platform. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Platform
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect Platform</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={platformName}
                  onChange={(e) => setPlatformName(e.target.value)}
                  placeholder="Enter platform name"
                />
              </div>

              <div>
                <Label htmlFor="platformType">Platform Type</Label>
                <Select
                  value={selectedPlatform}
                  onValueChange={setSelectedPlatform}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="docUrl">Document URL (Optional)</Label>
                <Input
                  id="docUrl"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder="Enter document URL"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Or upload a file below
              </p>
            </div>

            <div 
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-2">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-primary">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX (max 10MB)
                  </p>
                </div>
                <Input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  multiple
                />
                <Label 
                  htmlFor="file-upload" 
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-2 cursor-pointer"
                >
                  Select Files
                </Label>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files</Label>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              variant="destructive" 
              size="sm"
              className="gap-1"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={!platformName || !selectedPlatform || (!docUrl && files.length === 0)}>
              Connect Platform
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
