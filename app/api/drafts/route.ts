import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Define interfaces for our data types
interface Trend {
  _id: string | ObjectId;
  Title: string; // The trend name is stored in the Title field
  [key: string]: any; // Allow for other properties
}

interface Draft {
  _id: string | ObjectId;
  trendId: string;
  Drafts?: string;
  'Content Idea'?: string;
  Platform?: string;
  DiscoveryDate?: string;
  [key: string]: any; // Allow for other properties
}

export async function GET(request: NextRequest) {
  try {
    // Get the trendId from the query parameters
    const { searchParams } = new URL(request.url);
    const trendId = searchParams.get('trendId');
    
    // Connect to the database
    const client = await clientPromise;
    const db = client.db();
    
    // If no trendId is provided, return all drafts
    if (!trendId) {
      console.log('No trendId provided, fetching all drafts');
      
      const allDrafts = await db
        .collection('drafts')
        .find({})
        .sort({ DiscoveryDate: -1 })
        .toArray() as unknown as Draft[];
      
      console.log(`Found ${allDrafts.length} total drafts`);
      
      // Map the database fields to the expected format
      const formattedDrafts = allDrafts.map(draft => ({
        _id: draft._id,
        trendId: draft.trendId || '',
        content: draft.Drafts || '',
        title: draft['Content Idea'] || '',
        platform: draft.Platform || '',
        createdAt: draft.DiscoveryDate || new Date().toISOString()
      }));
      
      return NextResponse.json({ drafts: formattedDrafts });
    }

    console.log(`Searching for drafts with trendId: ${trendId}`);
    
    // STEP 1: Get all trends to find the one with matching ID
    console.log('Fetching all trends to find the matching one...');
    const trends = await db
      .collection('trends')
      .find({})
      .toArray() as unknown as Trend[];
      
    console.log(`Found ${trends.length} total trends`);
    
    // Log the first trend to understand its structure
    if (trends.length > 0) {
      console.log('First trend structure:', JSON.stringify(trends[0], null, 2));
    }
    
    // STEP 2: Find the trend with the matching ID
    let matchingTrend: Trend | null = null;
    
    // Try to match by ObjectId if it's a valid format
    if (/^[0-9a-fA-F]{24}$/.test(trendId)) {
      matchingTrend = trends.find(trend => 
        trend._id.toString() === trendId || 
        (trend._id instanceof ObjectId && trend._id.equals(new ObjectId(trendId)))
      ) || null;
    }
    
    // If no match by ID, try other fields
    if (!matchingTrend) {
      matchingTrend = trends.find(trend => 
        trend.Title && trend.Title.includes(trendId)
      ) || null;
    }
    
    // STEP 3: Get the trend title if found
    let trendTitle = "";
    if (matchingTrend) {
      trendTitle = matchingTrend.Title || "";
      console.log(`Found matching trend with title: "${trendTitle}"`);
    } else {
      console.log(`No matching trend found for ID: ${trendId}`);
    }
    
    // STEP 4: Fetch all drafts to find matches
    console.log('Fetching all drafts...');
    const allDrafts = await db
      .collection('drafts')
      .find({})
      .sort({ DiscoveryDate: -1 })
      .toArray() as unknown as Draft[];
      
    console.log(`Found ${allDrafts.length} total drafts`);
    
    // STEP 5: Filter drafts that match the trend
    let matchingDrafts: Draft[] = [];
    
    if (trendTitle) {
      // If we found a trend title, look for drafts with that exact title or containing it
      matchingDrafts = allDrafts.filter(draft => 
        draft.trendId === trendTitle || 
        (draft.trendId && draft.trendId.includes(trendTitle))
      );
      console.log(`Found ${matchingDrafts.length} drafts matching trend title: "${trendTitle}"`);
    } else {
      // If no trend title, try matching with the original trendId
      matchingDrafts = allDrafts.filter(draft => 
        draft.trendId === trendId || 
        (draft.trendId && draft.trendId.includes(trendId))
      );
      console.log(`Found ${matchingDrafts.length} drafts matching original trendId: "${trendId}"`);
    }
    
    // Log the first matching draft if any
    if (matchingDrafts.length > 0) {
      console.log('First matching draft trendId:', matchingDrafts[0].trendId);
    }
    
    // Map the database fields to the expected format
    const formattedDrafts = matchingDrafts.map(draft => ({
      _id: draft._id,
      trendId: draft.trendId,
      content: draft.Drafts || '', // Map 'Drafts' field to 'content'
      title: draft['Content Idea'] || '',
      platform: draft.Platform || '',
      createdAt: draft.DiscoveryDate || new Date().toISOString()
    }));

    // Return the formatted drafts as JSON
    return NextResponse.json({ drafts: formattedDrafts });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}
