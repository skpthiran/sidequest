import { supabase } from './supabase';

export async function getOrCreatePod(userId: string, lifeChapter: string): Promise<string | null> {
  // Check if user already has a pod
  const { data: existing } = await supabase
    .from('pod_members')
    .select('pod_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing?.pod_id) return existing.pod_id;

  // Find an active pod with same chapter that has room
  const { data: availablePod } = await supabase
    .from('pods')
    .select('id, pod_members(count)')
    .eq('life_chapter', lifeChapter)
    .eq('is_active', true)
    .lt('max_members', 9)
    .maybeSingle();

  if (availablePod) {
    await supabase.from('pod_members').insert({
      pod_id: availablePod.id,
      user_id: userId,
      role: 'member',
    });
    return availablePod.id;
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
