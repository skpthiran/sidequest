import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion } from 'motion/react';
import { CheckCircle2, Flame, Target, BrainCircuit, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfile {
  full_name: string;
  life_chapter: string;
  goal_statement: string;
  streak_count: number;
  is_onboarded: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showCheckIn, setShowCheckIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [reflection, setReflection] = useState('');
  const [moodScore, setMoodScore] = useState<number>(3);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user]);

  async function loadDashboardData() {
    setLoading(true);

    // Load user profile
    const { data: profileData } = await supabase
      .from('users')
      .select('full_name, life_chapter, goal_statement, streak_count, is_onboarded')
      .eq('id', user!.id)
      .single();

    if (profileData) {
      setProfile(profileData);
      setStreakCount(profileData.streak_count);

      if (profileData.streak_count >= 30) {
        navigate('/app/graduation');
        return;
      }
    }


    // Check if already checked in today
    const today = new Date().toISOString().split('T')[0];
    const { data: checkInData } = await supabase
      .from('check_ins')
      .select('id')
      .eq('user_id', user!.id)
      .eq('check_in_date', today)
      .maybeSingle();

    if (checkInData) setCheckedIn(true);

    setLoading(false);
  }

  async function handleSubmitCheckIn() {
    if (!user) return;
    setSaving(true);
    setError(null);

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if user checked in yesterday
    const { data: yesterdayData } = await supabase
      .from('check_ins')
      .select('id')
      .eq('user_id', user.id)
      .eq('check_in_date', yesterday)
      .maybeSingle();

    const newStreak = yesterdayData ? streakCount + 1 : 1;

    const { error: checkInError } = await supabase
      .from('check_ins')
      .insert({
        user_id: user.id,
        check_in_date: today,
        reflection: reflection,
        mood_score: moodScore,
        is_complete: true,
        streak_day: newStreak,
      });

    if (checkInError) {
      setError(checkInError.message);
      setSaving(false);
      return;
    }

    await supabase
      .from('users')
      .update({ streak_count: newStreak })
      .eq('id', user.id);

    setStreakCount(newStreak);
    setCheckedIn(true);
    setShowCheckIn(false);
    setSaving(false);
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Quester';
  const chapter = profile?.life_chapter || 'Your Chapter';
  const goal = profile?.goal_statement || 'Set your goal in onboarding.';
  const progressPercent = Math.min(Math.round((streakCount / 30) * 100), 100);
  const daysLeft = Math.max(30 - streakCount, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Welcome & Streak */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-2">{chapter}</h1>
          <p className="text-text-secondary">
            Day {streakCount} of 30 • Welcome back, {firstName}
          </p>
        </div>
        <div className="glass-card px-6 py-4 rounded-2xl flex items-center gap-4 border-accent-amber/20 glow-amber">
          <div className="w-12 h-12 rounded-full bg-accent-amber/10 flex items-center justify-center">
            <Flame className="w-6 h-6 text-accent-amber" />
          </div>
          <div>
            <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">
              Streak
            </p>
            <p className="text-2xl font-serif text-white">{streakCount} Days</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Action Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Action */}
          <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium text-white">Today's Mission</h2>
              </div>

              <p className="text-2xl font-serif text-white mb-8">{goal}</p>

              {!checkedIn ? (
                <button
                  onClick={() => setShowCheckIn(true)}
                  className="btn-primary w-full sm:w-auto gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Check In Now
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  <CheckCircle2 className="w-5 h-5" />
                  Checked in for today ✓
                </div>
              )}
            </div>
          </div>

          {/* Pod Activity Placeholder */}
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Pod Activity</h3>
              <button className="text-sm text-text-secondary hover:text-white transition-colors">
                View All
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-white/5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Pod matching in progress</p>
                  <p className="text-xs text-text-secondary">
                    You'll be matched with 4–7 peers starting the same chapter.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Coach Snippet */}
          <div className="glass-card p-6 rounded-3xl border-primary/10">
            <div className="flex items-center gap-3 mb-4">
              <BrainCircuit className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-medium text-white uppercase tracking-wider">
                AI Coach
              </h3>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed mb-4">
              Keep building your streak. The AI Coach unlocks after your first 3 check-ins 
              to give you personalised insights.
            </p>
            <button className="text-sm text-primary hover:text-white transition-colors flex items-center gap-1 font-medium">
              Coming soon <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Ring */}
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-6">
              Your Progress
            </h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="8"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * progressPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="block text-2xl font-serif text-white">
                    {progressPercent}%
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-serif text-white">{streakCount}</p>
                <p className="text-xs text-text-secondary uppercase tracking-wider">
                  Days Done
                </p>
              </div>
              <div>
                <p className="text-2xl font-serif text-white">{daysLeft}</p>
                <p className="text-xs text-text-secondary uppercase tracking-wider">
                  Days Left
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Check-in Modal */}
      {showCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-card p-8 rounded-3xl border-white/10 shadow-2xl relative"
          >
            <button
              onClick={() => setShowCheckIn(false)}
              className="absolute top-6 right-6 text-text-secondary hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-2xl text-white mb-6">Daily Check-in</h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Mood Score */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-3 uppercase tracking-wider">
                  How are you feeling? (1–5)
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      onClick={() => setMoodScore(score)}
                      className={cn(
                        "w-12 h-12 rounded-full border font-medium transition-all",
                        moodScore === score
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-surface border-white/10 text-text-secondary hover:border-white/30"
                      )}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reflection */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
                  Reflection
                </label>
                <textarea
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="input-field min-h-[100px] resize-none"
                  placeholder="How did it go today?"
                />
              </div>

              <button
                onClick={handleSubmitCheckIn}
                disabled={saving}
                className="btn-primary w-full"
              >
                {saving ? 'Saving...' : 'Submit Check-in'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
