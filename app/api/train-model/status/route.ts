import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

// Helper function to validate if a string is a valid MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trainingId = searchParams.get('trainingId');

  if (!trainingId) {
    return NextResponse.json(
      { error: 'Training ID is required' },
      { status: 400 }
    );
  }

  // Validate the training ID format
  if (!isValidObjectId(trainingId)) {
    return NextResponse.json(
      { error: 'Invalid training ID format' },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Find the training status in the database
    const trainingStatus = await db.collection('training_jobs').findOne({
      _id: new ObjectId(trainingId)
    });

    if (!trainingStatus) {
      return NextResponse.json(
        { 
          status: 'error',
          error: 'Training job not found',
          progress: 0
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: trainingStatus.status || 'pending',
      progress: trainingStatus.progress || 0,
      result: trainingStatus.result,
      error: trainingStatus.error,
      updatedAt: trainingStatus.updatedAt || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking training status:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Failed to check training status',
        progress: 0
      },
      { status: 500 }
    );
  }
}
