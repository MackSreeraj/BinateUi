'use client';

import { useEffect, useState } from 'react';
import { PenTool, Search, Grid, List, Filter, Plus, Image as ImageIcon, Upload, Loader2, RefreshCw } from 'lucide-react';
import { PlatformProfilesTable, PlatformProfile } from './PlatformProfilesTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import CreateWriterProfileModal from './CreateWriterProfileModal';

interface WriterProfile {
  _id: string;
  name: string;
  description: string;
  image?: string;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function WriterProfilesContent() {
  const [writers, setWriters] = useState<WriterProfile[]>([]);
  const [selectedWriter, setSelectedWriter] = useState<WriterProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [platformProfiles, setPlatformProfiles] = useState<PlatformProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);


  const fetchWriters = async () => {
    try {
      const response = await fetch('/api/writer-profiles');
      if (!response.ok) throw new Error('Failed to fetch writer profiles');
      const data = await response.json();
      setWriters(data);
      if (data.length > 0 && !selectedWriter) {
        setSelectedWriter(data[0]);
      }
    } catch (error) {
      console.error('Error fetching writer profiles:', error);
      toast.error('Failed to load writer profiles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWriters();
  }, []);

  useEffect(() => {
    if (selectedWriter) {
      fetchPlatformProfiles(selectedWriter._id);
    } else {
      setPlatformProfiles([]);
    }
  }, [selectedWriter]);

  const handleWriterSelect = (writer: WriterProfile) => {
    setSelectedWriter(writer);
  };

  const handleProfileCreated = () => {
    fetchWriters();
  };

  const fetchPlatformProfiles = async (writerId: string) => {
    try {
      setIsLoadingProfiles(true);
      
      console.log(`Fetching platform profile for writer ID: ${writerId}`);
      // Fetch the platform profile for the current writer
      const response = await fetch(`/api/writer-profiles/${writerId}/platform-profile`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const responseData = await response.json();
      console.log('API Response:', { status: response.status, data: responseData });
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No platform profile found for this writer yet');
          // No platform profile exists yet, which is fine
          setPlatformProfiles([]);
          return;
        }
        throw new Error(responseData.error || 'Failed to fetch platform profile');
      }
      
      // If we get an error message in the response
      if (responseData.error) {
        console.error('Error in response:', responseData.error);
        throw new Error(responseData.error);
      }
      
      console.log('Setting platform profiles with data:', responseData);
      setPlatformProfiles([responseData]);
      
    } catch (error) {
      console.error('Error fetching platform profile:', error);
      // Type check the error before accessing its properties
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      // Only show error if it's not a 404 (which we handle gracefully)
      if (!errorMessage.includes('404')) {
        toast.error('Failed to load platform profile. Please try training the model first.');
      }
      setPlatformProfiles([]);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const handleTrainModel = async () => {
    if (!selectedWriter) {
      toast.error('Please select a writer profile first');
      return;
    }

    try {
      setIsTraining(true);
      const response = await fetch('/api/train-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId: selectedWriter._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to start training');
      }

      const result = await response.json();
      toast.success('Training completed successfully');
      
      // After training, fetch the platform profiles
      fetchPlatformProfiles(selectedWriter._id);
    } catch (error) {
      console.error('Error training model:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start training');
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <PenTool className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Writer Profiles</h1>
        </div>
        <CreateWriterProfileModal onSuccess={handleProfileCreated} />
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between pb-4">
        <div className="relative w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8"
          />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-background border-0">
        {/* Left Panel - Writer List */}
        <div className="w-64 border-r border-muted/50 overflow-y-auto bg-background">
          <div className="space-y-0.5 p-1">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : writers.length === 0 ? (
              <div className="text-center p-4 text-muted-foreground">
                No writer profiles found. Create one to get started.
              </div>
            ) : (
              writers.map((writer) => (
                <div
                  key={writer._id}
                  className={`flex items-center p-1 rounded-lg cursor-pointer ${
                    selectedWriter?._id === writer._id ? 'bg-muted' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => handleWriterSelect(writer)}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                    {writer.image ? (
                      <img 
                        src={writer.image} 
                        alt={writer.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <PenTool className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="font-medium truncate">{writer.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {writer.description || 'No description'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Writer Details */}
        <div className="flex-1 overflow-y-auto p-2 bg-background">
          <div className="space-y-4">
            {selectedWriter ? (
              <>
                {/* Header with Edit button */}
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedWriter.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      Created on {new Date(selectedWriter.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Button>
                </div>

                {/* Profile Picture and Description */}
              <div className="flex flex-col md:flex-row gap-2">
                {/* Profile Picture */}
                <div className="w-full md:w-1/3">
                  <div className="w-full max-w-[200px] aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/20 overflow-hidden">
                    {selectedWriter.image ? (
                      <img 
                        src={selectedWriter.image} 
                        alt={selectedWriter.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No Image</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-medium">Description</h3>
                  <div className="prose prose-sm dark:prose-invert p-0">
                    {selectedWriter.description || 'No description provided.'}
                  </div>
                </div>
              </div>

                {/* Document URL */}
                {selectedWriter.documentUrl && (
                  <div className="pt-2 space-y-1">
                    <h3 className="text-sm font-medium">Document</h3>
                    <div className="flex items-center space-x-2">
                      <a 
                        href={selectedWriter.documentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm flex items-center"
                        title={selectedWriter.documentUrl}
                      >
                        {selectedWriter.documentUrl.includes('docs.google.com') ? 'Google Doc' : 'Document'}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Train Model Section */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Platform Profiles</h3>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => selectedWriter && fetchPlatformProfiles(selectedWriter._id)}
                        disabled={isLoadingProfiles}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingProfiles ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      <Button 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={handleTrainModel}
                        disabled={isTraining || isLoadingProfiles || platformProfiles.length > 0}
                        size="sm"
                        title={platformProfiles.length > 0 ? 'Model already trained' : 'Train model'}
                      >
                        {isTraining ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Training...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Train Model
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4 bg-muted/20">
                    <PlatformProfilesTable 
                      profiles={platformProfiles} 
                      isLoading={isLoadingProfiles} 
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <PenTool className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No writer selected</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {writers.length === 0 
                    ? 'Create your first writer profile to get started.' 
                    : 'Select a writer from the list to view details.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
