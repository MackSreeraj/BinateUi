import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate the ID format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid writer profile ID' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    // First, check if the writer exists
    const existingWriter = await db.collection('writers').findOne({
      _id: new ObjectId(id)
    });

    if (!existingWriter) {
      return NextResponse.json(
        { error: 'Writer profile not found' },
        { status: 404 }
      );
    }

    // Delete the writer profile
    const writerDeleteResult = await db.collection('writers').deleteOne({
      _id: new ObjectId(id)
    });

    if (writerDeleteResult.deletedCount === 0) {
      throw new Error('Failed to delete writer profile');
    }

    // Also delete related trained data from writer_profiles collection
    // where obj_id matches the writer's _id
    const profilesDeleteResult = await db.collection('writer_profiles').deleteMany({
      obj_id: id // Using the string ID as stored in writer_profiles
    });

    console.log(`Deleted ${profilesDeleteResult.deletedCount} related writer_profiles entries`);

    return NextResponse.json(
      { 
        message: 'Writer profile deleted successfully',
        deletedProfiles: profilesDeleteResult.deletedCount 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting writer profile:', error);
    return NextResponse.json(
      { error: 'Failed to delete writer profile' },
      { status: 500 }
    );
  }
}
