'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Monitor, Globe, FileText, Trash2, RefreshCw, Loader2, ExternalLink, FileText as GoogleDocIcon, PlusCircle, Brain, Copy, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

interface PlatformConnection {
  _id: string;
  name: string;
  platformType: string;
  docUrl?: string | null;
  files?: Array<{
    name: string;
    size: number;
    type: string;
  }>;
  createdAt: string;
}

interface PlatformProfile {
  _id: string;
  obj_id: string;
  "Platform Summary": string;
  "Content Structure Guide": string;
  "Engagement Techniques": string;
  "Visual Elements": string;
  "Algo Considerations": string;
  "Platform Culture": string;
  "Technical Guidelines": string;
  "Do & Dont List": string;
  "Example Tranformations": string;
  "API Ready Instructions": string;
  Train: boolean;
}

export function PlatformConnections() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<PlatformConnection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platformProfile, setPlatformProfile] = useState<PlatformProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const router = useRouter();

  const handleTrainModel = async (platformId: string) => {
    try {
      setIsTraining(true);
      
      const response = await fetch(`/api/platforms/${platformId}/train`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platformId: platformId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger training');
      }

      toast.success('Model training started');
      
      // Start polling for profile data
      startPollingForProfile(platformId);
    } catch (error) {
      toast.error('Failed to start training');
      console.error('Error triggering training:', error);
      setIsTraining(false);
    }
  };
  
  // Poll for profile data after training is initiated
  const startPollingForProfile = (platformId: string) => {
    let attempts = 0;
    const maxAttempts = 30; // Try for about 5 minutes (30 * 10 seconds)
    const pollingInterval = 10000; // 10 seconds
    
    const checkForProfile = async () => {
      try {
        const response = await fetch(`/api/platforms/${platformId}/profile`);
        
        if (response.ok) {
          const data = await response.json();
          setPlatformProfile(data);
          setIsTraining(false);
          toast.success('Profile generated successfully');
          return; // Stop polling if we got data
        }
        
        // If we've reached max attempts, stop polling
        if (++attempts >= maxAttempts) {
          setIsTraining(false);
          toast.error('Training is taking longer than expected. Please refresh manually.');
          return;
        }
        
        // Try again after interval
        setTimeout(() => checkForProfile(), pollingInterval);
      } catch (error) {
        console.error('Error checking for profile:', error);
        // Continue polling even if there's an error
        if (++attempts < maxAttempts) {
          setTimeout(() => checkForProfile(), pollingInterval);
        } else {
          setIsTraining(false);
          toast.error('Failed to check for profile. Please refresh manually.');
        }
      }
    };
    
    // Start the first check after a delay to give training time to start
    setTimeout(() => checkForProfile(), 15000); // 15 seconds initial delay
  };

  const fetchPlatformProfile = async (platformId: string) => {
    try {
      setIsLoadingProfile(true);
      setProfileError(null);
      
      const response = await fetch(`/api/platforms/${platformId}/profile`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // No profile exists yet, which is fine
          setPlatformProfile(null);
          return;
        }
        throw new Error('Failed to fetch platform profile');
      }
      
      const data = await response.json();
      setPlatformProfile(data);
    } catch (error) {
      console.error('Error fetching platform profile:', error);
      setProfileError('Failed to load platform profile');
      setPlatformProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const fetchConnections = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/platforms');
      
      if (!response.ok) {
        throw new Error('Failed to fetch connections');
      }
      
      const data = await response.json();
      setConnections(data);
      if (data.length > 0 && !selectedConnection) {
        setSelectedConnection(data[0]);
      }
    } catch (err) {
      console.error('Error fetching connections:', err);
      setError('Failed to load connections');
      toast.error('Failed to load connections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  useEffect(() => {
    if (selectedConnection) {
      fetchPlatformProfile(selectedConnection._id);
    } else {
      setPlatformProfile(null);
    }
  }, [selectedConnection]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this platform connection? This action cannot be undone.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/platforms/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete platform connection');
      }

      toast.success('Platform connection removed');
      fetchConnections();
    } catch (error) {
      console.error('Error deleting platform connection:', error);
      toast.error('Failed to remove platform connection');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button variant="outline" onClick={fetchConnections} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No platform connections found.</p>
      </div>
    );
  }

  // Handle copying content to clipboard
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Helper function to render profile sections
  const renderProfileSection = (title: string, content: string | null | undefined) => {
    if (!content) return null;

    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <button 
              onClick={() => handleCopy(content, title)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              title="Copy to clipboard"
            >
              {copiedField === title ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{content}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      {/* Left Panel - Platform List */}
      <div className="w-64 border-r border-muted/50 overflow-y-auto">
        <div className="p-3 border-b border-muted/50">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider px-2">Platforms</h3>
        </div>
        <div className="py-2">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className={`relative flex items-center mx-2 my-1 px-3 py-2.5 rounded-md cursor-pointer transition-all duration-200 ${selectedConnection?._id === connection._id 
                ? 'bg-muted border-l-2 border-primary' 
                : 'hover:bg-muted/50 border-l-2 border-transparent'}`}
              onClick={() => setSelectedConnection(connection)}
            >
              <div className="mr-3 flex-shrink-0">
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{connection.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate capitalize">
                  {connection.platformType}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Platform Details */}
      <div className="flex-1 p-6">
        {selectedConnection ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{selectedConnection.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Connected on {formatDate(selectedConnection.createdAt)}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="gap-1"
                  onClick={() => handleDelete(selectedConnection?._id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {selectedConnection.platformType}
                </Badge>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Details</h3>
                  <div className="space-y-1">
                    <p className="text-sm">Platform Type: {selectedConnection.platformType}</p>
                  </div>
                </div>

                {selectedConnection.docUrl && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Document</h3>
                    <div className="flex items-center gap-2">
                      <GoogleDocIcon className="h-4 w-4 text-blue-600" />
                      <a
                        href={selectedConnection.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View Document
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {selectedConnection.files && selectedConnection.files.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Uploaded Files</h3>
                    <div className="space-y-2">
                      {selectedConnection.files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg overflow-hidden"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {formatFileSize(file.size)} • {file.type}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-1"
                    onClick={() => selectedConnection && fetchPlatformProfile(selectedConnection._id)}
                    disabled={isLoadingProfile}
                  >
                    <RefreshCw className={`h-4 w-4 ${isLoadingProfile ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="gap-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                    onClick={() => handleTrainModel(selectedConnection?._id)}
                    disabled={!!platformProfile || isTraining}
                    title={platformProfile ? "Profile already exists" : isTraining ? "Training in progress..." : "Train model to generate a profile"}
                  >
                    {isTraining ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Training...
                      </>
                    ) : (
                      "Train Model"
                    )}
                  </Button>
                </div>

                {/* Platform Profile Section */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Platform Profile</h3>
                  </div>
                  
                  {isLoadingProfile ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : profileError ? (
                    <div className="text-center p-4">
                      <p className="text-sm text-red-500">{profileError}</p>
                    </div>
                  ) : !platformProfile ? (
                    <div className="text-center p-8">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-muted-foreground">
                          <rect width="18" height="18" x="3" y="3" rx="2"/>
                          <path d="M3 9h18"/>
                          <path d="M9 21V9"/>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-foreground mb-2">No Platform Profile Found</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        This platform doesn't have a profile yet. Train the model to generate a personalized profile.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Separator />
                      
                      {renderProfileSection("Platform Summary", platformProfile["Platform Summary"])}
                      {renderProfileSection("Content Structure Guide", platformProfile["Content Structure Guide"])}
                      {renderProfileSection("Engagement Techniques", platformProfile["Engagement Techniques"])}
                      {renderProfileSection("Visual Elements", platformProfile["Visual Elements"])}
                      {renderProfileSection("Algo Considerations", platformProfile["Algo Considerations"])}
                      {renderProfileSection("Platform Culture", platformProfile["Platform Culture"])}
                      {renderProfileSection("Technical Guidelines", platformProfile["Technical Guidelines"])}
                      {renderProfileSection("Do & Dont List", platformProfile["Do & Dont List"])}
                      {renderProfileSection("Example Tranformations", platformProfile["Example Tranformations"])}
                      {renderProfileSection("API Ready Instructions", platformProfile["API Ready Instructions"])}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Select a platform to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
