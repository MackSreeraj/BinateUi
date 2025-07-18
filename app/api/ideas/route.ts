import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Database and collection names
const DB_NAME = 'test';
const COLLECTION_NAME = 'ideas';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Fetch all ideas from the database
    const ideas = await collection.find({}).sort({ createdAt: -1 }).toArray();
    
    // Convert MongoDB ObjectIds to strings for JSON serialization
    const serializedIdeas = ideas.map(idea => ({
      ...idea,
      _id: idea._id.toString()
    }));
    
    return NextResponse.json(serializedIdeas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const userId = formData.get('userId') as string;
    const attachment = formData.get('attachment') as File | null;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    let attachmentPath = null;

    // Handle file upload if attachment exists
    if (attachment) {
      const bytes = await attachment.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'ideas');
      await mkdir(uploadDir, { recursive: true });

      // Generate unique filename
      const filename = `${uuidv4()}-${attachment.name}`;
      const filePath = join(uploadDir, filename);

      // Write file to disk
      await writeFile(filePath, buffer);
      attachmentPath = `/uploads/ideas/${filename}`;
    }

    // Create new idea object
    const newIdea = {
      content,
      userId: userId || null,
      attachmentPath,
      createdAt: new Date().toISOString(),
    };

    // Connect to MongoDB and save the idea
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    
    // Insert the new idea into the database
    const result = await collection.insertOne(newIdea);
    
    // Return the created idea with its MongoDB _id
    return NextResponse.json({ 
      idea: {
        ...newIdea,
        _id: result.insertedId.toString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating idea:', error);
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}
