const SUPABASE_URL = 'https://vpqytiayfxnsdlmhhkta.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcXl0aWF5Znhuc2RsbWhoa3RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTcyOTEsImV4cCI6MjA5MTY3MzI5MX0.tI7AHwaHM_AP1n1Laq1ZRUqSoXhQBn1xBjCLO7iP7Bg';
const VAPID_PUBLIC_KEY = 'BLM_1GQnNPXIWinbD3iqctWpJfEQOnbkWX97Eb1Fmr5A43-2WP9Wjhq31Hfp_jpY1rlSekT0JZE94gEA9ItHf6Y';
const VAPID_PRIVATE_KEY = 'Lq1X8a5iD6jzIzQSvcOjFQBxq60uA-x-PR27zZMFyVI';
const VAPID_SUBJECT = 'mailto:admin@sidequest.app';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

async function signVapid(audience, subject, publicKey, privateKey) {
  const header = { alg: 'ES256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = { aud: audience, exp: now + 43200, sub: subject };

  const encode = (obj) =>
    btoa(JSON.stringify(obj)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const unsignedToken = `${encode(header)}.${encode(payload)}`;

  const keyData = urlBase64ToUint8Array(privateKey);
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyData,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );

  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    cryptoKey,
    new TextEncoder().encode(unsignedToken)
  );

  const sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${unsignedToken}.${sig}`;
}

async function sendPush(subscription, payload) {
  const { endpoint, p256dh, auth } = subscription;
  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;

  const jwt = await signVapid(audience, VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const body = JSON.stringify(payload);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `vapid t=${jwt},k=${VAPID_PUBLIC_KEY}`,
      'Content-Type': 'application/json',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
    },
    body,
  });

  return response.status;
}

async function runDailyReminder() {
  const today = new Date().toISOString().split('T')[0];

  const subsRes = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?select=user_id,endpoint,p256dh,auth`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  const allSubs = await subsRes.json();

  if (!allSubs?.length) return `No subscribers found`;

  const checkedRes = await fetch(
    `${SUPABASE_URL}/rest/v1/check_ins?select=user_id&check_in_date=eq.${today}`,
    {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  const checkedIn = await checkedRes.json();
  const checkedIds = new Set((checkedIn || []).map((r) => r.user_id));

  const toNotify = allSubs.filter((s) => !checkedIds.has(s.user_id));

  let sent = 0;
  for (const sub of toNotify) {
    try {
      await sendPush(sub, {
        title: "SideQuest Check-In 🎯",
        body: "Your pod is waiting! Don't break your streak.",
        url: '/app',
      });
      sent++;
    } catch (e) {
      console.error('Push failed for', sub.user_id, e);
    }
  }

  return `Notified ${sent}/${toNotify.length} users who haven't checked in today`;
}

export default {
  async scheduled(event, env, ctx) {
    const result = await runDailyReminder();
    console.log('[Cron]', result);
  },

  async fetch(request, env, ctx) {
    if (request.method === 'GET' && new URL(request.url).pathname === '/trigger') {
      const result = await runDailyReminder();
      return new Response(result, { status: 200 });
    }
    return new Response('SideQuest Worker OK', { status: 200 });
  },
};
