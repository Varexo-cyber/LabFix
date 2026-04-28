import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const sql = getDb();

    // Add missing columns for MobileSentrix import
    const migrations = [
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS brand TEXT DEFAULT ''`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft'`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS ms_sku TEXT DEFAULT ''`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS ms_source TEXT DEFAULT ''`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS ms_entity_id TEXT DEFAULT ''`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS ms_last_sync TEXT DEFAULT ''`,
      `ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()`,
    ];

    const results = [];
    for (const migration of migrations) {
      try {
        await sql.unsafe(migration);
        results.push({ sql: migration, status: 'ok' });
      } catch (error: any) {
        results.push({ sql: migration, status: 'error', error: error.message });
      }
    }

    // Update existing products that have null status
    await sql`UPDATE products SET status = 'active' WHERE status IS NULL OR status = ''`;
    await sql`UPDATE products SET stock = 0 WHERE stock IS NULL`;
    await sql`UPDATE products SET brand = '' WHERE brand IS NULL`;

    return NextResponse.json({ 
      success: true, 
      message: 'Migratie voltooid!',
      results 
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
