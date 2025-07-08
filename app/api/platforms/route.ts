import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const clientPromise = new MongoClient(process.env.MONGODB_URI || '').connect();

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const data = await request.json();
    
    // Add created at timestamp
    const platformData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await db.collection('platforms').insertOne(platformData);
    
    return NextResponse.json({
      success: true,
      data: {
        ...platformData,
        _id: result.insertedId
      }
    });
    
  } catch (error) {
    console.error('Error saving platform:', error);
    return NextResponse.json(
      { error: 'Failed to save platform' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI not configured');
    }

    const client = await clientPromise;
    const db = client.db();
    
    const platforms = await db.collection('platforms')
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(platforms);
    
  } catch (error) {
    console.error('Error fetching platforms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    );
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    );
  }
}
