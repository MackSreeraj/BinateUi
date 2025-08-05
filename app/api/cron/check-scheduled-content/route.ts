import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Define interface for content schedule data
interface ContentSchedule {
  _id: string | ObjectId;
  Platform: string;
  'Post Title / Caption': string;
  Draft: string;
  Status: string;
  'Scheduled Date': string;
  'Published Date': string;
  User: string;
  [key: string]: any; // Allow for other properties
}

/**
 * This endpoint checks for scheduled content that needs to be published
 * and triggers the webhook when the scheduled time matches the current time.
 * It should be called every minute by a cron job.
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[CRON] Checking for scheduled content to publish...');
    
    // Get current date and time in Mumbai local time (UTC+5:30)
    const now = new Date();
    
    // Convert to Mumbai time (UTC+5:30)
    const mumbaiOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
    const mumbaiTime = new Date(now.getTime() + mumbaiOffset);
    const mumbaiTimeString = mumbaiTime.toISOString();
    
    console.log(`[CRON] Current date and time (Mumbai): ${mumbaiTimeString}`);
    
    // Convert Mumbai time back to UTC for database queries
    const currentDateTimeUTC = new Date(now.toISOString()).toISOString();
    
    // Connect to the database
    const client = await clientPromise;
    const db = client.db();
    
    // Helper function to convert Mumbai time to UTC for database comparison
    const convertMumbaiToUTC = (mumbaiTimeStr: string) => {
      const date = new Date(mumbaiTimeStr);
      // Adjust for Mumbai offset (subtract 5.5 hours)
      const utcTime = new Date(date.getTime() - (5.5 * 60 * 60 * 1000));
      return utcTime.toISOString();
    };
    
    // Fetch content schedules that are due for publishing
    // Status should not be "Published" and scheduled date should be less than or equal to now
    const contentSchedules = await db
      .collection('content_shedule')
      .find({
        $or: [
          { Status: { $ne: 'Published' } },
          { Status: { $eq: '' } },  // Also include empty status
          { Status: { $exists: false } }  // Also include missing status
        ],
        'Scheduled Date': { $lte: currentDateTimeUTC } // Compare with UTC time since DB stores in UTC
      })
      .toArray() as unknown as ContentSchedule[];
      
    // Log the query parameters for debugging
    console.log(`[CRON] Query parameters: Status not 'Published', Scheduled Date <= ${currentDateTimeUTC} (Mumbai time: ${mumbaiTimeString})`);
      
    // Log all scheduled content for debugging
    const allSchedules = await db
      .collection('content_shedule')
      .find({
        Status: { $ne: 'Published' }
      })
      .toArray();
      
    console.log(`[CRON] All unpublished schedules:`, allSchedules.map(s => ({ 
      id: s._id, 
      scheduledDate: s['Scheduled Date'],
      status: s.Status
    })));
    
    // Also check for any recently published content for debugging
    const recentlyPublished = await db
      .collection('content_shedule')
      .find({
        Status: 'Published',
        'Published Date': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() } // Last 24 hours
      })
      .toArray();
      
    // Add a helper function to convert UTC times to Mumbai time for display
    const convertToMumbaiTime = (utcTimeStr: string) => {
      if (!utcTimeStr) return 'N/A';
      const date = new Date(utcTimeStr);
      return new Date(date.getTime() + (5.5 * 60 * 60 * 1000)).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
      
    console.log(`[CRON] Recently published content:`, recentlyPublished.map(s => ({ 
      id: s._id, 
      scheduledDate: s['Scheduled Date'],
      scheduledDateMumbai: convertToMumbaiTime(s['Scheduled Date']),
      publishedDate: s['Published Date'],
      publishedDateMumbai: convertToMumbaiTime(s['Published Date']),
      platform: s.Platform,
      title: s['Post Title / Caption']?.substring(0, 30) + '...'
    })));
    
    // Check for any future scheduled content
    const futureScheduled = await db
      .collection('content_shedule')
      .find({
        Status: { $ne: 'Published' },
        'Scheduled Date': { $gt: currentDateTimeUTC }
      })
      .toArray();
      
    console.log(`[CRON] Future scheduled content:`, futureScheduled.map(s => ({ 
      id: s._id, 
      scheduledDate: s['Scheduled Date'],
      scheduledDateMumbai: convertToMumbaiTime(s['Scheduled Date']),
      platform: s.Platform,
      title: s['Post Title / Caption']?.substring(0, 30) + '...'
    })));
    
    console.log(`[CRON] Found ${contentSchedules.length} content schedules ready for publishing`);
    
    if (contentSchedules.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No content scheduled for publishing at this time' 
      });
    }
    
    // Process each scheduled content
    const results = await Promise.all(contentSchedules.map(async (schedule) => {
      try {
        // Prepare the webhook payload
        const payload = {
          contentId: schedule._id.toString(),
          platform: schedule.Platform || '',
          title: schedule['Post Title / Caption'] || '',
          content: schedule.Draft || '',
          scheduledDate: schedule['Scheduled Date'] || '',
          user: schedule.User || '',
          // Add any additional fields needed by the webhook
        };
        
        console.log(`[CRON] Triggering webhook for content: ${payload.title}`);
        
        // Prepare the webhook payload as URL parameters
        const params = new URLSearchParams();
        Object.entries(payload).forEach(([key, value]) => {
          params.append(key, value.toString());
        });
        
        // Call the webhook with the content payload as URL parameters
        const webhookUrl = `https://n8n.srv775152.hstgr.cloud/webhook/85d6c456-f2c6-43cb-bea1-239485383549?${params.toString()}`;
        const response = await fetch(webhookUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[CRON] Webhook error for content ${schedule._id}: ${response.status} ${errorText}`);
          return {
            contentId: schedule._id.toString(),
            success: false,
            status: response.status,
            error: errorText
          };
        }
        
        // Update the content status to "Published"
        await db.collection('content_shedule').updateOne(
          { _id: new ObjectId(schedule._id.toString()) },
          { 
            $set: { 
              Status: 'Published',
              'Published Date': mumbaiTimeString  // Store in Mumbai time format in the database
            } 
          }
        );
        
        console.log(`[CRON] Successfully published content: ${schedule._id}`);
        
        return {
          contentId: schedule._id.toString(),
          success: true,
          publishedDate: mumbaiTimeString
        };
      } catch (error) {
        console.error(`[CRON] Error processing content ${schedule._id}:`, error);
        return {
          contentId: schedule._id.toString(),
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }));
    
    return NextResponse.json({ 
      success: true, 
      message: `Processed ${contentSchedules.length} scheduled content items`,
      results
    });
    
  } catch (error) {
    console.error('[CRON] Error checking scheduled content:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check scheduled content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
