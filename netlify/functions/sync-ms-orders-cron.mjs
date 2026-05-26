// Netlify Scheduled Function — runs every hour
// Calls /api/cron/sync-ms-orders to fetch latest MS status + tracking, send emails

import { schedule } from '@netlify/functions';

const handler = async () => {
  const baseUrl = process.env.URL || 'https://labfix.nl';
  const cronSecret = process.env.CRON_SECRET || '';

  try {
    const res = await fetch(`${baseUrl}/api/cron/sync-ms-orders`, {
      method: 'GET',
      headers: cronSecret ? { Authorization: `Bearer ${cronSecret}` } : {},
    });
    const data = await res.json();
    console.log('Sync result:', JSON.stringify(data).slice(0, 1000));
    return { statusCode: 200, body: JSON.stringify({ ok: true, syncResult: data }) };
  } catch (err) {
    console.error('Cron sync failed:', err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

// Cron expression: every hour at minute 15
export const handler_scheduled = schedule('15 * * * *', handler);
export { handler_scheduled as handler };
