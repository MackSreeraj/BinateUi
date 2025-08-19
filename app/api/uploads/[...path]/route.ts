import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get the file path from the URL parameters
    const filePath = params.path.join('/');
    
    // Construct the absolute path to the file in the public/uploads directory
    const fullPath = path.join(process.cwd(), 'public', 'uploads', filePath);
    
    // Check if the file exists
    try {
      await fs.access(fullPath);
    } catch (error) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Read the file
    const fileBuffer = await fs.readFile(fullPath);
    
    // Determine the content type based on file extension
    const contentType = mime.lookup(fullPath) || 'application/octet-stream';
    
    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
