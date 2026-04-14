import { supabase } from './supabase';

export async function createInvite(podId: string, inviterId: string, email?: string) {
  const { data, error } = await supabase
    .from('invites')
    .insert({
      pod_id: podId,
      inviter_id: inviterId,
      email: email || null,
    })
    .select('token')
    .single();

  if (error) throw error;
  return `${window.location.origin}/invite/${data.token}`;
}

export async function getInviteByToken(token: string) {
  const { data, error } = await supabase
    .from('invites')
    .select(`
      id,
      token,
      status,
      expires_at,
      pod_id,
      pods (
        id,
        name,
        life_chapter,
        mission_statement,
        pod_members ( count )
      ),
      inviter_id,
      users!invites_inviter_id_fkey (
        full_name,
        avatar_url
      )
    `)
    .eq('token', token)
    .single();

  if (error) throw error;
  return data;
}

export async function acceptInvite(token: string, userId: string) {
  // Get invite
  const { data: invite, error: fetchError } = await supabase
    .from('invites')
    .select('id, pod_id, status, expires_at')
    .eq('token', token)
    .single();

  if (fetchError || !invite) throw new Error('Invite not found');
  if (invite.status !== 'pending') throw new Error('Invite already used or expired');
  if (new Date(invite.expires_at) < new Date()) throw new Error('Invite has expired');

  // Check if user is already in a pod
  const { data: existing } = await supabase
    .from('pod_members')
    .select('pod_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing?.pod_id) throw new Error('You are already in a pod');

  // Join the pod
  const { error: joinError } = await supabase
    .from('pod_members')
    .insert({
      pod_id: invite.pod_id,
      user_id: userId,
      role: 'member',
    });

  if (joinError) throw joinError;

  // Mark invite as accepted
  await supabase
    .from('invites')
    .update({ status: 'accepted' })
    .eq('id', invite.id);

  return invite.pod_id;
}
