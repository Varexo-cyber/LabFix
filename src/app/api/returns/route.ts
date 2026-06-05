import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { sendReturnRequestAdmin, sendReturnConfirmation } from '@/lib/email';

export const runtime = 'nodejs';

const RETURN_WINDOW_DAYS = 14;

// Ensure returns table exists
async function ensureTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS returns (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      user_id TEXT DEFAULT '',
      user_email TEXT NOT NULL,
      contact_person TEXT DEFAULT '',
      reason TEXT NOT NULL,
      description TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      ms_increment_id TEXT DEFAULT '',
      admin_notes TEXT DEFAULT '',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

function mapReturn(r: any) {
  return {
    id: r.id,
    orderId: r.order_id,
    userId: r.user_id,
    userEmail: r.user_email,
    contactPerson: r.contact_person,
    reason: r.reason,
    description: r.description,
    status: r.status,
    msIncrementId: r.ms_increment_id,
    adminNotes: r.admin_notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// GET — list returns (optionally by userId or orderId)
export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const orderId = searchParams.get('orderId');

    let rows;
    if (orderId) {
      rows = await sql`SELECT * FROM returns WHERE order_id = ${orderId} ORDER BY created_at DESC`;
    } else if (userId) {
      rows = await sql`SELECT * FROM returns WHERE user_id = ${userId} ORDER BY created_at DESC`;
    } else {
      rows = await sql`SELECT * FROM returns ORDER BY created_at DESC`;
    }

    return NextResponse.json(rows.map(mapReturn));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST — create a return request (customer-facing)
export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);

    const body = await request.json();
    const { orderId, reason, description } = body;

    if (!orderId || !reason) {
      return NextResponse.json({ success: false, message: 'Bestelnummer en reden zijn verplicht.' }, { status: 400 });
    }

    // Look up the order
    const orders = await sql`SELECT * FROM orders WHERE id = ${orderId}`;
    if (orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Bestelling niet gevonden.' }, { status: 404 });
    }
    const order = orders[0];

    // 14-day herroepingsrecht check
    const orderDate = new Date(order.created_at);
    const now = new Date();
    const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > RETURN_WINDOW_DAYS) {
      return NextResponse.json({
        success: false,
        message: `De retourtermijn van ${RETURN_WINDOW_DAYS} dagen is verstreken. Een retour is niet meer mogelijk voor deze bestelling.`,
      }, { status: 400 });
    }

    // Prevent duplicate active return requests for the same order
    const existing = await sql`
      SELECT id FROM returns WHERE order_id = ${orderId} AND status NOT IN ('rejected', 'refunded')
    `;
    if (existing.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Er is al een retouraanvraag voor deze bestelling ingediend.',
      }, { status: 400 });
    }

    const id = 'RET-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    const contactPerson = order.contact_person || `${order.first_name || ''} ${order.last_name || ''}`.trim();

    await sql`
      INSERT INTO returns (id, order_id, user_id, user_email, contact_person, reason, description, status, ms_increment_id)
      VALUES (
        ${id},
        ${orderId},
        ${order.user_id || ''},
        ${order.user_email},
        ${contactPerson},
        ${reason},
        ${description || ''},
        'pending',
        ${order.ms_increment_id || ''}
      )
    `;

    // Send emails (do not fail the request if email fails)
    try {
      const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
      const itemList = items.map((it: any) => ({
        name: it.product?.name || it.name || 'Onbekend product',
        quantity: it.quantity || 1,
      }));

      await Promise.all([
        sendReturnRequestAdmin({
          returnId: id,
          orderId,
          msIncrementId: order.ms_increment_id || '',
          contactPerson,
          userEmail: order.user_email,
          phone: order.phone || '',
          reason,
          description: description || '',
          items: itemList,
        }),
        sendReturnConfirmation({
          to: order.user_email,
          returnId: id,
          orderId,
          contactPerson,
          reason,
          items: itemList,
        }),
      ]);
    } catch (emailErr) {
      console.error('Return email send failed (return still created):', emailErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT — update return status (admin)
export async function PUT(request: NextRequest) {
  try {
    const sql = getDb();
    await ensureTable(sql);
    const body = await request.json();
    const { id, status, adminNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Return ID vereist.' }, { status: 400 });
    }

    if (status && adminNotes !== undefined) {
      await sql`UPDATE returns SET status = ${status}, admin_notes = ${adminNotes}, updated_at = NOW() WHERE id = ${id}`;
    } else if (status) {
      await sql`UPDATE returns SET status = ${status}, updated_at = NOW() WHERE id = ${id}`;
    } else if (adminNotes !== undefined) {
      await sql`UPDATE returns SET admin_notes = ${adminNotes}, updated_at = NOW() WHERE id = ${id}`;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
