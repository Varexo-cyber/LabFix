// Netlify Scheduled Function — haalt elk half uur de voorraadstand op bij
// MobileSentrix. Voorheen werd de voorraad alleen bij het importeren gezet en
// daarna nooit meer bijgewerkt, waardoor de shop producten als uitverkocht of
// juist als leverbaar toonde terwijl MobileSentrix iets anders zei.

export default async () => {
  const baseUrl = process.env.URL || 'https://labfix.nl';
  const cronSecret = process.env.CRON_SECRET || '';

  try {
    const res = await fetch(`${baseUrl}/api/cron/sync-ms-stock`, {
      method: 'GET',
      headers: cronSecret ? { Authorization: `Bearer ${cronSecret}` } : {},
    });
    const data = await res.json();
    console.log('Stock sync result:', JSON.stringify(data).slice(0, 1000));
    return new Response(JSON.stringify({ ok: true, syncResult: data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Stock cron sync failed:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  schedule: '*/30 * * * *',
};
