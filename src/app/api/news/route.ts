import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const sql = getDb();
    const articles = await sql`SELECT * FROM news_articles ORDER BY created_at DESC`;

    const mapped = articles.map((a: any) => ({
      id: a.id,
      title: a.title,
      titleEn: a.title_en,
      summary: a.summary,
      summaryEn: a.summary_en,
      content: a.content,
      contentEn: a.content_en,
      image: a.image,
      images: a.images || [],
      published: a.published,
      createdAt: a.created_at,
      updatedAt: a.updated_at,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();
    const id = crypto.randomUUID();

    await sql`
      INSERT INTO news_articles (id, title, title_en, summary, summary_en, content, content_en, image, images, published)
      VALUES (${id}, ${body.title}, ${body.titleEn || ''}, ${body.summary || ''}, ${body.summaryEn || ''}, ${body.content || ''}, ${body.contentEn || ''}, ${body.image || ''}, ${JSON.stringify(body.images || [])}, ${body.published ?? true})
    `;

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();

    await sql`
      UPDATE news_articles SET
        title = ${body.title},
        title_en = ${body.titleEn || ''},
        summary = ${body.summary || ''},
        summary_en = ${body.summaryEn || ''},
        content = ${body.content || ''},
        content_en = ${body.contentEn || ''},
        image = ${body.image || ''},
        images = ${JSON.stringify(body.images || [])},
        published = ${body.published ?? true},
        updated_at = NOW()
      WHERE id = ${body.id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    await sql`DELETE FROM news_articles WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
