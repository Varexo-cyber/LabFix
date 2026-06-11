import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// ── Knowledge base ──────────────────────────────────────────────
const KNOWLEDGE = {
  company: {
    name: 'LabFix',
    kvk: '42035906',
    btw: 'NL005445900B06',
    bank: 'NL36INGB0115171061',
    phone: '+31 6 5113 1133',
    email: 'info@labfix.nl',
    address: 'Den Haag, Nederland',
    description: 'LabFix is een Nederlandse B2B groothandel gespecialiseerd in reparatieonderdelen voor smartphones, tablets en laptops.',
  },
  services: {
    repair: {
      pickup: 'Wij komen uw apparaat ophalen voor reparatie. Vul het reparatieformulier in op /repair en kies "Ophalen". We nemen binnen 24 uur contact op.',
      shipping: 'U kunt uw apparaat naar ons opsturen voor reparatie. Vul het reparatieformulier in op /repair en kies "Opsturen". We sturen u een offerte met verzendadres.',
      warranty: '3 maanden garantie op alle reparaties.',
    },
    orders: {
      track: 'Volg uw bestelling via "Mijn Account" > "Bestellingen" of neem contact op met info@labfix.nl met uw bestelnummer.',
      payment: 'We accepteren iDEAL en Klarna. Voor zakelijke klanten na registratie met KVK-nummer.',
      shipping_cost: 'NL verzending €6,95 (gratis boven €150), EU €18,95. Levertijd 1-3 werkdagen.',
      return: '30 dagen retourbeleid voor ongebruikte producten in originele verpakking. Mail info@labfix.nl met bestelnummer.',
    },
    contact: {
      email: 'info@labfix.nl',
      whatsapp: '+31 6 5113 1133',
      phone: '+31 6 5113 1133',
      hours: 'Maandag - Vrijdag: 09:00 - 18:00. Weekend: gesloten.',
    },
  },
  pages: {
    '/products': 'Product catalogus met filters voor merk, model en onderdeel.',
    '/repair': 'Reparatie aanvraag formulier - ophalen of opsturen.',
    '/contact': 'Contactformulier en contactgegevens.',
    '/cart': 'Winkelwagen - bekijk en bewerk je bestelling.',
    '/checkout': 'Afrekenen - betaalmethoden en verzendgegevens.',
    '/faq': 'Veelgestelde vragen over producten, verzending en betaling.',
    '/nieuws': 'Laatste nieuws en updates van LabFix.',
    '/garantie': 'Garantievoorwaarden - 3 maanden op reparaties.',
    '/algemene-voorwaarden': 'Algemene voorwaarden van LabFix.',
    '/privacy-policy': 'Privacybeleid en cookieverklaring.',
  },
};

// ── Score-based intent detection ────────────────────────────────
function detectIntent(msg: string): string {
  const q = msg.toLowerCase();

  const intents: { key: string; patterns: RegExp[]; weight: number }[] = [
    {
      key: 'shipping',
      patterns: [
        /\bverzend|verzenden|verzendkosten|bezorg|bezorgen|lever|leveren|levertijd|shipping|delivery\b/,
        /\bhoe\s+(lang|snel|laat)\s+(komt|is|duurt)\b/,
        /\bwaneer\s+(komt|is|wordt)\b/,
        /\btrack\s*(?:en|and)?\s*trace|track\s*trace\b/,
      ],
      weight: 1,
    },
    {
      key: 'order_status',
      patterns: [
        /\b(bestelling|order)\s+(status|volgen|track|check|bekijken|waar)\b/,
        /\bwaar\s+(is|blijft)\s+mijn\s+(bestelling|order)\b/,
        /\bmijn\s+(bestelling|order)\b/,
        /\bvolg\s+(mijn|een)\s+(bestelling|order)\b/,
      ],
      weight: 1,
    },
    {
      key: 'repair',
      patterns: [
        /\breparatie|repair|kapot|stuk|defect|fix|herstellen|maken|gerepareerd\b/,
        /\bophalen|opsturen\s+(voor\s+)?reparatie\b/,
      ],
      weight: 1,
    },
    {
      key: 'returns',
      patterns: [
        /\bretour|return|terug|ruilen|terugsturen|refund|omruilen\b/,
      ],
      weight: 1,
    },
    {
      key: 'warranty',
      patterns: [
        /\bgarantie|warranty|garantieperiode|garantietermijn\b/,
      ],
      weight: 1,
    },
    {
      key: 'pricing',
      patterns: [
        /\bprijs|price|kosten|kost|hoeveel\s+kost|hoe\s+duur|betaal|betalen|ideal|klarna|payment|staffel|korting\b/,
      ],
      weight: 1,
    },
    {
      key: 'account',
      patterns: [
        /\baccount|registreren|inloggen|login|kvk|zakelijk|business|zakelijk\b/,
      ],
      weight: 1,
    },
    {
      key: 'contact',
      patterns: [
        /\bcontact|email|telefoon|bellen|whatsapp|bereiken|waar\s+(zijn|is)\s+jullie|locatie|adres\b/,
        /\b(hoe\s+kan\s+ik\s+jullie|waar\s+kan\s+ik)\s+(bereiken|vinden)\b/,
      ],
      weight: 1,
    },
    {
      key: 'about',
      patterns: [
        /\bwie\s+(zijn|is)\s+(jullie|labfix)|wat\s+is\s+labfix|over\s+labfix|bedrijf|company|about\b/,
      ],
      weight: 1,
    },
    {
      key: 'availability',
      patterns: [
        /\bop\s+voorraad|stock|beschikbaar|wanneer\s+weer|uitverkocht|voorraad\b/,
      ],
      weight: 1,
    },
    {
      key: 'greeting',
      patterns: [
        /\b(hallo|hoi|hey|goedemorgen|goedemiddag|goedenavond|hi|hello)\b/,
      ],
      weight: 0.5,
    },
    {
      key: 'screen_protector',
      patterns: [
        /\bscreenprotector|screen\s*protector|screenprotectors\b/i,
        /\bbeschermglas|bescherm\s*glas|tempered\s*glass|gehard\s*glas\b/i,
        /\bprivacy\s*glass|privacyglass|magic\s*glass|magicglass\b/i,
        /\bscreen\s*protectie|display\s*bescherming|folie\b/i,
      ],
      weight: 2,
    },
    {
      key: 'product_search',
      patterns: [
        /\bzoek|zoeken|heb\s+nodig|wil\s+(een|het|de)\b/,
        /\b(scherm|screen|display|lcd|oled|glas|glass|touch)\b/,
        /\b(batterij|battery|accu)\b/,
        /\b(camera|lens|frontcam|backcam)\b/,
        /\b(charger|lader|oplader|charging\s+port)\b/,
        /\b(frame|back\s*cover|achterkant|housing|behuizing)\b/,
        /\b(iphone|ipad|samsung\s+galaxy|macbook|pixel|xiaomi)\b/,
        /\bonderdeel|part|component|accessoire\b/,
        /\b(i\s*phone|s\s*galaxy)\b/,
      ],
      weight: 1,
    },
  ];

  let bestIntent = 'unknown';
  let bestScore = 0;

  for (const { key, patterns, weight } of intents) {
    let score = 0;
    for (const p of patterns) {
      if (p.test(q)) score += weight;
      // Multiple matches = stronger signal
      const matches = q.match(p);
      if (matches && matches.length > 1) score += 0.3;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIntent = key;
    }
  }

  return bestIntent;
}

// ── Extract brand ───────────────────────────────────────────────
function extractBrand(msg: string): string | null {
  const brands: Record<string, RegExp> = {
    'apple': /\b(iphone|ipad|apple|macbook|airpod|ios)\b/i,
    'samsung': /\b(samsung|galaxy)\b/i,
    'huawei': /\bhuawei\b/i,
    'xiaomi': /\b(xiaomi|redmi|poco|mi\s)\b/i,
    'google': /\b(google|pixel)\b/i,
    'motorola': /\b(motorola|moto)\b/i,
    'oneplus': /\boneplus\b/i,
    'oppo': /\boppo\b/i,
    'sony': /\b(xperia|sony)\b/i,
    'nokia': /\bnokia\b/i,
    'lg': /\blg\b/i,
    'dell': /\bdell\b/i,
    'hp': /\bhp\b/i,
    'lenovo': /\blenovo\b/i,
    'asus': /\basus\b/i,
    'acer': /\bacer\b/i,
    'msi': /\bmsi\b/i,
    'microsoft': /\b(surface|microsoft)\b/i,
  };
  for (const [slug, pattern] of Object.entries(brands)) {
    if (pattern.test(msg)) return slug;
  }
  return null;
}

// ── Extract product type ────────────────────────────────────────
function extractProductType(msg: string): string | null {
  const types: Record<string, RegExp> = {
    'screen': /\b(scherm|screen|display|lcd|oled|glas|glass|touch)\b/i,
    'screen_protector': /\b(screenprotector|screen\s*protector|tempered\s*glass|gehard\s*glas|beschermglas|folie|privacy\s*glass|magic\s*glass|display\s*bescherming)\b/i,
    'battery': /\b(batterij|battery|accu)\b/i,
    'camera': /\b(camera|lens|frontcam|backcam)\b/i,
    'charging': /\b(charging|laad|oplader|charger|port|connector|usb)\b/i,
    'back_cover': /\b(back\s*cover|achterkant|housing|behuizing|frame)\b/i,
    'buttons': /\b(button|knop|volume|power|home)\b/i,
    'speaker': /\b(speaker|luidspreker|earpiece)\b/i,
    'microphone': /\b(microphone|mic)\b/i,
    'keyboard': /\b(keyboard|toetsenbord)\b/i,
    'ram': /\b(ram|geheugen|memory)\b/i,
    'storage': /\b(ssd|hdd|opslag|storage)\b/i,
    'motherboard': /\b(motherboard|moederbord|logic\s*board)\b/i,
  };
  for (const [slug, pattern] of Object.entries(types)) {
    if (pattern.test(msg)) return slug;
  }
  return null;
}

// ── Extract model keywords ──────────────────────────────────────
function extractModelKeywords(msg: string): string[] {
  // Extract potential model numbers like "A73", "iPhone 15", "15 Pro Max", "Galaxy S24"
  const keywords: string[] = [];
  const patterns = [
    /\biphone\s*(\d+\s*(pro\s*max|pro|plus|max|mini)?)\b/gi,
    /\b(galaxy\s*s?\s*(\d+\s*(fe|plus|ultra)?))\b/gi,
    /\b(a\s*(\d+)\s*(5g)?)\b/gi,  // Samsung A73 5G
    /\bipad\s*(\w+)\b/gi,
    /\bmacbook\s*(\w+)\b/gi,
    /\binspiron\s*(\d+\s*(\d+)?)\b/gi,
    /\bxps\s*(\d+)\b/gi,
    /\bthinkpad\s*(\w+)\b/gi,
    /\b(macbook\s*air|macbook\s*pro)\b/gi,
  ];
  for (const pattern of patterns) {
    const matches = msg.match(pattern);
    if (matches) keywords.push(...matches.map(m => m.toLowerCase().replace(/\s+/g, '-')));
  }
  // Also extract standalone numbers that might be model identifiers
  const numMatches = msg.match(/\b\d{1,2}\s*(pro\s*max|pro|plus|max|ultra|fe|5g)\b/gi);
  if (numMatches) keywords.push(...numMatches.map(m => m.toLowerCase().replace(/\s+/g, '-')));
  return Array.from(new Set(keywords));
}

// ── Extract screen protector subtype ────────────────────────────
function extractScreenProtectorSubtype(msg: string): string | null {
  const q = msg.toLowerCase();
  if (/\bgehard\s*glas|tempered\s*glass\b/i.test(q)) return 'gehard-glas';
  if (/\bprivacy\s*glass|privacyglass\b/i.test(q)) return 'privacy-glass';
  if (/\bmagic\s*glass|magicglass\b/i.test(q)) return 'magic-glass';
  return null;
}

// ── Extract screen protector brand (Apple/Samsung) ──────────────
function extractSpBrand(msg: string): string | null {
  const q = msg.toLowerCase();
  if (/\biphone|ipad|apple\b/i.test(q)) return 'apple';
  if (/\bsamsung|galaxy\b/i.test(q)) return 'samsung';
  return null;
}

// ═══════════════════════════════════════════════════════════════
// ══ BILINGUAL KEYWORD MAPPING (NL ↔ EN) ════════════════════════
// ═══════════════════════════════════════════════════════════════

// Maps Dutch terms to English equivalents for cross-language search
const BILINGUAL_MAP: Record<string, string[]> = {
  'batterij': ['battery', 'batteries'],
  'battery': ['batterij', 'accu'],
  'accu': ['battery', 'batteries'],
  'scherm': ['screen', 'display', 'lcd', 'oled'],
  'screen': ['scherm', 'display', 'lcd', 'oled'],
  'display': ['scherm', 'screen'],
  'glas': ['glass', 'screen', 'display'],
  'glass': ['glas', 'screen'],
  'camera': ['camera', 'lens'],
  'oplader': ['charger', 'charging', 'adapter'],
  'charger': ['oplader', 'lader'],
  'lader': ['charger', 'charging'],
  'charging': ['laden', 'oplader'],
  'laad': ['charge', 'charging'],
  'port': ['poort', 'connector'],
  'connector': ['connector', 'aansluiting'],
  'back cover': ['achterkant', 'achterdeksel', 'housing'],
  'achterkant': ['back cover', 'housing'],
  'housing': ['behuizing', 'achterkant'],
  'frame': ['frame', 'behuizing'],
  'buttons': ['knoppen', 'toetsen', 'button'],
  'speaker': ['luidspreker', 'speaker'],
  'luidspreker': ['speaker'],
  'microphone': ['microfoon', 'mic'],
  'microfoon': ['microphone', 'mic'],
  'toetsenbord': ['keyboard'],
  'keyboard': ['toetsenbord'],
  'geheugen': ['ram', 'memory'],
  'ram': ['geheugen', 'memory'],
  'opslag': ['storage', 'ssd', 'hdd'],
  'storage': ['opslag'],
  'motherboard': ['moederbord'],
  'moederbord': ['motherboard'],
  'touch': ['touch', 'digitizer'],
  'folie': ['screen protector', 'protector'],
  'beschermglas': ['screen protector', 'tempered glass'],
  'screenprotector': ['screen protector', 'beschermglas'],
  'screen protector': ['screenprotector', 'beschermglas'],
  'lcd': ['lcd', 'scherm', 'display'],
  'oled': ['oled', 'scherm', 'display'],
  'flex': ['flex', 'cable', 'kabel'],
  'kabel': ['cable', 'flex'],
  'cable': ['kabel', 'flex'],
  'earpiece': ['earpiece', 'hoorspeaker'],
  'hoorspeaker': ['earpiece'],
  'vibration': ['vibrator', 'tril'],
  'vibrator': ['vibration', 'tril'],
  'sim': ['sim', 'simkaart'],
  'simkaart': ['sim', 'sim tray'],
  'antenne': ['antenna'],
  'antenna': ['antenne'],
  'sensor': ['sensor'],
  'nfc': ['nfc'],
  'wifi': ['wifi', 'wlan', 'wireless'],
  'bluetooth': ['bluetooth'],
  'waterproof': ['waterproof', 'waterdicht'],
  'waterdicht': ['waterproof'],
};

// Expand a keyword with its bilingual equivalents
function expandBilingual(terms: string[]): string[] {
  const expanded = new Set<string>();
  for (const term of terms) {
    const key = term.toLowerCase().trim();
    expanded.add(key);
    if (BILINGUAL_MAP[key]) {
      for (const equiv of BILINGUAL_MAP[key]) expanded.add(equiv);
    }
  }
  return Array.from(expanded);
}

// ═══════════════════════════════════════════════════════════════
// ══ SMART ENTITY EXTRACTION ════════════════════════════════════
// ═══════════════════════════════════════════════════════════════

interface ExtractedEntities {
  brand: string | null;
  productType: string | null;
  model: string | null;
  modelKeywords: string[];
  allKeywords: string[];
  isLaptop: boolean;
  isPhone: boolean;
}

function extractEntities(msg: string): ExtractedEntities {
  const q = msg.toLowerCase();
  const brand = extractBrand(msg);
  const productType = extractProductType(msg);
  const modelKeywords = extractModelKeywords(msg);

  // Detect laptop-specific queries
  const isLaptop = /\b(laptop|notebook|dell|hp\s|lenovo|asus|acer|msi|macbook|thinkpad|inspiron|xps|latitude|vostro|g15|g16|alienware|surface)\b/i.test(msg);
  const isPhone = /\b(iphone|samsung|galaxy|xiaomi|redmi|pixel|huawei|oneplus|oppo|motorola|sony|nokia|lg)\b/i.test(msg);

  // Extract specific model (e.g., "iPhone 14", "Galaxy S24")
  let model: string | null = null;
  if (modelKeywords.length > 0) {
    model = modelKeywords[0];
  }

  // Build comprehensive keyword list
  const allKeywords: string[] = [];
  if (brand) allKeywords.push(brand);
  if (productType) allKeywords.push(productType);
  if (model) allKeywords.push(...modelKeywords);

  // Extract bare numbers that might be models
  const bareNumbers = q.match(/\b\d{1,2}\b/g);
  if (bareNumbers) {
    for (const num of bareNumbers) {
      if (!allKeywords.some(k => k.includes(num))) {
        allKeywords.push(num);
      }
    }
  }

  return { brand, productType, model, modelKeywords, allKeywords, isLaptop, isPhone };
}

// ═══════════════════════════════════════════════════════════════
// ══ CHAT HISTORY & LEARNING ════════════════════════════════════
// ═══════════════════════════════════════════════════════════════

async function saveChat(sql: any, data: {
  sessionId: string;
  message: string;
  intent: string;
  brand: string;
  productType: string;
  model: string;
  keywords: string[];
  productsFound: number;
  responseText: string;
}) {
  try {
    await sql`
      INSERT INTO assistant_chats (session_id, message, intent, brand, product_type, model, keywords, products_found, response_text)
      VALUES (${data.sessionId}, ${data.message}, ${data.intent}, ${data.brand}, ${data.productType}, ${data.model}, ${data.keywords}, ${data.productsFound}, ${data.responseText})
    `;
  } catch (e) {
    console.error('Failed to save chat:', e);
  }
}

async function getPopularQueries(sql: any, brand?: string, productType?: string): Promise<string[]> {
  try {
    let rows;
    if (brand && productType) {
      rows = await sql`
        SELECT message, COUNT(*) as cnt
        FROM assistant_chats
        WHERE brand = ${brand} AND product_type = ${productType} AND products_found > 0
        GROUP BY message
        ORDER BY cnt DESC
        LIMIT 5
      `;
    } else if (brand) {
      rows = await sql`
        SELECT message, COUNT(*) as cnt
        FROM assistant_chats
        WHERE brand = ${brand} AND products_found > 0
        GROUP BY message
        ORDER BY cnt DESC
        LIMIT 5
      `;
    } else {
      rows = await sql`
        SELECT message, COUNT(*) as cnt
        FROM assistant_chats
        WHERE products_found > 0
        GROUP BY message
        ORDER BY cnt DESC
        LIMIT 5
      `;
    }
    return rows.map((r: any) => r.message);
  } catch (e) {
    return [];
  }
}

async function getSimilarSuccessfulQueries(sql: any, keywords: string[]): Promise<string[]> {
  try {
    const rows = await sql`
      SELECT DISTINCT message
      FROM assistant_chats
      WHERE keywords && ${keywords}::text[] AND products_found > 0
      ORDER BY created_at DESC
      LIMIT 3
    `;
    return rows.map((r: any) => r.message);
  } catch (e) {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════
// ══ INTELLIGENT PRODUCT SEARCH ═════════════════════════════════
// ═══════════════════════════════════════════════════════════════

interface SearchResult {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  sku: string;
  inStock: boolean;
  score: number;
}

async function smartProductSearch(
  sql: any,
  entities: ExtractedEntities,
  msg: string
): Promise<SearchResult[]> {
  const { brand, productType, model, modelKeywords, allKeywords, isLaptop, isPhone } = entities;

  // Build bilingual search terms
  let searchTerms: string[] = [];

  // 1. Model terms (highest priority)
  const modelTerms = [...modelKeywords];
  // Expand with bilingual
  for (const mk of modelKeywords) {
    const parts = mk.split('-');
    for (const part of parts) {
      if (part.length > 1) searchTerms.push(part);
    }
    searchTerms.push(mk);
  }

  // 2. Product type terms with bilingual expansion
  const productTypeTerms: string[] = [];
  if (productType) {
    const typeMap: Record<string, string[]> = {
      'screen': ['screen', 'scherm', 'display', 'lcd', 'oled', 'glas', 'glass', 'touch'],
      'screen_protector': ['screen protector', 'screenprotector', 'beschermglas', 'tempered glass', 'folie'],
      'battery': ['battery', 'batterij', 'accu'],
      'camera': ['camera', 'lens', 'frontcam', 'backcam'],
      'charging': ['charging', 'charger', 'oplader', 'lader', 'port', 'connector', 'usb', 'laad'],
      'back_cover': ['back cover', 'achterkant', 'housing', 'behuizing', 'frame'],
      'buttons': ['button', 'knop', 'volume', 'power', 'home'],
      'speaker': ['speaker', 'luidspreker', 'earpiece', 'hoorspeaker'],
      'microphone': ['microphone', 'microfoon', 'mic'],
      'keyboard': ['keyboard', 'toetsenbord'],
      'ram': ['ram', 'geheugen', 'memory'],
      'storage': ['storage', 'ssd', 'hdd', 'opslag'],
      'motherboard': ['motherboard', 'moederbord', 'logic board'],
    };
    const terms = typeMap[productType] || [productType];
    productTypeTerms.push(...terms);
  }

  // 3. Brand terms
  const brandTerms: string[] = [];
  if (brand) {
    brandTerms.push(brand);
    if (brand === 'apple') { brandTerms.push('iphone', 'ipad', 'macbook'); }
    if (brand === 'samsung') { brandTerms.push('samsung', 'galaxy'); }
  }

  // Combine all unique search terms
  searchTerms = Array.from(new Set([...searchTerms, ...productTypeTerms, ...brandTerms]));

  // Also add raw message words (for fallback broad search)
  const rawWords = msg.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w: string) => w.length > 2 && !['het','een','voor','wil','ik','je','de','dat','wat','hoe','kan','met','zijn','dit','die','heb','nodig','zoek','hebben','een','zoeken','the','for','want','need','search','looking','find'].includes(w));

  // Limit search terms to avoid too many queries
  const limitedTerms = searchTerms.slice(0, 8);
  const fallbackTerms = rawWords.slice(0, 6);

  const allResults: any[] = [];

  // Query strategy: multiple targeted searches
  try {
    // Strategy 1: Combined model + product type (most specific)
    if (modelKeywords.length > 0 && productTypeTerms.length > 0) {
      const modelPattern = modelKeywords.map(k => `%${k.replace(/-/g, '%')}%`).join('');
      const typePattern = productTypeTerms[0];
      const qCombined = await sql`
        SELECT id, name, name_en, price, image, category, subcategory, brand, model, sku, in_stock
        FROM products
        WHERE (
          name ILIKE ${`%${modelKeywords[0].replace(/-/g, ' ')}%${typePattern}%`}
          OR name_en ILIKE ${`%${modelKeywords[0].replace(/-/g, ' ')}%${typePattern}%`}
          OR name ILIKE ${`%${typePattern}%${modelKeywords[0].replace(/-/g, ' ')}%`}
          OR name_en ILIKE ${`%${typePattern}%${modelKeywords[0].replace(/-/g, ' ')}%`}
        )
        LIMIT 10
      `;
      allResults.push(...qCombined);
    }

    // Strategy 2: Search by each important term in both name and name_en
    for (const term of limitedTerms) {
      const q = await sql`
        SELECT id, name, name_en, price, image, category, subcategory, brand, model, sku, in_stock
        FROM products
        WHERE name ILIKE ${`%${term}%`} OR name_en ILIKE ${`%${term}%`}
        LIMIT 8
      `;
      allResults.push(...q);
    }

    // Strategy 3: Category-based search for laptop/phone parts
    if (isLaptop) {
      const laptopCat = brand ? `laptop-${brand}` : 'laptop';
      const qLaptop = await sql`
        SELECT id, name, name_en, price, image, category, subcategory, brand, model, sku, in_stock
        FROM products
        WHERE category ILIKE ${`%laptop%`} OR category = ${laptopCat}
        LIMIT 8
      `;
      allResults.push(...qLaptop);
    }

    if (isPhone && brand) {
      const qPhone = await sql`
        SELECT id, name, name_en, price, image, category, subcategory, brand, model, sku, in_stock
        FROM products
        WHERE category = ${brand} OR brand = ${brand}
        LIMIT 8
      `;
      allResults.push(...qPhone);
    }

    // Strategy 4: Broader fallback with raw words
    if (allResults.length < 5) {
      for (const word of fallbackTerms) {
        const q = await sql`
          SELECT id, name, name_en, price, image, category, subcategory, brand, model, sku, in_stock
          FROM products
          WHERE name ILIKE ${`%${word}%`} OR name_en ILIKE ${`%${word}%`}
          LIMIT 5
        `;
        allResults.push(...q);
      }
    }
  } catch (e) {
    console.error('Smart search error:', e);
  }

  // Deduplicate and score
  const seen = new Set<string>();
  const scored: SearchResult[] = [];

  for (const p of allResults) {
    if (seen.has(p.id)) continue;
    seen.add(p.id);

    const nameLower = (p.name || '').toLowerCase();
    const nameEnLower = (p.name_en || '').toLowerCase();
    let score = 0;

    // Score model matches (highest weight)
    for (const mk of modelKeywords) {
      const mkParts = mk.split('-');
      for (const part of mkParts) {
        if (part.length > 1) {
          if (nameLower.includes(part)) score += 25;
          if (nameEnLower.includes(part)) score += 20;
        }
      }
      if (nameLower.includes(mk.replace(/-/g, ' '))) score += 30;
      if (nameEnLower.includes(mk.replace(/-/g, ' '))) score += 25;
    }

    // Score product type matches
    for (const pt of productTypeTerms) {
      if (nameLower.includes(pt)) score += 20;
      if (nameEnLower.includes(pt)) score += 18;
    }

    // Score brand matches
    for (const bt of brandTerms) {
      if (nameLower.includes(bt)) score += 15;
      if (nameEnLower.includes(bt)) score += 12;
    }

    // Score raw word matches
    for (const w of rawWords) {
      if (nameLower.includes(w)) score += 5;
      if (nameEnLower.includes(w)) score += 4;
    }

    // Bonus for exact combined match (e.g. "iphone 14 battery")
    const combinedPattern = modelKeywords.map(k => k.replace(/-/g, ' ')).join(' ');
    if (combinedPattern.length > 3) {
      if (nameLower.includes(combinedPattern)) score += 50;
      if (nameEnLower.includes(combinedPattern)) score += 45;
    }

    // Penalty for wrong category (e.g. phone query matching laptop part)
    if (isPhone && p.category?.includes('laptop')) score -= 20;
    if (isLaptop && !p.category?.includes('laptop')) score -= 10;

    scored.push({
      id: p.id,
      name: p.name,
      nameEn: p.name_en,
      price: parseFloat(p.price),
      image: p.image,
      category: p.category,
      subcategory: p.subcategory,
      brand: p.brand,
      model: p.model,
      sku: p.sku,
      inStock: p.in_stock,
      score,
    });
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

export async function POST(request: NextRequest) {
  try {
    const sql = getDb();
    const body = await request.json();
    const { message, context = {} } = body;
    const msg = (message || '').toLowerCase();

    // Build response
    const response: any = {
      text: '',
      products: [],
      updatedContext: { ...context },
      suggestions: [],
      action: null,
    };

    const intent = detectIntent(msg);
    const brand = extractBrand(msg);
    const productType = extractProductType(msg);
    const modelKeywords = extractModelKeywords(msg);
    const spSubtype = extractScreenProtectorSubtype(message || '');
    const spBrand = extractSpBrand(message || '');

    // ── SCREEN PROTECTOR SMART FLOW ──────────────────────────────
    // Also handle follow-up answers (Apple, Samsung, Gehard Glas) when in active SP conversation
    const isScreenProtectorFlow = intent === 'screen_protector' || (context.spStep && (spSubtype || spBrand || msg.includes('apple') || msg.includes('samsung') || msg.includes('anders')));
    if (isScreenProtectorFlow) {
      const ctxSpStep = context.spStep || 'ask_type';
      const ctxSpType = context.spType || null;
      const ctxSpBrand = context.spBrand || null;

      // Handle "Anders merk" / "Anders type" reset
      if (msg.includes('anders merk') || msg.includes('andere merk')) {
        response.updatedContext.spBrand = null;
        const currentType = ctxSpType;
        const typeNames: Record<string, string> = { 'gehard-glas': 'Gehard Glas', 'privacy-glass': 'Privacy Glass', 'magic-glass': 'Magic Glass' };
        const typeName = typeNames[currentType || ''] || currentType;
        response.text = `Geen probleem! Voor welk merk zoek je een ${typeName} screen protector?`;
        response.suggestions = ['Apple', 'Samsung'];
        response.updatedContext.spStep = 'ask_brand';
        return NextResponse.json(response);
      }
      if (msg.includes('anders type') || msg.includes('andere type')) {
        response.updatedContext.spType = null;
        response.updatedContext.spBrand = null;
        response.text = 'Geen probleem! Welk type screen protector zoek je?';
        response.suggestions = ['Gehard Glas', 'Privacy Glass', 'Magic Glass'];
        response.updatedContext.spStep = 'ask_type';
        return NextResponse.json(response);
      }

      // Update context with newly detected values
      if (spSubtype) response.updatedContext.spType = spSubtype;
      if (spBrand) response.updatedContext.spBrand = spBrand;
      const currentType = spSubtype || ctxSpType;
      const currentBrand = spBrand || ctxSpBrand;

      if (!currentType) {
        response.text = 'Top! Je zoekt screen protectors. Welk type heb je nodig?\n\nWe hebben 3 soorten:\n📱 Gehard Glas – maximale bescherming tegen krassen en vallen\n🔒 Privacy Glass – privacyfilter, alleen jij ziet je scherm\n✨ Magic Glass – premium kwaliteit met extra features';
        response.suggestions = ['Gehard Glas', 'Privacy Glass', 'Magic Glass'];
        response.action = { type: 'link', url: '/products?accessory=screen-protectors', label: 'Alle screen protectors bekijken' };
        response.updatedContext.spStep = 'ask_type';
      } else if (!currentBrand) {
        const typeNames: Record<string, string> = {
          'gehard-glas': 'Gehard Glas',
          'privacy-glass': 'Privacy Glass',
          'magic-glass': 'Magic Glass',
        };
        const typeName = typeNames[currentType] || currentType;
        response.text = `Perfect! Je hebt gekozen voor ${typeName}. Nu nog 1 vraag: voor welk merk zoek je een screen protector?\n\nWe hebben screen protectors voor:\n🍎 Apple – iPhone, iPad\n📱 Samsung – Galaxy series`;
        response.suggestions = ['Apple', 'Samsung'];
        response.updatedContext.spStep = 'ask_brand';
      } else {
        // Both type and brand known → direct link
        const typeNames: Record<string, string> = {
          'gehard-glas': 'Gehard Glas',
          'privacy-glass': 'Privacy Glass',
          'magic-glass': 'Magic Glass',
        };
        const brandNames: Record<string, string> = {
          'apple': 'Apple',
          'samsung': 'Samsung',
        };
        const typeName = typeNames[currentType] || currentType;
        const brandName = brandNames[currentBrand] || currentBrand;
        const url = `/products?accessory=screen-protectors&sub=${currentType}&accBrand=${currentBrand}`;
        response.text = `Geweldig! Hier zijn alle ${brandName} ${typeName} screen protectors. Klik op de link om direct te shoppen! 🛒`;
        response.action = { type: 'link', url, label: `Bekijk ${brandName} ${typeName}` };
        response.suggestions = ['Anders merk', 'Anders type', 'Meer accessoires'];
        response.updatedContext.spStep = 'show_results';

        // Also search products
        try {
          const rows = await sql`
            SELECT id, name, name_en, price, image, category, subcategory, brand, sku, in_stock
            FROM products
            WHERE category = 'acc-screen-protectors'
              AND subcategory = ${currentType}
              AND brand = ${currentBrand}
            LIMIT 5
          `;
          response.products = rows.map((r: any) => ({
            id: r.id,
            name: r.name,
            nameEn: r.name_en,
            price: parseFloat(r.price),
            image: r.image,
            category: r.category,
            subcategory: r.subcategory,
            brand: r.brand,
            sku: r.sku,
            inStock: r.in_stock,
          }));
        } catch (e) { /* ignore */ }
      }
    }

    // ── CONVERSATIONAL PRODUCT SEARCH FLOW ───────────────────────
    else if (intent === 'product_search' || intent === 'unknown') {
      const entities = extractEntities(message || '');
      const { brand: eBrand, productType: eProductType, modelKeywords, isLaptop, isPhone } = entities;

      // Store detected entities in context
      if (eBrand) response.updatedContext.brand = eBrand;
      if (eProductType) response.updatedContext.productType = eProductType;

      // ── Smart product search ──────────────────────────────────
      const searchResults = await smartProductSearch(sql, entities, message || '');

      // Map results to response format
      response.products = searchResults.slice(0, 10).map((r) => ({
        id: r.id,
        name: r.name,
        nameEn: r.nameEn,
        price: r.price,
        image: r.image,
        category: r.category,
        subcategory: r.subcategory,
        model: r.model,
        brand: r.brand,
        sku: r.sku,
        inStock: r.inStock,
      }));

      // ── Learning: Get suggestions from chat history ─────────────
      let historySuggestions: string[] = [];
      try {
        const popular = await getPopularQueries(sql, eBrand || undefined, eProductType || undefined);
        historySuggestions = popular.slice(0, 3);
      } catch (e) { /* ignore */ }

      // ── Conversational response logic ─────────────────────────
      if (response.products.length > 0) {
        // Products found - smart response based on what was searched
        const topProduct = response.products[0];
        const productTypeLabel = eProductType
          ? ({ screen: 'scherm', battery: 'batterij', camera: 'camera', charging: 'oplader', back_cover: 'achterkant', buttons: 'knoppen', speaker: 'speaker', microphone: 'microfoon', keyboard: 'toetsenbord', ram: 'RAM', storage: 'opslag', motherboard: 'moederbord', screen_protector: 'screen protector' })[eProductType] || eProductType
          : 'onderdeel';

        if (modelKeywords.length > 0 && eProductType) {
          response.text = `Perfect! Ik heb ${response.products.length} ${productTypeLabel}(s) gevonden voor ${modelKeywords[0].replace(/-/g, ' ')}. Hier zijn de beste matches:`;
        } else if (eBrand) {
          response.text = `Ik heb ${response.products.length} producten gevonden voor ${eBrand.charAt(0).toUpperCase() + eBrand.slice(1)}. Bekijk ze hieronder:`;
        } else {
          response.text = `Ik heb ${response.products.length} product(en) gevonden! Hier zijn de beste matches:`;
        }
        response.updatedContext.step = 'show_results';

        // Add history-based suggestions
        if (historySuggestions.length > 0) {
          response.suggestions = [...historySuggestions, 'Anders zoeken'];
        } else {
          response.suggestions = ['Anders zoeken'];
        }
      } else {
        // ── NO RESULTS → SMART FOLLOW-UP ────────────────────────
        const detectedModel = modelKeywords.length > 0 ? modelKeywords[0].replace(/-/g, ' ') : null;
        const detectedBrand = eBrand;
        const detectedType = eProductType;

        // Check context for step tracking
        const searchStep = context.searchStep || 'initial';

        if (searchStep === 'initial' && (!detectedModel || !detectedType)) {
          // Missing info - ask follow-up questions
          if (!detectedBrand && !detectedModel) {
            response.text = 'Ik begrijp dat je een onderdeel zoekt! Om je beter te helpen, heb ik wat meer info nodig:\n\nWelk merk en model heb je? Bijvoorbeeld: iPhone 14, Samsung Galaxy S24, of Dell XPS 13.';
            response.suggestions = ['iPhone', 'Samsung Galaxy', 'iPad', 'Dell laptop', 'HP laptop'];
            response.updatedContext.searchStep = 'ask_brand_model';
          } else if (detectedBrand && !detectedModel) {
            response.text = `Top, je zoekt iets voor ${detectedBrand.charAt(0).toUpperCase() + detectedBrand.slice(1)}! Welk model heb je?\n\nBijvoorbeeld: iPhone 14 Pro, Galaxy S24 Ultra, of XPS 15.`;
            response.suggestions = ['iPhone 14', 'iPhone 15 Pro', 'Galaxy S24', 'Galaxy A54', 'XPS 13'];
            response.updatedContext.searchStep = 'ask_model';
            response.updatedContext.brand = detectedBrand;
          } else if (detectedModel && !detectedType) {
            response.text = `Je zoekt dus iets voor ${detectedModel}! Welk onderdeel heb je nodig?\n\nBijvoorbeeld: scherm, batterij, camera, oplader, of achterkant.`;
            response.suggestions = ['Scherm', 'Batterij', 'Camera', 'Oplader', 'Achterkant'];
            response.updatedContext.searchStep = 'ask_part';
            response.updatedContext.detectedModel = detectedModel;
          } else {
            // Have both model and type but no results
            response.text = `Ik heb helaas geen exacte matches gevonden voor ${detectedModel} ${detectedType}.\n\nDat kan betekenen dat dit onderdeel tijdelijk niet op voorraad is, of dat we het onder een andere naam hebben staan.\n\nProbeer het eens met de zoekbalk bovenaan de productpagina, of vraag me iets anders!`;
            response.action = { type: 'link', url: '/products', label: 'Zelf zoeken op productpagina' };
            response.suggestions = ['iPhone onderdelen', 'Samsung onderdelen', 'Laptop onderdelen', 'Contact opnemen'];
            response.updatedContext.searchStep = 'no_results_final';
          }
        } else {
          // Already asked follow-ups, still no results
          response.text = `Ik heb helaas nog steeds geen producten gevonden.\n\nMogelijke oplossingen:\n1. Probeer het zelf met de zoekbalk op de productpagina\n2. Neem contact op met ons team - we kunnen het onderdeel misschien bestellen\n3. Vraag om een vergelijkbaar alternatief`;
          response.action = { type: 'link', url: '/products', label: 'Productpagina openen' };
          response.suggestions = ['Contact opnemen', 'Reparatie aanvragen', 'Alternatief zoeken'];
          response.updatedContext.searchStep = 'no_results_final';
        }
      }

      // ── SAVE TO CHAT HISTORY (async, non-blocking) ───────────
      const sessionId = context.sessionId || `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      response.updatedContext.sessionId = sessionId;
      saveChat(sql, {
        sessionId,
        message: message || '',
        intent,
        brand: eBrand || '',
        productType: eProductType || '',
        model: modelKeywords[0] || '',
        keywords: entities.allKeywords,
        productsFound: response.products.length,
        responseText: response.text,
      });
    }

    // ── REPAIR ──────────────────────────────────────────────────
    else if (intent === 'repair') {
      response.text = 'Wij bieden twee reparatieservices aan:\n\n🚚 Ophalen - We komen het apparaat bij je ophalen. Kies "Ophalen" in het reparatieformulier.\n\n📦 Opsturen - Je stuurt het apparaat naar ons toe. Kies "Opsturen" in het reparatieformulier.\n\nAlle reparaties hebben 3 maanden garantie. We nemen binnen 24 uur contact op na je aanvraag.';
      response.suggestions = ['Reparatieformulier openen', 'Wat kost een reparatie?', 'Garantie op reparaties'];
      response.action = { type: 'link', url: '/repair', label: 'Reparatie aanvragen' };
      response.updatedContext.step = 'repair_info';
    }

    // ── SHIPPING ────────────────────────────────────────────────
    else if (intent === 'shipping') {
      response.text = 'We verzenden dagelijks via DHL, PostNL en DPD.\n\nVerzendkosten:\n• Nederland: €6,95 (gratis boven €150)\n• EU: €18,95\n\nLevertijd:\n• NL: meestal volgende werkdag\n• EU: 1-3 werkdagen\n\nJe ontvangt automatisch een track & trace link zodra je bestelling is verzonden.';
      response.suggestions = ['Bestelling volgen', 'Levertijd naar België', 'Retourneren'];
      response.updatedContext.step = 'shipping_info';
    }

    // ── ORDER STATUS ────────────────────────────────────────────
    else if (intent === 'order_status') {
      response.text = 'Je kunt je bestelling op twee manieren volgen:\n\n1. Mijn Account > Bestellingen - Log in en zie direct alle statussen\n2. Email ons - Stuur je bestelnummer naar info@labfix.nl\n\nWe reageren meestal binnen 2 uur op werkdagen.';
      response.suggestions = ['Inloggen', 'Contact opnemen', 'Retourneren'];
      response.updatedContext.step = 'order_info';
    }

    // ── PRICING ────────────────────────────────────────────────
    else if (intent === 'pricing') {
      response.text = 'Onze prijzen zijn exclusief voor zakelijke klanten (B2B). Na registratie met KVK-nummer zie je direct alle prijzen.\n\nBetaalmethoden:\n• iDEAL\n• Klarna (achteraf betalen)\n\nStaffelkortingen:\n• 10-49 stuks: 5% korting\n• 50-99 stuks: 10% korting\n• 100+ stuks: 15% korting of meer\n\nVoor grote projecten: sales@labfix.nl';
      response.suggestions = ['Registreren', 'Offerte aanvragen', 'Verzendkosten'];
      response.updatedContext.step = 'pricing_info';
    }

    // ── CONTACT ────────────────────────────────────────────────
    else if (intent === 'contact') {
      response.text = `LabFix Contactgegevens 📞\n\n📧 Email: info@labfix.nl\n📱 WhatsApp: +31 6 5113 1133\n📞 Telefoon: +31 6 5113 1133\n\nBedrijfsgegevens:\n• KvK: 42035906\n• BTW: NL005445900B06\n• Bank: NL36INGB0115171061\n\nOpeningstijden:\nMaandag - Vrijdag: 09:00 - 18:00\nWeekend: Gesloten\n\nAdres: Den Haag, Nederland`;
      response.suggestions = ['Email sturen', 'WhatsApp openen', 'Reparatie aanvragen'];
      response.action = { type: 'link', url: '/contact', label: 'Contact pagina' };
      response.updatedContext.step = 'contact_info';
    }

    // ── AVAILABILITY ─────────────────────────────────────────────
    else if (intent === 'availability') {
      response.text = 'Onze voorraad wordt real-time bijgewerkt. Producten met "Op voorraad" zijn direct leverbaar.\n\nPopulaire onderdelen zoals iPhone en Samsung schermen/batterijen hebben we altijd op voorraad. Zeldzamere modellen soms binnen 2-3 dagen leverbaar vanuit ons centrale magazijn.';
      response.suggestions = ['iPhone onderdelen', 'Samsung onderdelen', 'Laptop onderdelen'];
      response.updatedContext.step = 'availability_info';
    }

    // ── WARRANTY ────────────────────────────────────────────────
    else if (intent === 'warranty') {
      response.text = 'Garantie bij LabFix:\n\n• Producten: 14 dagen DOA-garantie (Dead On Arrival)\n• Reparaties: 3 maanden garantie op uitgevoerde reparaties\n• Fabricagefouten: Gratis vervanging bij fabricagefouten\n\nGarantie geldt niet voor beschadiging door verkeerd monteren of vallen. Bewaar altijd je bestelbevestiging als garantiebewijs.';
      response.suggestions = ['Garantie claimen', 'Reparatie aanvragen', 'Retourneren'];
      response.updatedContext.step = 'warranty_info';
    }

    // ── RETURNS ─────────────────────────────────────────────────
    else if (intent === 'returns') {
      response.text = 'Retourbeleid:\n\n• 30 dagen retourrecht voor ongebruikte producten in originele verpakking\n• DOA (defect bij ontvangst): gratis vervanging\n• Retourkosten zijn voor de klant, tenzij het onze fout is\n\nStuur een email naar info@labfix.nl met:\n1. Bestelnummer\n2. Reden van retour\n3. Foto\'s van het product (indien defect)';
      response.suggestions = ['Contact opnemen', 'Garantie claimen'];
      response.updatedContext.step = 'returns_info';
    }

    // ── ACCOUNT ─────────────────────────────────────────────────
    else if (intent === 'account') {
      response.text = 'LabFix is exclusief B2B. Registratie vereist een geldig KVK-nummer.\n\nRegistratie stappen:\n1. Klik op "Account" bovenaan de pagina\n2. Kies "Registreren"\n3. Vul je bedrijfsgegevens + KVK-nummer in\n4. We keuren meestal binnen 24 uur goed\n\nDaarna zie je alle prijzen en kun je direct bestellen. Zonder KVK kun je wel de site bekijken maar niet bestellen.';
      response.suggestions = ['Registreren', 'Inloggen', 'Offerte aanvragen'];
      response.action = { type: 'link', url: '/account', label: 'Account pagina' };
      response.updatedContext.step = 'account_info';
    }

    // ── ABOUT ───────────────────────────────────────────────────
    else if (intent === 'about') {
      response.text = `LabFix - Jouw partner in reparatie 🛠️\n\nWij zijn een Nederlandse B2B groothandel gespecialiseerd in reparatieonderdelen voor smartphones, tablets en laptops.\n\nWaarom LabFix?\n✅ Ruimste assortiment (100+ merken, 50.000+ producten)\n✅ Strikte kwaliteitscontrole (elk product getest)\n✅ Snelle levering (1-3 dagen EU)\n✅ Deskundige support\n✅ Scherpe B2B prijzen\n\nBedrijfsgegevens:\nKvK: ${KNOWLEDGE.company.kvk}\nBTW: ${KNOWLEDGE.company.btw}\nBank: ${KNOWLEDGE.company.bank}`;
      response.suggestions = ['Producten bekijken', 'Reparatie aanvragen', 'Contact opnemen'];
      response.updatedContext.step = 'about_info';
    }

    // ── GREETING ────────────────────────────────────────────────
    else if (intent === 'greeting') {
      const greetings = [
        'Hallo! Ik ben de LabFix AI-assistent. Ik help je graag met producten zoeken, reparaties aanvragen, of vragen over onze services. Waarmee kan ik je helpen?',
        'Goedendag! Welkom bij LabFix. Ik weet alles over onze reparatieonderdelen en services. Wat zoek je vandaag?',
        'Hoi! Ik ben je digitale helper van LabFix. Ik kan je helpen met producten vinden, bestellingen volgen, en reparaties aanvragen. Wat kan ik voor je doen?',
      ];
      response.text = greetings[Math.floor(Math.random() * greetings.length)];
      response.suggestions = ['iPhone onderdelen', 'Samsung onderdelen', 'Reparatie aanvragen', 'Bestelling volgen', 'Contact'];
      response.updatedContext.step = 'greeting';
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Assistant API error:', error);
    return NextResponse.json(
      { text: 'Er is iets misgegaan. Probeer het opnieuw of neem contact op via info@labfix.nl.', products: [], suggestions: [] },
      { status: 500 }
    );
  }
}
