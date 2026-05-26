import { NextRequest, NextResponse } from 'next/server';
import { sendOrderStatusUpdate } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/debug-send-status?to=email@x.com&status=processing&orderId=ORD-XXX&tracking=3SMUKZ...
export async function GET(request: NextRequest) {
  const to = request.nextUrl.searchParams.get('to') || 'mohammed813100@gmail.com';
  const status = (request.nextUrl.searchParams.get('status') || 'processing') as 'processing' | 'shipped' | 'delivered';
  const orderId = request.nextUrl.searchParams.get('orderId') || 'ORD-MPMTQMFG-7Y9Z';
  const tracking = request.nextUrl.searchParams.get('tracking') || '3SMUKZ279492886';
  const carrier = request.nextUrl.searchParams.get('carrier') || 'PostNL';

  try {
    const info = await sendOrderStatusUpdate({
      to,
      orderId,
      contactPerson: 'Mohammed Taher',
      status,
      trackingNumber: tracking,
      shippingCarrier: carrier,
    });
    return NextResponse.json({ ok: true, to, status, orderId, info: { messageId: (info as any).messageId, accepted: (info as any).accepted } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message, stack: err.stack }, { status: 500 });
  }
}
