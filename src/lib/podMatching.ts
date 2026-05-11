import { supabase } from './supabase';

function getUtcOffsetHours(timezone: string): number {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'shortOffset',
    });
    const parts = formatter.formatToParts(now);
    const offsetPart = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'UTC+0';
    const match = offsetPart.match(/UTC([+-]\d+(?::\d+)?)?/);
    if (!match || !match[1]) return 0;
    const [hours, minutes = '0'] = match[1].split(':');
    return parseInt(hours, 10) + parseInt(minutes, 10) / 60;
  } catch {
    return 0;
  }
}

function timezoneCompatible(tz1: string, tz2: string): boolean {
  const diff = Math.abs(getUtcOffsetHours(tz1) - getUtcOffsetHours(tz2));
  return diff <= 3;
}

export async function getOrCreatePod(userId: string, lifeChapter: string): Promise<string | null> {
  // Check if user already has a pod
  const { data: existing } = await supabase
    .from('pod_members')
    .select('pod_id')
    .eq('user_id', userId)
    .maybeSingle();
  if (existing?.pod_id) return existing.pod_id;

  // Get user's timezone
  const { data: userData } = await supabase
    .from('users')
    .select('timezone')
    .eq('id', userId)
    .single();
  const userTimezone = userData?.timezone || 'UTC';

  // Find candidate pods with same chapter that have room
  const { data: candidatePods } = await supabase
    .from('pods')
    .select(`
      id,
      max_members,
      pod_members (
        count,
        users ( timezone )
      )
    `)
    .eq('life_chapter', lifeChapter)
    .eq('is_active', true);

  const openPods = (candidatePods || []).filter((pod) => {
    const memberCount = (pod.pod_members as unknown as { count: number }[])[0]?.count ?? 0;
    return memberCount < pod.max_members;
  });

  // Score each pod by timezone compatibility
  let bestPod: any = null;
  let bestScore = -1;

  for (const pod of openPods) {
    const members = pod.pod_members as unknown as { users: { timezone: string } | null }[];
    const timezones = members.map((m) => m.users?.timezone || 'UTC');
    const compatibleCount = timezones.filter((tz) => timezoneCompatible(tz, userTimezone)).length;
    const score = timezones.length === 0 ? 1 : compatibleCount / timezones.length;
    if (score > bestScore) {
      bestScore = score;
      bestPod = pod;
    }
  }

  if (bestPod) {
    await supabase.from('pod_members').insert({
      pod_id: bestPod.id,
      user_id: userId,
      role: 'member',
    });
    return bestPod.id;
  }

  // Create a new pod
  const { data: newPod } = await supabase
    .from('pods')
    .insert({
      name: `${lifeChapter} Pod`,
      life_chapter: lifeChapter,
      mission_statement: `A 30-day ${lifeChapter} mission pod.`,
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: true,
      max_members: 8,
    })
    .select()
    .single();
  if (!newPod) return null;

  await supabase.from('pod_members').insert({
    pod_id: newPod.id,
    user_id: userId,
    role: 'leader',
  });
  return newPod.id;
}

export async function getUserPod(userId: string) {
  const { data } = await supabase
    .from('pod_members')
    .select(`
      pod_id,
      role,
      pods (
        id,
        name,
        life_chapter,
        mission_statement,
        start_date,
        end_date,
        is_active
      )
    `)
    .eq('user_id', userId)
    .maybeSingle();
  return data;
}

export async function getPodMembers(podId: string) {
  const { data } = await supabase
    .from('pod_members')
    .select(`
      user_id,
      role,
      joined_at,
      users (
        id,
        full_name,
        avatar_url,
        streak_count,
        goal_statement,
        life_chapter
      )
    `)
    .eq('pod_id', podId);
  return data || [];
}

export async function getPodCheckIns(podId: string) {
  const { data } = await supabase
    .from('check_ins')
    .select(`
      id,
      user_id,
      check_in_date,
      reflection,
      mood_score,
      streak_day,
      created_at,
      users (
        full_name,
        avatar_url
      )
    `)
    .eq('pod_id', podId)
    .order('created_at', { ascending: false })
    .limit(20);
  return data || [];
}
