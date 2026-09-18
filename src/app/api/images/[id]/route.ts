import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { ensureImagesTable } from '@/lib/product-images';

export const runtime = 'nodejs';

// Serveert een geuploade afbeelding als echt plaatje op een vaste URL, zodat
// Google Merchant Center (en elke andere crawler) hem kan ophalen.
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sql = getDb();
    await ensureImagesTable(sql);

    const rows = await sql`SELECT mime, data FROM product_images WHERE id = ${params.id} LIMIT 1`;
    if (rows.length === 0) {
      return new NextResponse('Not found', { status: 404 });
    }

    const { mime, data } = rows[0] as { mime: string; data: string };
    const buffer = Buffer.from(data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mime || 'image/jpeg',
        // De inhoud achter een id verandert nooit, dus mag hij lang blijven staan.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(buffer.length),
      },
    });
  } catch (error: any) {
    return new NextResponse('Error', { status: 500 });
  }
}
