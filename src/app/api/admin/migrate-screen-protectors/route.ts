import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Auto-detect Apple/Samsung brand from product name for screen protectors
function detectBrand(name: string): string | null {
  const n = name.toLowerCase();
  if (n.includes('iphone') || n.includes('ipad') || n.includes('apple')) return 'apple';
  if (n.includes('samsung') || n.includes('galaxy')) return 'samsung';
  return null;
}

// Extract model slug from product name using known model patterns
function detectModel(name: string, brand: string): string | null {
  const n = name.toLowerCase();
  if (brand === 'apple') {
    // iPhone models
    const patterns = [
      { match: /iphone\s*17\s*pro\s*max/, slug: 'iphone-17-pro-max' },
      { match: /iphone\s*17\s*pro/, slug: 'iphone-17-pro' },
      { match: /iphone\s*17\s*e/, slug: 'iphone-17e' },
      { match: /iphone\s*17/, slug: 'iphone-17' },
      { match: /iphone\s*16\s*pro\s*max/, slug: 'iphone-16-pro-max' },
      { match: /iphone\s*16\s*pro/, slug: 'iphone-16-pro' },
      { match: /iphone\s*16\s*plus/, slug: 'iphone-16-plus' },
      { match: /iphone\s*16\s*e/, slug: 'iphone-16e' },
      { match: /iphone\s*16/, slug: 'iphone-16' },
      { match: /iphone\s*15\s*pro\s*max/, slug: 'iphone-15-pro-max' },
      { match: /iphone\s*15\s*pro/, slug: 'iphone-15-pro' },
      { match: /iphone\s*15\s*plus/, slug: 'iphone-15-plus' },
      { match: /iphone\s*15/, slug: 'iphone-15' },
      { match: /iphone\s*14\s*pro\s*max/, slug: 'iphone-14-pro-max' },
      { match: /iphone\s*14\s*pro/, slug: 'iphone-14-pro' },
      { match: /iphone\s*14\s*plus/, slug: 'iphone-14-plus' },
      { match: /iphone\s*14/, slug: 'iphone-14' },
      { match: /iphone\s*13\s*pro\s*max/, slug: 'iphone-13-pro-max' },
      { match: /iphone\s*13\s*pro/, slug: 'iphone-13-pro' },
      { match: /iphone\s*13\s*mini/, slug: 'iphone-13-mini' },
      { match: /iphone\s*13/, slug: 'iphone-13' },
      { match: /iphone\s*12\s*pro\s*max/, slug: 'iphone-12-pro-max' },
      { match: /iphone\s*12\s*pro/, slug: 'iphone-12-pro' },
      { match: /iphone\s*12\s*mini/, slug: 'iphone-12-mini' },
      { match: /iphone\s*12/, slug: 'iphone-12' },
      { match: /iphone\s*11\s*pro\s*max/, slug: 'iphone-11-pro-max' },
      { match: /iphone\s*11\s*pro/, slug: 'iphone-11-pro' },
      { match: /iphone\s*11/, slug: 'iphone-11' },
      { match: /iphone\s*xs\s*max/, slug: 'iphone-xs-max' },
      { match: /iphone\s*xs/, slug: 'iphone-xs' },
      { match: /iphone\s*xr/, slug: 'iphone-xr' },
      { match: /iphone\s*x/, slug: 'iphone-x' },
      { match: /iphone\s*se\s*2022/, slug: 'iphone-se-2022' },
      { match: /iphone\s*se\s*2020/, slug: 'iphone-se-2020' },
      { match: /iphone\s*se\s*2016/, slug: 'iphone-se-2016' },
      { match: /iphone\s*8\s*plus/, slug: 'iphone-8-plus' },
      { match: /iphone\s*8/, slug: 'iphone-8' },
      { match: /iphone\s*7\s*plus/, slug: 'iphone-7-plus' },
      { match: /iphone\s*7/, slug: 'iphone-7' },
      { match: /iphone\s*6s\s*plus/, slug: 'iphone-6s-plus' },
      { match: /iphone\s*6s/, slug: 'iphone-6s' },
      { match: /iphone\s*6\s*plus/, slug: 'iphone-6-plus' },
      { match: /iphone\s*6/, slug: 'iphone-6' },
    ];
    for (const p of patterns) {
      if (p.match.test(n)) return p.slug;
    }
  }
  if (brand === 'samsung') {
    const patterns = [
      { match: /galaxy\s*s26\s*ultra/, slug: 'galaxy-s26-ultra' },
      { match: /galaxy\s*s26\s*plus/, slug: 'galaxy-s26-plus' },
      { match: /galaxy\s*s26/, slug: 'galaxy-s26' },
      { match: /galaxy\s*s25\s*ultra/, slug: 'galaxy-s25-ultra' },
      { match: /galaxy\s*s25\s*plus/, slug: 'galaxy-s25-plus' },
      { match: /galaxy\s*s25/, slug: 'galaxy-s25' },
      { match: /galaxy\s*s24\s*ultra/, slug: 'galaxy-s24-ultra' },
      { match: /galaxy\s*s24\s*plus/, slug: 'galaxy-s24-plus' },
      { match: /galaxy\s*s24\s*fe/, slug: 'galaxy-s24-fe' },
      { match: /galaxy\s*s24/, slug: 'galaxy-s24' },
      { match: /galaxy\s*s23\s*ultra/, slug: 'galaxy-s23-ultra' },
      { match: /galaxy\s*s23\s*plus/, slug: 'galaxy-s23-plus' },
      { match: /galaxy\s*s23\s*fe/, slug: 'galaxy-s23-fe' },
      { match: /galaxy\s*s23/, slug: 'galaxy-s23' },
      { match: /galaxy\s*s22\s*ultra/, slug: 'galaxy-s22-ultra' },
      { match: /galaxy\s*s22\s*plus/, slug: 'galaxy-s22-plus' },
      { match: /galaxy\s*s22/, slug: 'galaxy-s22' },
      { match: /galaxy\s*s21\s*ultra/, slug: 'galaxy-s21-ultra' },
      { match: /galaxy\s*s21\s*plus/, slug: 'galaxy-s21-plus' },
      { match: /galaxy\s*s21\s*fe/, slug: 'galaxy-s21-fe' },
      { match: /galaxy\s*s21/, slug: 'galaxy-s21' },
      { match: /galaxy\s*s20\s*ultra/, slug: 'galaxy-s20-ultra' },
      { match: /galaxy\s*s20\s*plus/, slug: 'galaxy-s20-plus' },
      { match: /galaxy\s*s20\s*fe/, slug: 'galaxy-s20-fe' },
      { match: /galaxy\s*s20/, slug: 'galaxy-s20' },
      { match: /galaxy\s*s10\s*plus/, slug: 'galaxy-s10-plus' },
      { match: /galaxy\s*s10e/, slug: 'galaxy-s10e' },
      { match: /galaxy\s*s10/, slug: 'galaxy-s10' },
      { match: /galaxy\s*s9\s*plus/, slug: 'galaxy-s9-plus' },
      { match: /galaxy\s*s9/, slug: 'galaxy-s9' },
      { match: /galaxy\s*s8\s*plus/, slug: 'galaxy-s8-plus' },
      { match: /galaxy\s*s8/, slug: 'galaxy-s8' },
      { match: /galaxy\s*s7\s*edge/, slug: 'galaxy-s7-edge' },
      { match: /galaxy\s*s7/, slug: 'galaxy-s7' },
      { match: /galaxy\s*s6\s*edge\s*plus/, slug: 'galaxy-s6-edge-plus' },
      { match: /galaxy\s*s6\s*edge/, slug: 'galaxy-s6-edge' },
      { match: /galaxy\s*s6/, slug: 'galaxy-s6' },
      { match: /galaxy\s*s5/, slug: 'galaxy-s5' },
      { match: /galaxy\s*z\s*fold\s*7/, slug: 'galaxy-z-fold-7' },
      { match: /galaxy\s*z\s*fold\s*6/, slug: 'galaxy-z-fold-6' },
      { match: /galaxy\s*z\s*fold\s*5/, slug: 'galaxy-z-fold-5' },
      { match: /galaxy\s*z\s*fold\s*4/, slug: 'galaxy-z-fold-4' },
      { match: /galaxy\s*z\s*fold\s*3/, slug: 'galaxy-z-fold-3' },
      { match: /galaxy\s*z\s*flip\s*7/, slug: 'galaxy-z-flip-7' },
      { match: /galaxy\s*z\s*flip\s*6/, slug: 'galaxy-z-flip-6' },
      { match: /galaxy\s*z\s*flip\s*5/, slug: 'galaxy-z-flip-5' },
      { match: /galaxy\s*z\s*flip\s*4/, slug: 'galaxy-z-flip-4' },
      { match: /galaxy\s*z\s*flip\s*3/, slug: 'galaxy-z-flip-3' },
      { match: /galaxy\s*a98/, slug: 'galaxy-a98' },
      { match: /galaxy\s*a96/, slug: 'galaxy-a96' },
      { match: /galaxy\s*a95/, slug: 'galaxy-a95' },
      { match: /galaxy\s*a73/, slug: 'galaxy-a73' },
      { match: /galaxy\s*a72/, slug: 'galaxy-a72' },
      { match: /galaxy\s*a71/, slug: 'galaxy-a71' },
      { match: /galaxy\s*a70/, slug: 'galaxy-a70' },
      { match: /galaxy\s*a56/, slug: 'galaxy-a56' },
      { match: /galaxy\s*a55/, slug: 'galaxy-a55' },
      { match: /galaxy\s*a54/, slug: 'galaxy-a54' },
      { match: /galaxy\s*a53/, slug: 'galaxy-a53' },
      { match: /galaxy\s*a52s/, slug: 'galaxy-a52s' },
      { match: /galaxy\s*a52/, slug: 'galaxy-a52' },
      { match: /galaxy\s*a51/, slug: 'galaxy-a51' },
      { match: /galaxy\s*a50s/, slug: 'galaxy-a50s' },
      { match: /galaxy\s*a50/, slug: 'galaxy-a50' },
      { match: /galaxy\s*a42/, slug: 'galaxy-a42' },
      { match: /galaxy\s*a41/, slug: 'galaxy-a41' },
      { match: /galaxy\s*a40/, slug: 'galaxy-a40' },
      { match: /galaxy\s*a36/, slug: 'galaxy-a36' },
      { match: /galaxy\s*a35/, slug: 'galaxy-a35' },
      { match: /galaxy\s*a34/, slug: 'galaxy-a34' },
      { match: /galaxy\s*a33/, slug: 'galaxy-a33' },
      { match: /galaxy\s*a32/, slug: 'galaxy-a32' },
      { match: /galaxy\s*a31/, slug: 'galaxy-a31' },
      { match: /galaxy\s*a30s/, slug: 'galaxy-a30s' },
      { match: /galaxy\s*a30/, slug: 'galaxy-a30' },
      { match: /galaxy\s*a26/, slug: 'galaxy-a26' },
      { match: /galaxy\s*a25/, slug: 'galaxy-a25' },
      { match: /galaxy\s*a24/, slug: 'galaxy-a24' },
      { match: /galaxy\s*a23/, slug: 'galaxy-a23' },
      { match: /galaxy\s*a22/, slug: 'galaxy-a22' },
      { match: /galaxy\s*a21s/, slug: 'galaxy-a21s' },
      { match: /galaxy\s*a21/, slug: 'galaxy-a21' },
      { match: /galaxy\s*a20s/, slug: 'galaxy-a20s' },
      { match: /galaxy\s*a20e/, slug: 'galaxy-a20e' },
      { match: /galaxy\s*a20/, slug: 'galaxy-a20' },
      { match: /galaxy\s*a16/, slug: 'galaxy-a16' },
      { match: /galaxy\s*a15/, slug: 'galaxy-a15' },
      { match: /galaxy\s*a14/, slug: 'galaxy-a14' },
      { match: /galaxy\s*a13/, slug: 'galaxy-a13' },
      { match: /galaxy\s*a12/, slug: 'galaxy-a12' },
      { match: /galaxy\s*a11/, slug: 'galaxy-a11' },
      { match: /galaxy\s*a10s/, slug: 'galaxy-a10s' },
      { match: /galaxy\s*a10e/, slug: 'galaxy-a10e' },
      { match: /galaxy\s*a10/, slug: 'galaxy-a10' },
      { match: /galaxy\s*a09/, slug: 'galaxy-a09' },
      { match: /galaxy\s*a08s/, slug: 'galaxy-a08s' },
      { match: /galaxy\s*a08/, slug: 'galaxy-a08' },
      { match: /galaxy\s*a06/, slug: 'galaxy-a06' },
      { match: /galaxy\s*a05s/, slug: 'galaxy-a05s' },
      { match: /galaxy\s*a05/, slug: 'galaxy-a05' },
      { match: /galaxy\s*a04s/, slug: 'galaxy-a04s' },
      { match: /galaxy\s*a04/, slug: 'galaxy-a04' },
      { match: /galaxy\s*a03s/, slug: 'galaxy-a03s' },
      { match: /galaxy\s*a03/, slug: 'galaxy-a03' },
      { match: /galaxy\s*a02s/, slug: 'galaxy-a02s' },
      { match: /galaxy\s*a02/, slug: 'galaxy-a02' },
      { match: /galaxy\s*a01/, slug: 'galaxy-a01' },
    ];
    for (const p of patterns) {
      if (p.match.test(n)) return p.slug;
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    
    // Find all screen protector products (category starts with acc-screen-protectors or subcategory is a screen protector type)
    const rows = await sql`
      SELECT id, name, category, subcategory, brand, model 
      FROM products 
      WHERE category LIKE 'acc-screen-protectors%' 
         OR subcategory IN ('tempered-glass', 'privacy-glass', 'magic-glass', 'matte-glass', 'uv-glass', 'tpu-film', 'ceramic-shield')
    `;
    
    let updated = 0;
    const details: { id: string; name: string; oldBrand: string; newBrand: string; newModel: string | null }[] = [];
    
    for (const row of rows) {
      const detectedBrand = detectBrand(row.name);
      if (!detectedBrand) continue;
      if (row.brand === detectedBrand) continue;
      
      const detectedModel = detectModel(row.name, detectedBrand);
      
      await sql`
        UPDATE products 
        SET brand = ${detectedBrand}, 
            model = ${detectedModel || row.model || ''},
            updated_at = NOW()
        WHERE id = ${row.id}
      `;
      
      updated++;
      details.push({
        id: row.id,
        name: row.name,
        oldBrand: row.brand || '(leeg)',
        newBrand: detectedBrand,
        newModel: detectedModel || '(geen model)',
      });
    }
    
    return NextResponse.json({
      success: true,
      total: rows.length,
      updated,
      details: details.slice(0, 50), // limit details in response
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
