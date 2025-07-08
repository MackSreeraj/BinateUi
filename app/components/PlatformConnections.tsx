'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Monitor, Globe, FileText, Trash2, RefreshCw, Loader2, ExternalLink, FileText as GoogleDocIcon, PlusCircle, Brain } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export function PlatformConnections() {
  const [connections, setConnections] = useState<PlatformConnection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<PlatformConnection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleTrainModel = async (platformId: string) => {
    try {
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
      // Refresh the page after successful training
      router.refresh();
    } catch (error) {
      toast.error('Failed to start training');
      console.error('Error triggering training:', error);
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

  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      {/* Left Panel - Platform List */}
      <div className="w-64 border-r border-muted/50 overflow-y-auto">
        <div className="space-y-1 p-2">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className={`group relative flex items-center space-x-2 rounded-lg p-2.5 text-sm leading-none hover:bg-muted/50 focus-within:bg-muted/50 transition-colors duration-200`}
              onClick={() => setSelectedConnection(connection)}
            >
              <div className="flex-1 min-w-0">
                <span className="absolute -inset-px rounded-lg" />
                <span className="font-medium">{connection.name}</span>
                <span className="text-xs text-muted-foreground">
                  {connection.platformType}
                </span>
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
                    onClick={fetchConnections}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    className="gap-1 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
                    onClick={() => handleTrainModel(selectedConnection?._id)}
                  >

                    Train Model
                  </Button>
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
