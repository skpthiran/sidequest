import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, Flame, Star, ArrowRight, RotateCcw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface GradStats {
  full_name: string;
  life_chapter: string;
  goal_statement: string;
  streak_count: number;
  total_check_ins: number;
  avg_mood: number;
  pod_name: string;
}

export default function Graduation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<GradStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadStats();
  }, [user]);

  async function loadStats() {
    const { data: profile } = await supabase
      .from('users')
      .select('full_name, life_chapter, goal_statement, streak_count')
      .eq('id', user!.id)
      .single();

    const { data: checkIns } = await supabase
      .from('check_ins')
      .select('mood_score')
      .eq('user_id', user!.id);

    const { data: podMember } = await supabase
      .from('pod_members')
      .select('pods ( name )')
      .eq('user_id', user!.id)
      .maybeSingle();

    const moods = (checkIns || [])
      .filter(c => c.mood_score)
      .map(c => c.mood_score as number);
    const avgMood = moods.length > 0
      ? moods.reduce((a, b) => a + b, 0) / moods.length
      : 0;

    const podData = podMember?.pods;
    const podName = Array.isArray(podData)
      ? podData[0]?.name
      : (podData as any)?.name || 'Your Pod';

    setStats({
      full_name: profile?.full_name || 'Quester',
      life_chapter: profile?.life_chapter || 'Your Chapter',
      goal_statement: profile?.goal_statement || '',
      streak_count: profile?.streak_count || 30,
      total_check_ins: checkIns?.length || 0,
      avg_mood: avgMood,
      pod_name: podName,
    });

    setLoading(false);
  }

  async function handleStartNewMission() {
    if (!user) return;
    setResetting(true);

    // Reset streak and onboarding flag to send user through onboarding again
    await supabase
      .from('users')
      .update({
        streak_count: 0,
        is_onboarded: false,
        life_chapter: 'general',
        goal_statement: null,
      })
      .eq('id', user.id);

    // Remove from current pod
    await supabase
      .from('pod_members')
      .delete()
      .eq('user_id', user.id);

    setResetting(false);
    navigate('/onboarding');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Confetti-like stars */}
        <div className="flex justify-center gap-3 mb-8">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -20, rotate: -30 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Star className="w-5 h-5 text-primary fill-primary" />
            </motion.div>
          ))}
        </div>

        {/* Trophy */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="flex justify-center mb-8"
        >
          <div className="w-28 h-28 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.3)]">
            <Trophy className="w-14 h-14 text-primary" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="font-serif text-4xl text-white mb-3">
            Mission Complete
          </h1>
          <p className="text-text-secondary text-lg">
            You did it, {stats?.full_name?.split(' ')[0]}. 30 days of{' '}
            <span className="text-primary">{stats?.life_chapter}</span>.
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-3xl border-primary/20 mb-6"
        >
          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-serif text-white">{stats?.streak_count}</p>
              <p className="text-xs text-text-muted uppercase tracking-wider mt-1">
                Day Streak
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-serif text-white">{stats?.total_check_ins}</p>
              <p className="text-xs text-text-muted uppercase tracking-wider mt-1">
                Check-ins
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-serif text-white">
                {stats?.avg_mood ? stats.avg_mood.toFixed(1) : '—'}
              </p>
              <p className="text-xs text-text-muted uppercase tracking-wider mt-1">
                Avg Mood
              </p>
            </div>
          </div>

          {stats?.goal_statement && (
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">
                Your Goal Was
              </p>
              <p className="text-text-secondary text-sm italic">
                "{stats.goal_statement}"
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-white/5 mt-4">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
              Pod
            </p>
            <p className="text-white text-sm font-medium">{stats?.pod_name}</p>
          </div>
        </motion.div>

        {/* Share text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center mb-8"
        >
          <p className="text-text-secondary text-sm">
            You've proven you can commit for 30 days straight. <br />
            <span className="text-white">What's your next chapter?</span>
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={handleStartNewMission}
            disabled={resetting}
            className="btn-primary w-full gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {resetting ? 'Starting...' : 'Start a New Mission'}
          </button>
          <button
            onClick={() => navigate('/app')}
            className="btn-ghost w-full gap-2"
          >
            Back to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
