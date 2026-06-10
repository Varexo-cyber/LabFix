import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const sql = getDb();

    // Find all screen protector products (category = 'acc-screen-protectors')
    const rows = await sql`SELECT id, name, name_en, brand FROM products WHERE category = 'acc-screen-protectors'`;

    let appleCount = 0;
    let samsungCount = 0;
    let unchangedCount = 0;

    for (const row of rows) {
      const name = `${row.name} ${row.name_en}`.toLowerCase();
      let newBrand = row.brand;

      if (name.includes('iphone') || name.includes('apple') || name.includes('ipad')) {
        newBrand = 'apple';
        appleCount++;
      } else if (name.includes('samsung') || name.includes('galaxy')) {
        newBrand = 'samsung';
        samsungCount++;
      } else {
        unchangedCount++;
        continue;
      }

      if (newBrand !== row.brand) {
        await sql`UPDATE products SET brand = ${newBrand} WHERE id = ${row.id}`;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration complete. Apple: ${appleCount}, Samsung: ${samsungCount}, Unchanged: ${unchangedCount}, Total: ${rows.length}`,
      appleCount,
      samsungCount,
      unchangedCount,
      total: rows.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
