// Netlify Scheduled Function — runs every hour at :15
// Schedule defined in netlify.toml (no @netlify/functions package needed)

export default async () => {
  const baseUrl = process.env.URL || 'https://labfix.nl';
  const cronSecret = process.env.CRON_SECRET || '';

  try {
    const res = await fetch(`${baseUrl}/api/cron/sync-ms-orders`, {
      method: 'GET',
      headers: cronSecret ? { Authorization: `Bearer ${cronSecret}` } : {},
    });
    const data = await res.json();
    console.log('Sync result:', JSON.stringify(data).slice(0, 1000));
    return new Response(JSON.stringify({ ok: true, syncResult: data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Cron sync failed:', err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = {
  schedule: '15 * * * *',
};
