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
    const result = await db.collection('writers').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      throw new Error('Failed to delete writer profile');
    }

    return NextResponse.json(
      { message: 'Writer profile deleted successfully' },
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
