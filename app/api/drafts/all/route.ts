import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db();

    // Get all drafts (limit to 10 for safety)
    const drafts = await db
      .collection('drafts')
      .find({})
      .limit(10)
      .toArray();
      
    console.log(`Found ${drafts.length} total drafts in database`);
    console.log('Sample draft structure:', JSON.stringify(drafts[0], null, 2));

    // Return all drafts
    return NextResponse.json({ drafts });
  } catch (error) {
    console.error('Error fetching all drafts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}
