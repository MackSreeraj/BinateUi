import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const clientPromise = new MongoClient(process.env.MONGODB_URI || '').connect();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Platform ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Find the platform profile by obj_id which references the platform ID
    const platformProfile = await db.collection('platform_profiles')
      .findOne({ obj_id: id });
    
    if (!platformProfile) {
      return NextResponse.json(
        { error: 'Platform profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(platformProfile);
    
  } catch (error) {
    console.error('Error fetching platform profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch platform profile' },
      { status: 500 }
    );
  }
}
