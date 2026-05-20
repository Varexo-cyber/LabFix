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

// Translate a single term: returns all equivalent terms (NL+EN) for that word
function translateTerm(term: string): string[] {
  const variants = new Set<string>([term]);
  if (NL_EN_KEYWORDS[term]) NL_EN_KEYWORDS[term].forEach(t => variants.add(t));
  if (EN_NL_KEYWORDS[term]) EN_NL_KEYWORDS[term].forEach(t => variants.add(t));
  return Array.from(variants);
}

// Score a product row against the original query terms (AND logic)
// Returns a number: lower = more relevant. Returns -1 if it doesn't match all required terms.
function scoreRow(name: string, nameEn: string, requiredTermGroups: string[][], originalWords: string[]): number {
  const combined = `${name} ${nameEn}`.toLowerCase();
  // Every term group must match at least one variant (AND across groups, OR within group)
  for (const group of requiredTermGroups) {
    const anyMatch = group.some(variant => combined.includes(variant));
    if (!anyMatch) return -1;
  }
  // Score: how many terms match in the NL name vs EN name
  const nlName = name.toLowerCase();
  const enName = nameEn.toLowerCase();
  let score = 0;
  for (const group of requiredTermGroups) {
    if (group.some(v => nlName.includes(v))) score += 2;
    else if (group.some(v => enName.includes(v))) score += 1;
  }
  let base = requiredTermGroups.length * 2 - score; // lower = better

  // Word-boundary penalty: penalise when a model-like term (e.g. "s22") is a substring
  // of a longer alphanumeric token in the product name (e.g. "s22ultra", "s22plus")
  for (const word of originalWords) {
    if (!/^[a-z0-9]+$/.test(word) || word.length < 2) continue;
    const exactBoundary = new RegExp(`(?<![a-z0-9])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`, 'i');
    if (combined.includes(word) && !exactBoundary.test(combined)) {
      base += 100; // Strong penalty for substring-only match
    }
  }
  return base;
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

    const originalTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

    // Build per-term variant groups: each term expands to NL+EN equivalents
    // e.g. "batterij" → ["batterij","battery"], "iphone" → ["iphone"], "17" → ["17"]
    const termGroups: string[][] = originalTerms.map(t => translateTerm(t));

    // Strategy: AND across all term groups, but each group allows OR of its variants.
    // We build a SQL WHERE clause: every group must appear in (name OR name_en).
    // Use PostgreSQL: for each group, require that (name ILIKE ANY(variants) OR name_en ILIKE ANY(variants))
    // We do this in application-side filtering on a broad candidate set for simplicity & safety.

    // Step 1: Get broad candidates — must match ALL original terms in name+name_en combined
    // We use a single full-text ILIKE with all variants flattened, then filter in JS.
    const allVariants = termGroups.flat();
    const allLikePatterns = allVariants.map(t => `%${t}%`);
    const likeOriginal = `%${query.toLowerCase()}%`;

    // Fetch candidates using AND logic at SQL level:
    // (name || ' ' || name_en) must contain every per-term pattern group.
    // Each term group is flattened to ILIKE ANY(variants), combined with AND via ILIKE ALL on combined col.
    // We build an array of "at least one variant per term" patterns for ILIKE ALL on the combined field.
    // Since ILIKE ALL checks that ALL patterns match, we pass one representative pattern per term group
    // (the original term), then do precise JS filtering for translated variants.
    const perTermPatterns = originalTerms.map(t => `%${t}%`);
    // Also add translated variants of the last term (likely the part type)
    const lastTermVariants = termGroups[termGroups.length - 1].map(v => `%${v}%`);

    // Use ILIKE ALL for original terms (fast index-friendly filter), then JS for translations
    let candidates: any[] = [];
    try {
      candidates = await sql`
        SELECT id, name, name_en, price, category, subcategory, model, sku, image, in_stock
        FROM products
        WHERE (LOWER(name) || ' ' || LOWER(name_en)) ILIKE ALL(${perTermPatterns})
        ORDER BY
          CASE
            WHEN name ILIKE ${likeOriginal} THEN 1
            WHEN name_en ILIKE ${likeOriginal} THEN 2
            ELSE 3
          END,
          sort_order ASC,
          created_at DESC
        LIMIT 500
      `;
    } catch {
      candidates = [];
    }

    // If strict AND on original terms gives nothing, try AND on all-but-last + translated last term
    if (candidates.length === 0 && termGroups.length > 1) {
      const withoutLast = perTermPatterns.slice(0, -1);
      try {
        const broader: any[] = await sql`
          SELECT id, name, name_en, price, category, subcategory, model, sku, image, in_stock
          FROM products
          WHERE (LOWER(name) || ' ' || LOWER(name_en)) ILIKE ALL(${withoutLast})
            AND ((LOWER(name) || ' ' || LOWER(name_en)) ILIKE ANY(${lastTermVariants}))
          ORDER BY sort_order ASC, created_at DESC
          LIMIT 500
        `;
        candidates = broader;
      } catch {
        candidates = [];
      }
    }

    // Last resort: any variant anywhere in name/name_en
    if (candidates.length === 0) {
      try {
        candidates = await sql`
          SELECT id, name, name_en, price, category, subcategory, model, sku, image, in_stock
          FROM products
          WHERE name ILIKE ANY(${allLikePatterns}) OR name_en ILIKE ANY(${allLikePatterns})
          ORDER BY sort_order ASC, created_at DESC
          LIMIT 200
        `;
      } catch {
        candidates = [];
      }
    }

    // Step 2: Filter candidates with strict AND logic (every term group must match)
    const scored = candidates
      .map((p: any) => ({ p, score: scoreRow(p.name || '', p.name_en || '', termGroups, originalTerms) }))
      .filter(({ score }) => score >= 0)
      .sort((a, b) => a.score - b.score)
      .slice(0, limit);

    // Step 3: If strict AND gives no results, fall back to best-effort (most term groups matched)
    let finalRows = scored.map(({ p }) => p);
    if (finalRows.length === 0 && candidates.length > 0) {
      // Partial match: count how many term groups match, sort descending
      const partial = candidates
        .map((p: any) => {
          const combined = `${p.name || ''} ${p.name_en || ''}`.toLowerCase();
          const matchCount = termGroups.filter(group => group.some(v => combined.includes(v))).length;
          return { p, matchCount };
        })
        .filter(({ matchCount }) => matchCount >= Math.max(1, termGroups.length - 1))
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, limit);
      finalRows = partial.map(({ p }) => p);
    }

    const results = finalRows.map((p: any) => ({
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

    return NextResponse.json({ results, expandedTerms: allVariants });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
