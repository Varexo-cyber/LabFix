import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/products/apply-vat
 *
 * Adds 21% BTW to every product that does NOT yet have it applied.
 * Idempotent: products with vat_applied = true are skipped, so calling this
 * endpoint repeatedly cannot inflate prices.
 *
 * Returns: { ok, updated, skipped, total }
 */
export async function POST(_request: NextRequest) {
  try {
    const sql = getDb();

    // Safety: make sure the flag column exists (the products GET also auto-migrates this)
    try {
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS vat_applied BOOLEAN DEFAULT false`;
    } catch {}

    // Count first for accurate reporting
    const beforeRows = await sql`
      SELECT
        COUNT(*) FILTER (WHERE vat_applied IS NOT TRUE)::int AS to_update,
        COUNT(*) FILTER (WHERE vat_applied IS TRUE)::int AS already_done,
        COUNT(*)::int AS total
      FROM products
    `;
    const toUpdate: number = beforeRows[0]?.to_update ?? 0;
    const alreadyDone: number = beforeRows[0]?.already_done ?? 0;
    const total: number = beforeRows[0]?.total ?? 0;

    if (toUpdate === 0) {
      return NextResponse.json({
        ok: true,
        updated: 0,
        skipped: alreadyDone,
        total,
        message: 'Alle producten hebben al 21% BTW toegepast.',
      });
    }

    // Apply +21% and mark as done in a single UPDATE.
    // ROUND to 2 decimals so prices stay clean (e.g. €10.00 -> €12.10).
    const result = await sql`
      UPDATE products
      SET price = ROUND(price * 1.21, 2),
          vat_applied = true,
          updated_at = NOW()
      WHERE vat_applied IS NOT TRUE
    `;

    return NextResponse.json({
      ok: true,
      updated: toUpdate,
      skipped: alreadyDone,
      total,
      message: `21% BTW toegepast op ${toUpdate} producten.`,
      raw: (result as any)?.count ?? null,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/products/apply-vat
 * Returns current VAT status counts (no mutation).
 */
export async function GET() {
  try {
    const sql = getDb();
    try {
      await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS vat_applied BOOLEAN DEFAULT false`;
    } catch {}

    const rows = await sql`
      SELECT
        COUNT(*) FILTER (WHERE vat_applied IS NOT TRUE)::int AS pending,
        COUNT(*) FILTER (WHERE vat_applied IS TRUE)::int AS applied,
        COUNT(*)::int AS total
      FROM products
    `;
    return NextResponse.json({
      ok: true,
      pending: rows[0]?.pending ?? 0,
      applied: rows[0]?.applied ?? 0,
      total: rows[0]?.total ?? 0,
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
