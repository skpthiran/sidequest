import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getInviteByToken, acceptInvite } from '../../lib/invites';
import { useAuth } from '../../contexts/AuthContext';

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    getInviteByToken(token)
      .then(setInvite)
      .catch(() => setError('This invite link is invalid or has expired.'))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleJoin() {
    if (!user) {
      sessionStorage.setItem('pendingInviteToken', token!);
      navigate('/auth');
      return;
    }
    setJoining(true);
    try {
      await acceptInvite(token!, user.id);
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to join pod.');
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-6 text-center space-y-4">
        <div className="text-5xl">⚠️</div>
        <h1 className="font-serif text-2xl">Invite Invalid</h1>
        <p className="text-text-secondary">{error}</p>
        <button onClick={() => navigate('/')} className="btn-primary px-8 py-3 rounded-full">
          Go Home
        </button>
      </div>
    );
  }

  const pod = Array.isArray(invite?.pods) ? invite.pods[0] : invite?.pods;
  const inviter = Array.isArray(invite?.users) ? invite.users[0] : invite?.users;
  const memberCount = (pod?.pod_members as any[])?.[0]?.count ?? 0;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-8 max-w-md w-full space-y-6 text-center"
      >
        <div className="text-4xl">⚔️</div>
        <div>
          <p className="text-text-secondary text-sm mb-1 uppercase tracking-wider">You've been invited to join</p>
          <h1 className="font-serif text-3xl text-white">{pod?.name}</h1>
          <p className="text-sm text-primary mt-1 capitalize">{pod?.life_chapter?.replace('_', ' ')}</p>
        </div>

        {pod?.mission_statement && (
          <p className="text-text-secondary text-sm italic">"{pod.mission_statement}"</p>
        )}

        <div className="flex justify-center gap-6 text-center">
          <div>
            <p className="text-xl font-serif text-white">{memberCount}</p>
            <p className="text-xs text-text-muted uppercase tracking-wider">Members</p>
          </div>
          <div>
            <p className="text-xl font-serif text-white">30</p>
            <p className="text-xs text-text-muted uppercase tracking-wider">Day Mission</p>
          </div>
        </div>

        {inviter && (
          <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
            <img
              src={inviter.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${inviter.full_name}`}
              className="w-6 h-6 rounded-full border border-white/10"
              alt={inviter.full_name}
            />
            <span>Invited by <span className="text-white">{inviter.full_name}</span></span>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          onClick={handleJoin}
          disabled={joining || invite?.status !== 'pending'}
          className="btn-primary w-full py-3 rounded-full text-sm font-medium disabled:opacity-50"
        >
          {joining ? 'Joining...' : invite?.status !== 'pending' ? 'Invite Already Used' : user ? 'Join This Pod' : 'Sign Up to Join'}
        </button>

        <p className="text-xs text-text-muted">
          Invite expires {new Date(invite?.expires_at).toLocaleDateString()}
        </p>
      </motion.div>
    </div>
  );
}
