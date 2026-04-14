import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = 'BLM_1GQnNPXIWinbD3iqctWpJfEQOnbkWX97Eb1Fmr5A43-2WP9Wjhq31Hfp_jpY1rlSekT0JZE94gEA9ItHf6Y';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map((c) => c.charCodeAt(0)));
}

export async function registerPushNotifications(userId: string): Promise<boolean> {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return false;

    const reg = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const sub = subscription.toJSON();

    await supabase.from('push_subscriptions').upsert({
      user_id: userId,
      endpoint: sub.endpoint,
      p256dh: sub.keys?.p256dh,
      auth: sub.keys?.auth,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    return true;
  } catch (err) {
    console.error('Push registration failed:', err);
    return false;
  }
}

export async function unregisterPushNotifications(userId: string): Promise<void> {
  await supabase.from('push_subscriptions').delete().eq('user_id', userId);
  const reg = await navigator.serviceWorker.getRegistration('/sw.js');
  const sub = await reg?.pushManager.getSubscription();
  await sub?.unsubscribe();
}

export async function isPushEnabled(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('push_subscriptions')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();
  return !!data;
}
