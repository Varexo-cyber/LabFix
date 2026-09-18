import { getDb } from '@/lib/db';

// Geuploade afbeeldingen werden als data:-URL in products.image gezet. Die
// werken wel in de browser, maar Google Merchant Center kan ze niet ophalen:
// een feed heeft een echte, aanklikbare https-URL nodig. Daarom bewaren we de
// bytes hier en serveren we ze op /api/images/<id>.
//
// De payload blijft base64 in een TEXT-kolom: dat is precies wat er nu al in
// products.image staat, dus bestaande afbeeldingen kunnen er ongewijzigd in
// worden overgezet zonder kwaliteitsverlies of herupload.

export const IMAGE_URL_PREFIX = '/api/images/';

let imagesTableReady: Promise<void> | null = null;

export async function ensureImagesTable(sql: any): Promise<void> {
  if (!imagesTableReady) {
    imagesTableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS product_images (
          id TEXT PRIMARY KEY,
          mime TEXT NOT NULL DEFAULT 'image/jpeg',
          data TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `;
    })().catch((err) => {
      imagesTableReady = null;
      throw err;
    });
  }
  return imagesTableReady;
}

// Splitst "data:image/png;base64,AAAA" in mime + payload.
// Geeft null terug als het geen data-URL is.
export function parseDataUrl(value: string): { mime: string; data: string } | null {
  const match = /^data:([^;,]+);base64,([\s\S]+)$/.exec(value || '');
  if (!match) return null;
  return { mime: match[1] || 'image/jpeg', data: match[2] };
}

export async function storeImage(mime: string, base64: string): Promise<string> {
  const sql = getDb();
  await ensureImagesTable(sql);
  const id = crypto.randomUUID();
  await sql`INSERT INTO product_images (id, mime, data) VALUES (${id}, ${mime}, ${base64})`;
  return `${IMAGE_URL_PREFIX}${id}`;
}
