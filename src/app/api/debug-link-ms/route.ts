import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// One-shot: link an existing MS order to a LabFix order in the DB
// Usage: GET /api/debug-link-ms?orderId=ORD-XXX&msOrderId=95075&msIncrementId=600195675
export async function GET(request: NextRequest) {
  const orderId = request.nextUrl.searchParams.get('orderId');
  const msOrderId = request.nextUrl.searchParams.get('msOrderId');
  const msIncrementId = request.nextUrl.searchParams.get('msIncrementId') || '';
  if (!orderId || !msOrderId) return NextResponse.json({ error: 'orderId and msOrderId required' }, { status: 400 });

  const sql = getDb();
  try {
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS ms_tracking_number TEXT DEFAULT ''`;
    await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`;
  } catch {}

  const result = await sql`
    UPDATE orders SET ms_order_id = ${msOrderId}, ms_increment_id = ${msIncrementId}
    WHERE id = ${orderId}
    RETURNING id, ms_order_id, ms_increment_id, status
  `;
  return NextResponse.json({ ok: true, updated: result });
}
