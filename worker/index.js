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
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `vapid t=${jwt},k=${VAPID_PUBLIC_KEY}`,
      'Content-Type': 'application/json',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
    },
    body: JSON.stringify(payload),
  });
  return response.status;
}

async function runDailyReminder() {
  const today = new Date().toISOString().split('T')[0];
  const subsRes = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?select=user_id,endpoint,p256dh,auth`, {
    headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
  });
  const allSubs = await subsRes.json();
  if (!allSubs?.length) return 'No subscribers found';
  const checkedRes = await fetch(
    `${SUPABASE_URL}/rest/v1/check_ins?select=user_id&check_in_date=eq.${today}`,
    { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  const checkedIn = await checkedRes.json();
  const checkedIds = new Set((checkedIn || []).map((r) => r.user_id));
  const toNotify = allSubs.filter((s) => !checkedIds.has(s.user_id));
  let sent = 0;
  for (const sub of toNotify) {
    try {
      await sendPush(sub, {
        title: 'SideQuest Check-In 🎯',
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

async function runStreakReset() {
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Get all users with streak > 0
  const usersRes = await fetch(
    `${SUPABASE_URL}/rest/v1/users?select=id,streak_count&streak_count=gt.0`,
    { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  const users = await usersRes.json();
  if (!users?.length) return 'No users with active streaks';

  // Get all user_ids who checked in yesterday
  const checkRes = await fetch(
    `${SUPABASE_URL}/rest/v1/check_ins?select=user_id&check_in_date=eq.${yesterday}`,
    { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  const checked = await checkRes.json();
  const checkedIds = new Set((checked || []).map((r) => r.user_id));

  // Find users who did NOT check in yesterday
  const toReset = users.filter((u) => !checkedIds.has(u.id));
  if (!toReset.length) return 'No streaks to reset';

  // Reset their streaks to 0
  const ids = toReset.map((u) => u.id);
  await fetch(`${SUPABASE_URL}/rest/v1/users?id=in.(${ids.join(',')})`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({ streak_count: 0 }),
  });

  return `Reset streaks for ${toReset.length} users who missed yesterday`;
}

export default {
  async scheduled(event, env, ctx) {
    const resetResult = await runStreakReset();
    console.log('[Cron - Streak Reset]', resetResult);
    const reminderResult = await runDailyReminder();
    console.log('[Cron - Reminder]', reminderResult);
  },

  async fetch(request, env, ctx) {
    const path = new URL(request.url).pathname;
    if (request.method === 'GET' && path === '/trigger') {
      const resetResult = await runStreakReset();
      const reminderResult = await runDailyReminder();
      return new Response(`${resetResult}\n${reminderResult}`, { status: 200 });
    }
    if (request.method === 'GET' && path === '/reset') {
      const result = await runStreakReset();
      return new Response(result, { status: 200 });
    }
    return new Response('SideQuest Worker OK', { status: 200 });
  },
};
