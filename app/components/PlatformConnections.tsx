'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Monitor, Globe, FileText, Trash2, RefreshCw, Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<PlatformConnection | null>(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
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

  if (loading) {
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
        <div className="space-y-0.5 p-1">
          {connections.map((connection) => (
            <div
              key={connection._id}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selectedConnection?._id === connection._id ? 'bg-muted' : 'hover:bg-muted/50'
              }`}
              onClick={() => setSelectedConnection(connection)}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mr-3">
                <div className="text-muted-foreground">
                  {connection.platformType ? connection.platformType.charAt(0).toUpperCase() : 'P'}
                </div>
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{connection.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {connection.platformType}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Platform Details */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedConnection ? (
          <div className="space-y-6">
            <div className="flex justify-between items-start gap-2">
              <div>
                <h2 className="text-2xl font-bold">{selectedConnection.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Connected on {formatDate(selectedConnection.createdAt)}
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handleDelete(selectedConnection._id)}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Platform Type</h3>
                <p className="text-sm">{selectedConnection.platformType}</p>
              </div>

              {selectedConnection.docUrl && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Document URL</h3>
                  <a
                    href={selectedConnection.docUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {selectedConnection.docUrl}
                  </a>
                </div>
              )}

              {selectedConnection.files && selectedConnection.files.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Uploaded Files</h3>
                  <div className="space-y-2">
                    {selectedConnection.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
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
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a platform to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
