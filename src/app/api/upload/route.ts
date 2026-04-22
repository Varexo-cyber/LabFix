import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('Upload API called');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('File received:', file?.name, file?.size, file?.type);

    if (!file) {
      console.log('No file in formData');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPG, PNG, GIF and WebP are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    console.log('Uploads directory:', uploadsDir);
    try {
      await mkdir(uploadsDir, { recursive: true });
      console.log('Directory created/verified');
    } catch (dirError) {
      console.error('Directory creation error:', dirError);
      return NextResponse.json({ 
        error: 'Failed to create uploads directory' 
      }, { status: 500 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = path.extname(originalName) || '.jpg';
    const filename = `${timestamp}_${originalName}`;
    const filepath = path.join(uploadsDir, filename);

    console.log('Generated filename:', filename);
    console.log('Full filepath:', filepath);

    // Write file
    try {
      await writeFile(filepath, buffer);
      console.log('File written successfully');
    } catch (writeError) {
      console.error('File write error:', writeError);
      return NextResponse.json({ 
        error: 'Failed to save file to disk' 
      }, { status: 500 });
    }

    // Return the public URL
    const publicUrl = `/api/uploads/${filename}`;
    console.log('Returning URL:', publicUrl);

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename: filename 
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to upload file' 
    }, { status: 500 });
  }
}
