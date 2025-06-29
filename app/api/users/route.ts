import { NextResponse } from 'next/server';
import mongoClient from '@/lib/mongodb';
import { saveFile } from '@/lib/file-upload';

// GET all users
export async function GET() {
  try {
    const client = await mongoClient;
    const db = client.db();
    
    const users = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// Create a new user
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const file = formData.get('profileImage') as File | null;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    let imageUrl = '';
    
    // Handle file upload
    if (file) {
      imageUrl = await saveFile(file);
    }

    // Save to MongoDB
    const client = await mongoClient;
    const db = client.db();
    
    const result = await db.collection('users').insertOne({
      username,
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertedId,
        username,
        imageUrl
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
