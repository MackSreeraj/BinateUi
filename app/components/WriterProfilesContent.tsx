'use client';

import { useEffect, useState } from 'react';
import { PenTool, Search, Grid, List, Filter, Plus, Loader2, RefreshCw, Trash2, Bot } from 'lucide-react';
import { PlatformProfilesTable, PlatformProfile } from './PlatformProfilesTable';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  const [trainingError, setTrainingError] = useState<string | null>(null);
  const [trainingId, setTrainingId] = useState<string | null>(null);


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

  const handleDeleteWriter = async () => {
    if (!selectedWriter) return;
    
    // Confirm before deleting
    if (!confirm(`Are you sure you want to delete "${selectedWriter.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/writer-profiles/${selectedWriter._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete writer profile');
      }

      // Show success message and refresh the page
      toast.success('Writer profile deleted successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting writer profile:', error);
      toast.error('Failed to delete writer profile');
    }
  };



  // Effect to check for training completion - runs indefinitely until data is found
  useEffect(() => {
    if (!trainingId) return;
    
    let isMounted = true;
    const checkInterval = 1000; // 1 second between checks
    let timeoutId: NodeJS.Timeout;

    const checkTrainingStatus = async () => {
      if (!isMounted) return;
      
      try {
        // First check the training status
        const response = await fetch(`/api/train-model/status?trainingId=${trainingId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Training status check:', data);
        
        // If training is completed or in progress, check for the platform profile
        if (data.status === 'completed' || data.status === 'in_progress' || data.status === 'pending') {
          if (selectedWriter?._id) {
            try {
              // Try to fetch the platform profile
              const profileResponse = await fetch(`/api/writer-profiles/${selectedWriter._id}/platform-profile`);
              
              if (profileResponse.ok) {
                const profileData = await profileResponse.json();
                
                // If we have valid profile data, we're done
                if (profileData && !profileData.error) {
                  setPlatformProfiles([profileData]);
                  setIsTraining(false);
                  toast.success('Training completed and ready!');
                  return;
                }
              }
              // If we get here, the profile isn't ready yet
              console.log('Profile data not ready yet, checking again...');
            } catch (profileError) {
              console.log('Error fetching profile, will retry:', profileError);
              // Don't throw, we'll just try again
            }
          }
          
          // Schedule the next check
          if (isMounted) {
            timeoutId = setTimeout(checkTrainingStatus, checkInterval);
          }
        }
        // Handle failed state
        else if (data.status === 'failed') {
          setIsTraining(false);
          setTrainingError(data.error || 'Training failed');
          toast.error(`Training failed: ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error checking training status:', error);
        // On error, just schedule the next check
        if (isMounted) {
          timeoutId = setTimeout(checkTrainingStatus, checkInterval);
        }
      }
    };

    // Start the initial check
    checkTrainingStatus();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [trainingId, selectedWriter?._id]);

  const handleTrainModel = async () => {
    if (!selectedWriter) {
      toast.error('Please select a writer profile first');
      return;
    }

    try {
      setIsTraining(true);
      setTrainingError(null);
      toast.info('Training started. This may take a few minutes...');

      const response = await fetch('/api/train-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyId: selectedWriter._id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to start training');
      }

      const data = await response.json();
      if (!data.trainingId) {
        throw new Error('No training ID received from server');
      }
      
      setTrainingId(data.trainingId);
      toast.success('Training started. This may take a few minutes...');
    } catch (error) {
      console.error('Error training model:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start training';
      setTrainingError(errorMessage);
      setIsTraining(false);
      toast.error(errorMessage);
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
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center mr-3 overflow-hidden">
                    {writer.image ? (
                      <img 
                        src={writer.image?.startsWith('http') ? writer.image : `/${writer.image.replace(/^\//, '')}`}
                        alt={writer.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            // Remove any existing fallback
                            const existingFallback = parent.querySelector('.image-fallback');
                            if (!existingFallback) {
                              const fallback = document.createElement('div');
                              fallback.className = 'image-fallback w-full h-full flex items-center justify-center bg-muted/30';
                              fallback.innerHTML = `
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground">
                                  <path d="M12 5v.01"></path>
                                  <path d="M3 7l9-4 9 4"></path>
                                  <path d="M18 13v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6"></path>
                                  <path d="m3 7 9 4 9-4"></path>
                                  <path d="M12 22V13"></path>
                                </svg>
                              `;
                              parent.appendChild(fallback);
                            }
                          }
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-muted-foreground">
                          <path d="M12 5v.01"></path>
                          <path d="M3 7l9-4 9 4"></path>
                          <path d="M18 13v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6"></path>
                          <path d="m3 7 9 4 9-4"></path>
                          <path d="M12 22V13"></path>
                        </svg>
                      </div>
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
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleDeleteWriter}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>

                {/* Description */}
                <div className="w-full mt-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="text-sm">
                    {selectedWriter.description || 'No description provided.'}
                  </p>
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
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => selectedWriter && fetchPlatformProfiles(selectedWriter._id)}
                        disabled={isLoadingProfiles}
                        className="h-10"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingProfiles ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      <Button 
                        onClick={handleTrainModel} 
                        disabled={isTraining || !selectedWriter || platformProfiles.length > 0}
                        className="h-10 bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isTraining ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Training in progress...
                          </>
                        ) : (
                          'Train Model'
                        )}
                      </Button>
                    </div>
                  </div>
                  {trainingError && (
                    <p className="text-sm text-red-500">{trainingError}</p>
                  )}
                  
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
