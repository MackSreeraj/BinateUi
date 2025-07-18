import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    const client = await clientPromise;
    const db = client.db();
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    // Update the content idea
    const result = await db.collection('content_ideas').updateOne(
      { _id: new ObjectId(id) },
      { $set: {
          Writer: body.writer || '',
          Platform: body.platform || '',
          Company: body.company || '',
          userId: body.userId || '',
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Content idea not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Content idea updated successfully' 
    });
  } catch (error) {
    console.error('Error updating content idea:', error);
    return NextResponse.json({ error: 'Failed to update content idea' }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const client = await clientPromise;
    const db = client.db();
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    // Find the content idea
    const contentIdea = await db.collection('content_ideas').findOne({ _id: new ObjectId(id) });
    
    if (!contentIdea) {
      return NextResponse.json({ error: 'Content idea not found' }, { status: 404 });
    }
    
    // Convert ObjectId to string for JSON serialization
    return NextResponse.json({
      ...contentIdea,
      _id: contentIdea._id.toString()
    });
  } catch (error) {
    console.error('Error fetching content idea:', error);
    return NextResponse.json({ error: 'Failed to fetch content idea' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const client = await clientPromise;
    const db = client.db();
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }
    
    // Delete the content idea
    const result = await db.collection('content_ideas').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Content idea not found' }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Content idea deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting content idea:', error);
    return NextResponse.json({ error: 'Failed to delete content idea' }, { status: 500 });
  }
}
