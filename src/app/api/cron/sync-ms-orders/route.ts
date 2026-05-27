import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getMsOrderById } from '@/lib/mobilesentrix-new';
import { sendOrderStatusUpdate } from '@/lib/email';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Map MobileSentrix order status → LabFix status
function mapMsStatus(msStatus: string): 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'paid' | null {
  if (!msStatus) return null;
  const s = msStatus.toLowerCase();
  if (s.includes('shipped') || s.includes('complete')) return 'shipped';
  if (s.includes('delivered')) return 'delivered';
  if (s.includes('processing') || s.includes('onboarding') || s.includes('review')) return 'processing';
  if (s.includes('cancel') || s.includes('hold')) return 'cancelled';
  return null; // unknown - skip
}

// Detect carrier from shipping description
function detectCarrier(shippingDescription: string): string {
  if (!shippingDescription) return 'PostNL';
  const s = shippingDescription.toLowerCase();
  if (s.includes('postnl')) return 'PostNL';
  if (s.includes('dhl')) return 'DHL';
  if (s.includes('dpd')) return 'DPD';
  if (s.includes('ups')) return 'UPS';
  if (s.includes('fedex')) return 'FedEx';
  return 'PostNL';
}

export async function GET(request: NextRequest) {
  // Optional auth: only allow if cron secret matches (set CRON_SECRET in env)
  const authHeader = request.headers.get('authorization') || '';
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const sql = getDb();
  const results: any[] = [];

  try {
    // Auto-migrate columns if missing (idempotent)
    try {
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS ms_tracking_number TEXT DEFAULT ''`;
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`;
      // Tracks which status-update notifications we already sent (comma-separated: "processing,shipped,delivered")
      await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS notifications_sent TEXT DEFAULT ''`;
      // Backfill: for any order already in processing/shipped/delivered with empty notifications_sent,
      // assume the current status was already emailed (prevents duplicate spam on first run after deploy).
      await sql`
        UPDATE orders
        SET notifications_sent = status
        WHERE (notifications_sent IS NULL OR notifications_sent = '')
          AND status IN ('processing', 'shipped', 'delivered')
      `;
    } catch (migErr: any) {
      console.warn('migration warn:', migErr.message);
    }

    // Find orders needing sync: have ms_order_id but not yet delivered/cancelled
    const rows = await sql`
      SELECT id, user_email, contact_person, status, ms_order_id, ms_increment_id,
             ms_tracking_number, notifications_sent, shipping_postal_code
      FROM orders
      WHERE ms_order_id IS NOT NULL
        AND ms_order_id != ''
        AND status NOT IN ('delivered', 'cancelled')
      ORDER BY id DESC
      LIMIT 50
    `;

    console.log(`🔄 Cron: ${rows.length} orders to check`);

    for (const order of rows) {
      try {
        const msOrder: any = await getMsOrderById(order.ms_order_id);
        const msStatusRaw = msOrder?.status || '';
        const newStatus = mapMsStatus(msStatusRaw);
        const newTracking = msOrder?.tracking_number || '';
        const carrier = detectCarrier(msOrder?.shipping_description || '');

        const statusChanged = newStatus && newStatus !== order.status;
        const trackingChanged = newTracking && newTracking !== order.ms_tracking_number;

        results.push({
          orderId: order.id,
          ms_status_raw: msStatusRaw,
          mapped_status: newStatus,
          oldStatus: order.status,
          tracking: newTracking || null,
          statusChanged,
          trackingChanged,
        });

        if (!statusChanged && !trackingChanged) continue;

        // Update DB
        if (statusChanged && trackingChanged) {
          await sql`UPDATE orders SET status = ${newStatus}, ms_tracking_number = ${newTracking}, updated_at = NOW() WHERE id = ${order.id}`;
        } else if (statusChanged) {
          await sql`UPDATE orders SET status = ${newStatus}, updated_at = NOW() WHERE id = ${order.id}`;
        } else if (trackingChanged) {
          await sql`UPDATE orders SET ms_tracking_number = ${newTracking}, updated_at = NOW() WHERE id = ${order.id}`;
        }

        // Send email — only ONCE per status transition.
        // We persist which statuses we already emailed in `notifications_sent` (CSV).
        const emailableStatuses: Array<'processing' | 'shipped' | 'delivered'> = ['processing', 'shipped', 'delivered'];
        const alreadySent = (order.notifications_sent || '')
          .split(',')
          .map((s: string) => s.trim().toLowerCase())
          .filter(Boolean);

        // Decide which status (if any) we should notify about
        let emailStatus: 'processing' | 'shipped' | 'delivered' | null = null;
        if (newStatus && emailableStatuses.includes(newStatus as any) && !alreadySent.includes(newStatus)) {
          emailStatus = newStatus as any;
        }

        if (emailStatus) {
          try {
            await sendOrderStatusUpdate({
              to: order.user_email,
              orderId: order.id,
              contactPerson: order.contact_person || 'Klant',
              status: emailStatus,
              trackingNumber: newTracking || undefined,
              shippingCarrier: carrier,
              shippingPostcode: order.shipping_postal_code || undefined,
            });
            // Mark as sent so we never email this status again for this order
            const updated = [...alreadySent, emailStatus].join(',');
            await sql`UPDATE orders SET notifications_sent = ${updated} WHERE id = ${order.id}`;
            (results[results.length - 1] as any).emailSent = emailStatus;
          } catch (emailErr: any) {
            (results[results.length - 1] as any).emailError = emailErr.message;
          }
        } else {
          (results[results.length - 1] as any).emailSkipped = `already sent: ${alreadySent.join(',') || 'none'}`;
        }
      } catch (err: any) {
        results.push({ orderId: order.id, error: err.message });
      }
    }

    return NextResponse.json({ ok: true, checked: rows.length, results });
  } catch (err: any) {
    console.error('Cron sync error:', err);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
