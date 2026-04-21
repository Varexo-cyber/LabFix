import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST - Create new contact message
export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Naam, email en bericht zijn verplicht' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ongeldig email adres' },
        { status: 400 }
      );
    }

    // Insert into database
    const result = await sql`
      INSERT INTO contact_messages (name, email, subject, message, status, created_at)
      VALUES (${name}, ${email}, ${subject || 'Geen onderwerp'}, ${message}, 'unread', NOW())
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: 'Bericht succesvol verstuurd',
      data: result[0]
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan bij het versturen' },
      { status: 500 }
    );
  }
}

// GET - Get all contact messages (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let result;
    
    if (status) {
      result = await sql`
        SELECT * FROM contact_messages 
        WHERE status = ${status}
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      result = await sql`
        SELECT * FROM contact_messages 
        ORDER BY created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    // Get counts
    const unreadCount = await sql`SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'`;
    const totalCount = await sql`SELECT COUNT(*) as count FROM contact_messages`;

    return NextResponse.json({
      success: true,
      data: result,
      counts: {
        total: totalCount[0].count,
        unread: unreadCount[0].count
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan' },
      { status: 500 }
    );
  }
}
