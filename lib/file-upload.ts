import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function saveFile(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    
    // Generate a unique filename
    const filename = `${uuidv4()}-${file.name}`;
    const publicPath = join(process.cwd(), 'public/uploads');
    const filePath = join(publicPath, filename);
    
    // Create the uploads directory if it doesn't exist
    await mkdir(publicPath, { recursive: true });
    
    // Convert to Buffer for file writing
    const buffer = Buffer.from(bytes);
    
    // Save file to public/uploads directory
    await writeFile(filePath, buffer);
    
    return `/uploads/${filename}`;
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Failed to save file');
  }
}
