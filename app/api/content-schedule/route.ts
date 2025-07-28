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

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    
    // Connect to the database
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch all content schedules
    const contentSchedules = await db
      .collection('content_shedule')
      .find({})
      .sort({ 'Scheduled Date': 1 })
      .toArray() as unknown as ContentSchedule[];
    
    console.log(`Found ${contentSchedules.length} content schedules`);
    
    // If a specific date is provided, filter by that date
    let filteredSchedules = contentSchedules;
    if (date) {
      // Convert the date string to a Date object for comparison
      const targetDate = new Date(date);
      const targetDateString = targetDate.toISOString().split('T')[0];
      
      filteredSchedules = contentSchedules.filter(schedule => {
        if (!schedule['Scheduled Date']) return false;
        
        const scheduleDate = new Date(schedule['Scheduled Date']);
        const scheduleDateString = scheduleDate.toISOString().split('T')[0];
        
        return scheduleDateString === targetDateString;
      });
      
      console.log(`Found ${filteredSchedules.length} schedules for date: ${date}`);
    }
    
    // Format the data for the frontend
    const formattedSchedules = filteredSchedules.map(schedule => ({
      _id: schedule._id,
      platform: schedule.Platform || '',
      title: schedule['Post Title / Caption'] || '',
      draft: schedule.Draft || '',
      status: schedule.Status || '',
      scheduledDate: schedule['Scheduled Date'] || '',
      publishedDate: schedule['Published Date'] || '',
      user: schedule.User || ''
    }));
    
    return NextResponse.json({ schedules: formattedSchedules });
  } catch (error) {
    console.error('Error fetching content schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content schedules' },
      { status: 500 }
    );
  }
}
