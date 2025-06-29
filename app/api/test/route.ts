import { NextResponse } from 'next/server';
import mongoClient from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await mongoClient;
    await client.db().command({ ping: 1 });
    
    return NextResponse.json({ 
      status: 'success',
      message: 'Successfully connected to MongoDB!' 
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
