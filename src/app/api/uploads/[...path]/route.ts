import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Join all path segments to get the full filename
    const filename = params.path.join('/');
    const filePath = join(process.cwd(), 'uploads', filename);
    
    // Security check: ensure path is within uploads directory
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!filePath.startsWith(uploadsDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Check if file exists
    if (!existsSync(filePath)) {
      console.log('File not found:', filePath);
      // Return placeholder image instead of 404
      try {
        const placeholderPath = join(process.cwd(), 'public', 'logo.png');
        if (existsSync(placeholderPath)) {
          const placeholderBuffer = await readFile(placeholderPath);
          return new NextResponse(placeholderBuffer, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=3600',
            },
          });
        }
      } catch (placeholderError) {
        console.error('Placeholder not found:', placeholderError);
      }
      return new NextResponse('Not Found', { status: 404 });
    }
    
    // Read file
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on extension
    const ext = filePath.split('.').pop()?.toLowerCase();
    const contentTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
    };
    const contentType = contentTypes[ext || ''] || 'application/octet-stream';
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
