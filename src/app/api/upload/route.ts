import { NextRequest, NextResponse } from 'next/server';
import { storeImage } from '@/lib/product-images';

export const runtime = 'nodejs';

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

    // Validate file size (max 2MB for base64)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 2MB for Netlify deployment.' 
      }, { status: 400 });
    }

    // De bytes gaan de database in en krijgen een echte URL op /api/images/<id>.
    // Een data:-URL zou hier ook werken in de browser, maar Google Merchant
    // Center kan die niet ophalen, waardoor het product uit de feed valt.
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';

    const url = await storeImage(mimeType, base64);

    console.log('Stored image at', url, '- bytes:', buffer.length);

    return NextResponse.json({
      success: true,
      url,
      isBase64: false,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to upload' 
    }, { status: 500 });
  }
}
