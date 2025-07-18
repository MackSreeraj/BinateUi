import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    console.log('[API] GET /api/content-ideas - Fetching content ideas');
    const { searchParams } = new URL(request.url);
    const fieldsParam = searchParams.get('fields');
    
    // Parse fields parameter if provided (comma-separated list of fields)
    const fields = fieldsParam ? fieldsParam.split(',') : null;
    const titleOnly = fields?.includes('title') && fields.length === 1;
    
    console.log(`[API] Request params - fields: ${fieldsParam}, titleOnly: ${titleOnly}`);
    
    const client = await clientPromise;
    const db = client.db();
    
    let projection = {};
    
    // If only title is requested, set projection to include only title and required fields
    if (titleOnly) {
      console.log('[API] Fetching only title field from content ideas');
      projection = { content: 1, _id: 1, trendId: 1 };
    }
    
    const contentIdeas = await db.collection('content_ideas')
      .find({}, { projection: Object.keys(projection).length ? projection : undefined })
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log(`[API] Found ${contentIdeas.length} content ideas in database`);
    
    // Convert MongoDB ObjectIds to strings for JSON serialization
    const serializedContentIdeas = contentIdeas.map((idea: any) => ({
      ...idea,
      _id: idea._id.toString()
    }));
    
    console.log('[API] Returning serialized content ideas');
    return NextResponse.json(serializedContentIdeas);
  } catch (error) {
    console.error('[API] Error fetching content ideas:', error);
    return NextResponse.json({ error: 'Failed to fetch content ideas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('[API] POST /api/content-ideas - Creating new content idea');
    const body = await request.json();
    console.log('[API] Received content idea data:', body);
    
    const client = await clientPromise;
    const db = client.db();
    
    // Create content idea with required fields
    const contentIdea = {
      userId: body.userId || "",
      trendId: body.trendId || "",
      content: body.content || "",
      specificitiesDraft: body.specificitiesDraft || "", // Changed from "Specificities Draft" to camelCase
      specificitiesForImages: body.specificitiesForImages || "", // Changed from "Specificities for Images" to camelCase
      writer: body.writer || "", // Changed from "Writer" to camelCase
      platform: body.platform || "", // Changed from "Platform" to camelCase
      drafts: body.drafts || "", // Changed from "Drafts" to camelCase
      company: body.company || "", // Changed from "Company" to camelCase
      status: body.status || "Draft",
      createdAt: new Date()
    };
    
    console.log('[API] Formatted content idea for database:', contentIdea);
    
    const result = await db.collection('content_ideas').insertOne(contentIdea);
    console.log('[API] Content idea inserted with ID:', result.insertedId.toString());
    
    // Verify the content idea was created
    const createdIdea = await db.collection('content_ideas').findOne({ _id: result.insertedId });
    console.log('[API] Verified created content idea:', createdIdea ? 'Success' : 'Not found');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Content idea created successfully',
      id: result.insertedId.toString()
    }, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating content idea:', error);
    return NextResponse.json({ error: 'Failed to create content idea' }, { status: 500 });
  }
}
