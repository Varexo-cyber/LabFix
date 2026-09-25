import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getProductsBySku } from '@/lib/mobilesentrix-new';
import { resolveStock } from '@/lib/ms-stock';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// Houdt de voorraadstatus gelijk met MobileSentrix.
//
// De voorraad werd alleen bij het importeren weggeschreven en daarna nooit
// meer. Vanaf dat moment liep hij dus weg van de werkelijkheid: producten die
// bij MobileSentrix weer binnen waren bleven bij ons op uitverkocht staan, en
// andersom. Deze route haalt de actuele stand op en werkt in_stock en stock bij.
//
// Bewust voorzichtig: een product dat MobileSentrix niet teruggeeft wordt NIET
// op uitverkocht gezet. Dat kan een eigen product zijn dat daar niet bestaat,
// of een sku die is hernoemd. Alleen wat MobileSentrix daadwerkelijk meldt,
// wordt overgenomen.

const SKU_BATCH_SIZE = 40;

interface SyncResult {
  checked: number;
  matched: number;
  updated: number;
  unchanged: number;
  notFound: number;
  batchErrors: string[];
  changes: Array<{ sku: string; from: boolean; to: boolean; qty: number }>;
}

async function syncStock(limit: number, dryRun: boolean): Promise<SyncResult> {
  const sql = getDb();

  // De kolom stock bestaat in het schema maar werd nooit gevuld.
  try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0`; } catch {}

  const rows = await sql`
    SELECT id, sku, in_stock
    FROM products
    WHERE sku IS NOT NULL AND sku <> ''
    ORDER BY updated_at ASC NULLS FIRST
    LIMIT ${limit}
  `;

  const result: SyncResult = {
    checked: (rows as any[]).length,
    matched: 0,
    updated: 0,
    unchanged: 0,
    notFound: 0,
    batchErrors: [],
    changes: [],
  };

  const bySku = new Map<string, { id: string; inStock: boolean }>();
  for (const p of rows as any[]) {
    bySku.set(String(p.sku), { id: p.id, inStock: !!p.in_stock });
  }

  const skus = Array.from(bySku.keys());
  const seen = new Set<string>();

  for (let i = 0; i < skus.length; i += SKU_BATCH_SIZE) {
    const batch = skus.slice(i, i + SKU_BATCH_SIZE);
    let msProducts: Record<string, any>;

    try {
      msProducts = await getProductsBySku(batch);
    } catch (error: any) {
      // Eén mislukte batch mag de rest niet tegenhouden.
      result.batchErrors.push(`${batch[0]}…: ${error.message}`);
      continue;
    }

    for (const msProduct of Object.values(msProducts || {})) {
      const sku = String((msProduct as any)?.sku || '');
      const local = bySku.get(sku);
      if (!local) continue;

      seen.add(sku);
      result.matched++;

      const { inStock, qty } = resolveStock(msProduct);

      if (inStock === local.inStock) {
        result.unchanged++;
        continue;
      }

      if (!dryRun) {
        await sql`
          UPDATE products
          SET in_stock = ${inStock}, stock = ${qty}, ms_last_sync = NOW(), updated_at = NOW()
          WHERE id = ${local.id}
        `;
      }

      result.updated++;
      if (result.changes.length < 50) {
        result.changes.push({ sku, from: local.inStock, to: inStock, qty });
      }
    }
  }

  result.notFound = skus.length - seen.size;
  return result;
}

function authorized(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return true; // geen secret ingesteld: zelfde gedrag als de order-cron
  const header = request.headers.get('authorization') || '';
  return header === `Bearer ${cronSecret}`;
}

// Door de Netlify scheduled function aangeroepen.
export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const limit = Math.min(5000, parseInt(new URL(request.url).searchParams.get('limit') || '2000'));
    const result = await syncStock(limit, false);
    return NextResponse.json({
      success: true,
      ...result,
      message: `${result.updated} van de ${result.matched} gevonden producten aangepast`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Handmatig draaien. POST { "dryRun": true } laat zien wat er zou veranderen.
export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { dryRun = false, limit = 2000 } = await request.json().catch(() => ({}));
    const result = await syncStock(Math.min(5000, limit), dryRun);
    return NextResponse.json({
      success: true,
      dryRun,
      ...result,
      message: dryRun
        ? `Dry run: ${result.updated} producten zouden worden aangepast`
        : `${result.updated} producten aangepast`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
