import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// NL → EN keyword translation map for smart search
const NL_EN_KEYWORDS: Record<string, string[]> = {
  'batterij': ['battery'],
  'accu': ['battery'],
  'scherm': ['screen', 'display', 'lcd', 'oled'],
  'beeldscherm': ['screen', 'display'],
  'display': ['display', 'screen'],
  'glas': ['glass', 'screen'],
  'achterkant': ['back cover', 'rear cover', 'back glass'],
  'achterglas': ['back glass', 'rear glass'],
  'achterdeksel': ['back cover', 'rear cover'],
  'deksel': ['cover', 'lid'],
  'lader': ['charger'],
  'oplader': ['charger'],
  'kabel': ['cable'],
  'oplaadkabel': ['charging cable'],
  'connector': ['connector', 'port'],
  'laadpoort': ['charging port', 'charge port'],
  'oplaadpoort': ['charging port'],
  'speaker': ['speaker', 'loudspeaker'],
  'luidspreker': ['speaker', 'loudspeaker'],
  'microfoon': ['microphone', 'mic'],
  'camera': ['camera'],
  'voorcamera': ['front camera', 'selfie camera', 'front cam'],
  'frontcamera': ['front camera'],
  'achtercamera': ['rear camera', 'back camera'],
  'hoofdcamera': ['main camera', 'rear camera'],
  'knop': ['button'],
  'aan/uit': ['power button', 'on/off'],
  'volume': ['volume'],
  'volumeknop': ['volume button'],
  'homeknop': ['home button'],
  'vingerafdruk': ['fingerprint'],
  'sensor': ['sensor'],
  'moederbord': ['motherboard'],
  'processor': ['cpu', 'processor'],
  'geheugen': ['memory', 'ram'],
  'opslag': ['storage', 'rom'],
  'ventilator': ['fan', 'cooling'],
  'koeling': ['cooling', 'fan'],
  'toetsenbord': ['keyboard'],
  'muis': ['mouse'],
  'scharnieren': ['hinge', 'hinges'],
  'scharnier': ['hinge'],
  'flexkabel': ['flex cable', 'ribbon cable'],
  'lint': ['ribbon cable', 'flex'],
  'hoesje': ['case', 'cover'],
  'beschermglas': ['tempered glass', 'screen protector'],
  'screenprotector': ['screen protector', 'tempered glass'],
  'reparatie': ['repair', 'replacement'],
  'vervang': ['replacement'],
  'onderdeel': ['part', 'component'],
  'accessoire': ['accessory', 'accessories'],
  'oortjes': ['earphones', 'earbuds', 'headphones'],
  'koptelefoon': ['headphones', 'headset'],
  'adapter': ['adapter', 'charger'],
  'opladen': ['charging', 'charge'],
  'draadloos': ['wireless'],
  'nieuw': ['new'],
  'origineel': ['original', 'oem'],
  'compleet': ['complete', 'assembly'],
  'assemblage': ['assembly'],
  'frame': ['frame', 'chassis'],
  'behuizing': ['housing', 'frame', 'chassis'],
};

// EN → NL keyword translation map
const EN_NL_KEYWORDS: Record<string, string[]> = {
  'battery': ['batterij', 'accu'],
  'screen': ['scherm', 'beeldscherm'],
  'display': ['display', 'scherm'],
  'lcd': ['scherm', 'lcd'],
  'oled': ['scherm', 'oled'],
  'glass': ['glas'],
  'back cover': ['achterdeksel', 'achterkant'],
  'charger': ['lader', 'oplader'],
  'cable': ['kabel'],
  'charging port': ['laadpoort', 'oplaadpoort'],
  'speaker': ['speaker', 'luidspreker'],
  'microphone': ['microfoon'],
  'camera': ['camera'],
  'button': ['knop'],
  'motherboard': ['moederbord'],
  'keyboard': ['toetsenbord'],
  'mouse': ['muis'],
  'case': ['hoesje'],
  'cover': ['hoesje', 'deksel'],
  'headphones': ['koptelefoon', 'oortjes'],
  'earphones': ['oortjes'],
  'assembly': ['assemblage', 'compleet'],
  'housing': ['behuizing'],
  'frame': ['frame', 'behuizing'],
};

function expandSearchTerms(query: string): string[] {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
  const expanded = new Set<string>(terms);

  for (const term of terms) {
    // NL → EN
    if (NL_EN_KEYWORDS[term]) {
      NL_EN_KEYWORDS[term].forEach(t => expanded.add(t));
    }
    // EN → NL
    if (EN_NL_KEYWORDS[term]) {
      EN_NL_KEYWORDS[term].forEach(t => expanded.add(t));
    }
    // Partial matches in dictionary keys
    for (const [key, values] of Object.entries(NL_EN_KEYWORDS)) {
      if (key.includes(term) || term.includes(key)) {
        values.forEach(t => expanded.add(t));
        expanded.add(key);
      }
    }
  }

  return Array.from(expanded);
}

export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const locale = searchParams.get('locale') || 'nl';
    const limit = Math.min(20, parseInt(searchParams.get('limit') || '12'));

    if (query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const allTerms = expandSearchTerms(query);
    const originalQuery = query.toLowerCase();

    // Build a LIKE condition for all expanded terms
    // Use OR across all terms for name, name_en, description, description_en, sku, category
    const conditions = allTerms.map(term => {
      const like = `%${term}%`;
      return like;
    });

    // We'll do multiple queries and merge, ordered by relevance
    // Priority: exact match in name > partial match in name > match in name_en > match in description
    const namePattern = `%${originalQuery}%`;

    // Query: search name (NL), name_en (EN), description, sku, category
    // Build a big OR condition dynamically using parameterized queries
    let rows: any[] = [];

    // Strategy: run search with ALL expanded terms against both name columns
    // We use a UNION to rank: exact name match first, then name_en, then description
    const likeOriginal = `%${originalQuery}%`;

    // Get rows matching original or any expanded term
    const allLikePatterns = allTerms.map(t => `%${t}%`);

    // We build the query with all patterns using SQL OR
    // Since we can't dynamically build SQL with variable number of params cleanly,
    // we combine all terms into a single regex-like approach using ILIKE ANY
    const termArray = allTerms;

    // Use PostgreSQL's ILIKE ANY(ARRAY[...]) for efficiency
    rows = await sql`
      SELECT id, name, name_en, price, category, subcategory, model, sku, image, in_stock
      FROM products
      WHERE 
        name ILIKE ANY(${termArray.map(t => `%${t}%`)})
        OR name_en ILIKE ANY(${termArray.map(t => `%${t}%`)})
        OR description ILIKE ANY(${termArray.map(t => `%${t}%`)})
        OR description_en ILIKE ANY(${termArray.map(t => `%${t}%`)})
        OR sku ILIKE ${likeOriginal}
      ORDER BY
        CASE
          WHEN name ILIKE ${likeOriginal} THEN 1
          WHEN name_en ILIKE ${likeOriginal} THEN 2
          WHEN name ILIKE ANY(${termArray.map(t => `%${t}%`)}) THEN 3
          WHEN name_en ILIKE ANY(${termArray.map(t => `%${t}%`)}) THEN 4
          ELSE 5
        END,
        sort_order ASC,
        created_at DESC
      LIMIT ${limit}
    `;

    const results = rows.map((p: any) => ({
      id: p.id,
      name: locale === 'nl' ? (p.name || p.name_en || '') : (p.name_en || p.name || ''),
      nameNl: p.name || '',
      nameEn: p.name_en || '',
      price: parseFloat(p.price),
      category: p.category,
      subcategory: p.subcategory || '',
      model: p.model || '',
      sku: p.sku,
      image: p.image || '',
      inStock: p.in_stock,
    }));

    return NextResponse.json({ results, expandedTerms: allTerms });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
