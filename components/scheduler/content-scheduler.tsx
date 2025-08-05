'use client';

import { useEffect, useState } from 'react';

/**
 * ContentScheduler component that checks for scheduled content every minute
 * and triggers the webhook when the scheduled time matches the current time.
 * This component should be included in the layout or a page that is always loaded.
 */
export function ContentScheduler() {
  const [lastCheck, setLastCheck] = useState<string>('');
  const [status, setStatus] = useState<string>('Initializing...');

  useEffect(() => {
    // Function to check for scheduled content
    const checkScheduledContent = async () => {
      try {
        setStatus('Checking for scheduled content...');
        const response = await fetch('/api/cron/check-scheduled-content');
        const data = await response.json();
        
        const now = new Date();
        setLastCheck(now.toISOString());
        
        if (data.success) {
          if (data.results && data.results.length > 0) {
            setStatus(`Published ${data.results.length} content items at ${now.toLocaleTimeString()}`);
          } else {
            setStatus(`No content to publish at ${now.toLocaleTimeString()}`);
          }
        } else {
          setStatus(`Error: ${data.error || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error checking scheduled content:', error);
        setStatus(`Failed to check scheduled content: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    // Check immediately on component mount
    checkScheduledContent();
    
    // Set up interval to check every minute
    const intervalId = setInterval(checkScheduledContent, 60000); // 60000 ms = 1 minute
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // This component doesn't render anything visible
  // It just runs in the background
  return null;
}

export default ContentScheduler;
