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
      // Step tracking in context
      const step = context.step || 'initial';
      const ctxBrand = context.brand || null;
      const ctxProductType = context.productType || null;

      // If brand is detected in message, store it
      if (brand) {
        response.updatedContext.brand = brand;
      }
      if (productType) {
        response.updatedContext.productType = productType;
      }

      // ── Build keywords for search ───────────────────────────────
      // Priority order: model name > product type > brand > other words
      const keywords: { term: string; weight: number }[] = [];

      // 1. Model identifiers (highest weight)
      const modelPatterns = [
        /\biphone\s+\d+\s*(pro\s*max|pro|plus|max|mini)?\b/gi,
        /\biphone\s+(se|xr|xs)\b/gi,
        /\bipad\s+\w+\b/gi,
        /\bmacbook\s+(air|pro)?\b/gi,
        /\bgalaxy\s+s?\d+\s*(fe|plus|ultra)?\b/gi,
        /\bgalaxy\s+a\d+\s*(5g)?\b/gi,
        /\b(samsung\s+)?a\d+\s*(5g)?\b/gi,
        /\bpixel\s+\d+\b/gi,
        /\b(xiaomi|redmi|poco)\s+\d+\b/gi,
        /\b(dell|hp|lenovo|asus|acer|msi)\s+\w+\b/gi,
        /\b(inspiron|xps|thinkpad|ideapad)\s*\d*\b/gi,
        /\b\d+\s*(pro\s*max|pro|plus|max|ultra|fe|5g)\b/gi,
      ];
      for (const p of modelPatterns) {
        const matches = msg.match(p);
        if (matches) {
          for (const m of matches) {
            const clean = m.toLowerCase().trim();
            if (clean.length > 2) keywords.push({ term: clean, weight: 20 });
          }
        }
      }

      // 2. Product type (high weight)
      const productPatterns: Record<string, RegExp> = {
        'screen protector': /\bscreen\s*protector\b/gi,
        'tempered glass': /\btempered\s*glass\b/gi,
        'scherm': /\bscherm\b/gi,
        'batterij': /\bbatterij\b/gi,
        'battery': /\bbattery\b/gi,
        'camera': /\bcamera\b/gi,
        'charger': /\bcharger\b/gi,
        'lader': /\blader\b/gi,
        'oplader': /\boplader\b/gi,
        'frame': /\bframe\b/gi,
        'back cover': /\bback\s*cover\b/gi,
        'achterkant': /\bachterkant\b/gi,
        'housing': /\bhousing\b/gi,
        'lcd': /\blcd\b/gi,
        'oled': /\boled\b/gi,
        'glas': /\bglas\b/gi,
        'glass': /\bglass\b/gi,
        'touch': /\btouch\b/gi,
        'display': /\bdisplay\b/gi,
        'accu': /\baccu\b/gi,
        'charging port': /\bcharging\s*port\b/gi,
        'laad poort': /\blaad\s*poort\b/gi,
        'usb': /\busb\b/gi,
        'connector': /\bconnector\b/gi,
      };
      for (const [name, p] of Object.entries(productPatterns)) {
        if (p.test(msg)) keywords.push({ term: name, weight: 15 });
      }

      // 3. Brand (medium weight)
      if (brand) keywords.push({ term: brand, weight: 10 });
      const brandWords = ['iphone', 'ipad', 'macbook', 'samsung', 'galaxy', 'xiaomi', 'redmi', 'poco', 'google', 'pixel', 'huawei', 'motorola', 'oneplus', 'oppo', 'sony', 'xperia', 'nokia', 'lg', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'msi', 'microsoft', 'surface'];
      for (const bw of brandWords) {
        if (msg.includes(bw) && !keywords.some(k => k.term === bw)) {
          keywords.push({ term: bw, weight: 10 });
        }
      }

      // 4. Other important words (low weight)
      const otherWords = msg.split(/\s+/).filter((w: string) => w.length > 2 && !['het','een','voor','wil','ik','je','de','dat','wat','hoe','kan','met','zijn','dit','die','heb','nodig','zoek','hebben','een','het','zoeken','ik','wil','een','voor','heb','nodig','zoek'].includes(w));
      for (const w of otherWords) {
        if (!keywords.some(k => k.term === w)) {
          keywords.push({ term: w.toLowerCase(), weight: 3 });
        }
      }

      // Deduplicate
      const uniqueKeywords = Array.from(new Map(keywords.map(k => [k.term, k])).values()).slice(0, 12);

      // ── Execute search ────────────────────────────────────────
      if (uniqueKeywords.length > 0) {
        try {
          const terms = uniqueKeywords.map(k => k.term);

          // Build a simple OR pattern for ILIKE search
          // We run multiple small queries and combine results in JS
          const allProducts: any[] = [];

          // Query 1: Exact phrase match (most specific)
          const phrase = terms.slice(0, 3).join(' ');
          const q1 = await sql`
            SELECT id, name, name_en, price, image, category, subcategory, model, sku, in_stock
            FROM products
            WHERE name ILIKE ${`%${phrase}%`}
            LIMIT 5
          `;
          allProducts.push(...q1);

          // Query 2: Search by individual top-weighted terms
          const topTerms = terms.slice(0, 4);
          for (let i = 0; i < topTerms.length; i++) {
            const term = topTerms[i];
            const q = await sql`
              SELECT id, name, name_en, price, image, category, subcategory, model, sku, in_stock
              FROM products
              WHERE name ILIKE ${`%${term}%`} OR name_en ILIKE ${`%${term}%`}
              LIMIT 5
            `;
            allProducts.push(...q);
          }

          // Deduplicate and score
          const seen = new Set<string>();
          const scored: any[] = [];
          for (const p of allProducts) {
            if (seen.has(p.id)) continue;
            seen.add(p.id);
            const nameLower = (p.name || '').toLowerCase();
            const nameEnLower = (p.name_en || '').toLowerCase();
            let score = 0;
            for (let i = 0; i < uniqueKeywords.length; i++) {
              const kw = uniqueKeywords[i].term.toLowerCase();
              if (nameLower.includes(kw)) score += uniqueKeywords[i].weight;
              else if (nameEnLower.includes(kw)) score += Math.floor(uniqueKeywords[i].weight / 2);
            }
            scored.push({ ...p, score });
          }

          // Sort by score (desc)
          scored.sort((a: any, b: any) => b.score - a.score);

          response.products = scored.slice(0, 10).map((r: any) => ({
            id: r.id,
            name: r.name,
            nameEn: r.name_en,
            price: parseFloat(r.price),
            image: r.image,
            category: r.category,
            subcategory: r.subcategory,
            model: r.model,
            sku: r.sku,
            inStock: r.in_stock,
          }));
        } catch (searchErr) {
          console.error('Assistant product search error:', searchErr);
        }
      }

      // Conversational logic
      if (response.products.length > 0) {
        // Direct show products - no more annoying questions
        response.text = `Ik heb ${response.products.length} product(en) gevonden! Hier zijn de beste matches:`;
        response.action = null;
        response.updatedContext.step = 'show_results';
      } else if (brand || ctxBrand) {
        response.text = `Ik heb helaas geen producten gevonden voor ${brand || ctxBrand} met "${msg}". \n\nProbeer het eens met een ander zoekwoord, of vraag me om een specifiek model (bijv. Galaxy S24, iPhone 15 Pro).`;
        response.suggestions = ['Alle schermen', 'Alle batterijen', 'iPhone onderdelen', 'Samsung onderdelen', 'Laptop onderdelen'];
        response.updatedContext.step = 'no_results';
      } else if (msg.includes('laptop')) {
        response.text = 'Ik heb helaas geen laptop onderdelen gevonden met die zoekterm. Bekijk alle laptop onderdelen in onze catalogus.';
        response.action = { type: 'link', url: '/products?category=laptop', label: 'Laptop onderdelen bekijken' };
        response.suggestions = ['Dell laptop', 'HP laptop', 'Lenovo laptop', 'Asus laptop'];
        response.updatedContext.step = 'laptop_results';
      } else {
        response.text = 'Ik begrijp je vraag! Ik kan je helpen met:\n\n🔍 Producten zoeken - Vertel me merk + model + onderdeel\n🔧 Reparatie aanvragen - Ophalen of opsturen via /repair\n📦 Bestelling volgen - Via Mijn Account\n💬 Contact - info@labfix.nl of +31 6 5113 1133\n\nWaar ben je naar op zoek?';
        response.suggestions = ['iPhone 15 scherm', 'Samsung batterij', 'Laptop onderdelen', 'Reparatie aanvragen', 'Contact opnemen'];
        response.updatedContext.step = 'initial';
      }
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
