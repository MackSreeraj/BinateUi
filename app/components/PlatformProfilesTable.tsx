'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export type ContentType = string | string[] | Record<string, unknown> | null | undefined;

export interface PlatformProfile {
  _id: string;
  platformSummary: string;
  contentStructureGuide: string;
  engagementTechniques: string;
  visualElements: string;
  algoConsiderations: string;
  platformCulture: string;
  technicalGuidelines: string;
  doAndDontList: string | string[];
  exampleTransformations: string | string[];
  apiReadyInstructions: string;
  train: boolean;
}

interface PlatformProfilesTableProps {
  profiles: PlatformProfile[];
  isLoading?: boolean;
}

const InfoSection = ({ 
  title, 
  content 
}: { 
  title: string; 
  content: ContentType 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper function to render content based on its type
  const renderContent = () => {
    if (!content) {
      return <p className="text-sm text-muted-foreground italic">No data available</p>;
    }

    // Handle array content (like Do's & Don'ts, Example Transformations)
    if (Array.isArray(content)) {
      // Special handling for Do's & Don'ts to show without bullet points
      if (title === "Do's & Don'ts") {
        return (
          <div className="space-y-2">
            {content.map((item, index) => (
              <div key={index} className="text-sm text-muted-foreground flex items-start">
                <span className="mr-2">{item.startsWith('✅') || item.startsWith('❌') ? '' : '•'}</span>
                <span>{typeof item === 'object' ? JSON.stringify(item) : item}</span>
              </div>
            ))}
          </div>
        );
      }
      
      // Default list with bullet points for other sections
      return (
        <ul className="list-disc pl-5 space-y-2">
          {content.map((item, index) => (
            <li key={index} className="text-sm text-muted-foreground">
              {typeof item === 'object' ? JSON.stringify(item) : item}
            </li>
          ))}
        </ul>
      );
    }

    // Handle string content with potential newlines
    if (typeof content === 'string') {
      // If it's a string but contains newlines, split it into paragraphs
      if (content.includes('\n')) {
        return (
          <div className="space-y-2">
            {content.split('\n').map((paragraph, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                {paragraph || <br />}
              </p>
            ))}
          </div>
        );
      }
      return <p className="text-sm text-muted-foreground whitespace-pre-line">{content}</p>;
    }

    // Handle object content (fallback)
    if (typeof content === 'object') {
      return (
        <pre className="text-sm text-muted-foreground overflow-auto p-2 bg-muted/20 rounded">
          {JSON.stringify(content, null, 2)}
        </pre>
      );
    }

    // Default render for other types
    return <p className="text-sm text-muted-foreground">{String(content)}</p>;
  };

  // Get text to copy based on content type
  const getCopyText = (): string => {
    if (!content) return '';
    if (Array.isArray(content)) return content.join('\n');
    if (typeof content === 'object') return JSON.stringify(content, null, 2);
    return String(content);
  };
  


  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <button 
            onClick={() => handleCopy(getCopyText())}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export function PlatformProfilesTable({ profiles, isLoading }: PlatformProfilesTableProps) {
  // Helper to normalize content to array of strings with special handling for Do's & Don'ts
  const normalizeToStringArray = (input: string | string[] | undefined | null, isDosAndDonts = false): string[] => {
    if (!input) return [];
    
    // If it's already an array, return it directly
    if (Array.isArray(input)) {
      return input.flatMap(item => 
        isDosAndDonts ? item.split(',').filter(Boolean).map(s => s.trim()) : item
      ).filter(Boolean);
    }
    
    // If it's a string, split by commas for Do's & Don'ts, otherwise by newlines
    if (typeof input === 'string') {
      const separator = isDosAndDonts ? /,(?![^❌✅]*[)])/ : /\n/; // Split by comma but not within parentheses
      return input
        .split(separator)
        .map(s => s.trim())
        .map(s => s.replace(/^[.,]\s*/, '')) // Remove leading dots or commas
        .filter(Boolean);
    }
    
    return [];
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No platform profile data available. Please train the model to generate profile data.
      </div>
    );
  }

  const profile = profiles[0]; // Since we're showing one profile at a time

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Profile ID: {profile._id}</h3>
        <Badge variant={profile.train ? 'default' : 'outline'}>
          {profile.train ? 'Trained' : 'Not Trained'}
        </Badge>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <InfoSection title="Platform Summary" content={profile.platformSummary} />
        <InfoSection title="Content Structure Guide" content={profile.contentStructureGuide} />
        <InfoSection title="Engagement Techniques" content={profile.engagementTechniques} />
        <InfoSection title="Visual Elements" content={profile.visualElements} />
        <InfoSection title="Algorithm Considerations" content={profile.algoConsiderations} />
        <InfoSection title="Platform Culture" content={profile.platformCulture} />
        <InfoSection title="Technical Guidelines" content={profile.technicalGuidelines} />
        <InfoSection 
          title="Do's & Don'ts" 
          content={normalizeToStringArray(profile.doAndDontList || '', true).map(item => {
            // Preserve the checkmark or cross emoji at the start of each item
            const isDo = item.startsWith('✅');
            const isDont = item.startsWith('❌');
            
            // Ensure there's a space after the emoji for better readability
            if (isDo || isDont) {
              const emoji = isDo ? '✅' : '❌';
              const text = item.slice(1).trim();
              return `${emoji} ${text}`;
            }
            return item;
          })}
        />
        <InfoSection 
          title="Example Transformations" 
          content={normalizeToStringArray(profile.exampleTransformations || '')}
        />
        <InfoSection title="API Ready Instructions" content={profile.apiReadyInstructions} />
      </div>
    </div>
  );
}
