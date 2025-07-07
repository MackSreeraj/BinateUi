import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { companyId } = await request.json();
    
    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Create a new training job record
    const trainingJob = await db.collection('training_jobs').insertOne({
      companyId: new ObjectId(companyId),
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Start the training workflow in the background
    const trainingId = trainingJob.insertedId.toString();
    
    // Don't await the training workflow, let it run in the background
    fetch(`https://n8n.srv775152.hstgr.cloud/webhook/7581af18-09d1-4b08-b7f5-bd70bf32d800?companyId=${companyId}&trainingId=${trainingId}`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to start training workflow');
        return response.json();
      })
      .then(async (result) => {
        // Update the training job with the result
        await db.collection('training_jobs').updateOne(
          { _id: trainingJob.insertedId },
          {
            $set: {
              status: 'completed',
              progress: 100,
              result: result,
              updatedAt: new Date(),
            },
          }
        );
      })
      .catch(async (error) => {
        console.error('Error in training workflow:', error);
        await db.collection('training_jobs').updateOne(
          { _id: trainingJob.insertedId },
          {
            $set: {
              status: 'failed',
              error: error.message,
              updatedAt: new Date(),
            },
          }
        );
      });

    // Return the training ID immediately
    return NextResponse.json({
      trainingId: trainingId,
      status: 'pending',
      progress: 0,
      message: 'Training job started',
    });
  } catch (error) {
    console.error('Error in training model proxy:', error);
    return NextResponse.json(
      { error: 'Failed to start training' },
      { status: 500 }
    );
  }
}
