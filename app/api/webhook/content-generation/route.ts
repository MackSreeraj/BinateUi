import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    console.log('[WEBHOOK] POST /api/webhook/content-generation - Processing content generation request');
    const body = await request.json();
    console.log('[WEBHOOK] Received payload:', body);
    
    // Extract required parameters from the request body
    const {
      contentIdeaId,
      content,
      companyId,
      writerId,
      platformId,
      userId,
      status,
      specificitiesDraft,
      specificitiesForImages,
      timestamp
    } = body;
    
    // Validate required parameters
    if (!contentIdeaId || !companyId || !writerId || !platformId) {
      console.error('[WEBHOOK] Missing required parameters');
      return NextResponse.json({ 
        error: 'Missing required parameters',
        requiredParams: ['contentIdeaId', 'companyId', 'writerId', 'platformId']
      }, { status: 400 });
    }
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Fetch the content idea to ensure it exists
    console.log(`[WEBHOOK] Fetching content idea with ID: ${contentIdeaId}`);
    const contentIdea = await db.collection('content_ideas').findOne({ 
      _id: new ObjectId(contentIdeaId) 
    });
    
    if (!contentIdea) {
      console.error('[WEBHOOK] Content idea not found');
      return NextResponse.json({ error: 'Content idea not found' }, { status: 404 });
    }
    
    // Create a record of this generation request
    const generationRecord = {
      contentIdeaId: new ObjectId(contentIdeaId),
      companyId: new ObjectId(companyId),
      writerId: new ObjectId(writerId),
      platformId: new ObjectId(platformId),
      userId: userId ? new ObjectId(userId) : null,
      status: status || 'In Progress',
      specificitiesDraft,
      specificitiesForImages,
      requestTimestamp: timestamp || new Date().toISOString(),
      createdAt: new Date(),
      completedAt: null,
      result: null
    };
    
    console.log('[WEBHOOK] Creating generation record:', generationRecord);
    const result = await db.collection('content_generations').insertOne(generationRecord);
    
    // Update the content idea status
    await db.collection('content_ideas').updateOne(
      { _id: new ObjectId(contentIdeaId) },
      { $set: { 
        status: status || 'In Progress',
        lastGenerationId: result.insertedId,
        lastGenerationTimestamp: new Date()
      }}
    );
    
    // Here you would typically trigger an external service or process
    // to actually generate the content based on the parameters
    
    // For now, we'll simulate this with a log message
    console.log('[WEBHOOK] Content generation request queued successfully');
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Content generation request processed successfully',
      generationId: result.insertedId.toString()
    }, { status: 200 });
    
  } catch (error) {
    console.error('[WEBHOOK] Error processing content generation request:', error);
    return NextResponse.json({ 
      error: 'Failed to process content generation request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
