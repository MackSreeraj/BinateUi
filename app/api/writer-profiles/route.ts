import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const writerData = await request.json();
    
    // Basic validation
    if (!writerData.name) {
      return NextResponse.json(
        { error: 'Writer name is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Add timestamps
    const now = new Date();
    const writer = {
      ...writerData,
      createdAt: now,
      updatedAt: now,
    };

    // Insert the new writer profile
    const result = await db.collection('writers').insertOne(writer);
    
    // Return the created writer profile with its ID
    const createdWriter = {
      _id: result.insertedId,
      ...writer
    };

    return NextResponse.json(createdWriter, { status: 201 });
  } catch (error) {
    console.error('Error creating writer profile:', error);
    return NextResponse.json(
      { error: 'Failed to create writer profile' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const writers = await db.collection('writers')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(writers);
  } catch (error) {
    console.error('Error fetching writer profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch writer profiles' },
      { status: 500 }
    );
  }
}
