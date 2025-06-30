import { NextResponse } from 'next/server';
import { saveFile } from '@/lib/file-upload';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Save the file and get the path
    const filePath = await saveFile(file);

    return NextResponse.json({ 
      success: true, 
      filePath 
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
