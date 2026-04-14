import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { getUserPod, getPodMembers } from '../../lib/podMatching';

interface MemberProgress {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  streak_count: number;
  history: (boolean | null)[];
}

export default function ProgressBoard() {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasPod, setHasPod] = useState(false);
  const [podStartDate, setPodStartDate] = useState<string>('');

  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    if (!user) return;
    loadProgressData();
  }, [user]);

  async function loadProgressData() {
    setLoading(true);

    const pod = await getUserPod(user!.id);
    if (!pod?.pod_id) {
      setLoading(false);
      return;
    }

    setHasPod(true);
    const podsData = Array.isArray(pod.pods) ? pod.pods[0] : pod.pods;
    const startDate = podsData?.start_date || new Date().toISOString().split('T')[0];
    setPodStartDate(startDate);

    const podMembers = await getPodMembers(pod.pod_id);

    const memberProgressList: MemberProgress[] = await Promise.all(
      podMembers.map(async (member: any) => {
        const m = Array.isArray(member.users) ? member.users[0] : member.users;

        const { data: checkIns } = await supabase
          .from('check_ins')
          .select('check_in_date')
          .eq('user_id', member.user_id)
          .eq('is_complete', true);

        const checkedDates = new Set(
          (checkIns || []).map((c: any) => c.check_in_date)
        );

        const start = new Date(startDate);
        const today = new Date();

        const history: (boolean | null)[] = Array.from({ length: 30 }, (_, i) => {
          const day = new Date(start);
          day.setDate(start.getDate() + i);
          if (day > today) return null;
          const dateStr = day.toISOString().split('T')[0];
          return checkedDates.has(dateStr);
        });

        return {
          user_id: member.user_id,
          full_name: m?.full_name || 'Member',
          avatar_url: m?.avatar_url || null,
          streak_count: m?.streak_count || 0,
          history,
        };
      })
    );

    memberProgressList.sort((a, b) => {
      if (a.user_id === user!.id) return -1;
      if (b.user_id === user!.id) return 1;
      return b.streak_count - a.streak_count;
    });

    setMembers(memberProgressList);
    setLoading(false);
  }

  const getAvatar = (name: string, url: string | null) =>
    url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;

  const today = new Date();
  const start = podStartDate ? new Date(podStartDate) : today;
  const currentDay = Math.min(
    Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    30
  );

  const podAverage = members.length > 0
    ? Math.round(
        members.reduce((sum, m) => {
          const completed = m.history.filter(h => h === true).length;
          const total = m.history.filter(h => h !== null).length;
          return sum + (total > 0 ? (completed / total) * 100 : 0);
        }, 0) / members.length
      )
    : 0;

  const topStreak = members.length > 0
    ? Math.max(...members.map(m => m.streak_count))
    : 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!hasPod) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="text-5xl">📊</div>
        <h2 className="font-serif text-2xl text-white">No pod yet</h2>
        <p className="text-text-secondary max-w-sm">
          Join a pod from Discover to start tracking progress with your team.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="font-serif text-3xl text-white mb-2">Progress Board</h1>
          <p className="text-text-secondary">Track the pod's consistency over 30 days.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-4 py-3 rounded-xl text-center flex-1">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Pod Average</p>
            <p className="text-lg font-serif text-white">{podAverage}%</p>
          </div>
          <div className="glass-card px-4 py-3 rounded-xl text-center flex-1 border-primary/20">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Top Streak</p>
            <p className="text-lg font-serif text-primary">{topStreak} Days</p>
          </div>
          <div className="glass-card px-4 py-3 rounded-xl text-center flex-1">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Day</p>
            <p className="text-lg font-serif text-white">{currentDay}/30</p>
          </div>
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:block glass-card rounded-3xl overflow-hidden overflow-x-auto">
        <div className="min-w-[800px] p-6">
          <div className="flex items-end mb-6">
            <div className="w-48 shrink-0 pb-2">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                Member
              </span>
            </div>
            <div className="flex-1 flex gap-1">
              {days.map(day => (
                <div key={day} className="flex-1 text-center pb-2">
                  <span className={cn(
                    "text-[10px] font-medium",
                    day === currentDay ? "text-primary" : "text-text-muted"
                  )}>
                    {day}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-24 shrink-0 text-right pb-2">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                Streak
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {members.map((member) => {
              const isMe = member.user_id === user?.id;
              return (
                <div key={member.user_id} className="flex items-center group">
                  <div className="w-48 shrink-0 flex items-center gap-3">
                    <img
                      src={getAvatar(member.full_name, member.avatar_url)}
                      className="w-8 h-8 rounded-full border border-white/10 object-cover"
                      alt={member.full_name}
                    />
                    <span className={cn(
                      "text-sm font-medium",
                      isMe ? "text-white" : "text-text-secondary group-hover:text-white transition-colors"
                    )}>
                      {isMe ? 'You' : member.full_name.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex-1 flex gap-1">
                    {member.history.map((status, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex-1 aspect-square rounded-sm transition-all duration-300",
                          status === true
                            ? "bg-primary/80 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                            : status === false
                            ? "bg-accent-rose/50"
                            : index === currentDay - 1
                            ? "bg-white/10 border border-white/20"
                            : "bg-surface"
                        )}
                      />
                    ))}
                  </div>
                  <div className="w-24 shrink-0 text-right flex items-center justify-end gap-2">
                    <span className="text-sm font-serif text-white">{member.streak_count}</span>
                    <TrendingUp className={cn(
                      "w-3 h-3",
                      member.streak_count > 0 ? "text-emerald-500" : "text-text-muted"
                    )} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {members.map((member) => {
          const isMe = member.user_id === user?.id;
          const completed = member.history.filter(h => h === true).length;
          const total = member.history.filter(h => h !== null).length;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div
              key={member.user_id}
              className={cn(
                "glass-card p-5 rounded-2xl",
                isMe && "border-primary/20"
              )}
            >
              {/* Member Info */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatar(member.full_name, member.avatar_url)}
                    className="w-10 h-10 rounded-full border border-white/10 object-cover"
                    alt={member.full_name}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {isMe ? 'You' : member.full_name.split(' ')[0]}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {member.streak_count} day streak
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-serif text-white">{pct}%</p>
                  <p className="text-xs text-text-muted">consistency</p>
                </div>
              </div>

              {/* Mini dot grid — last 14 days only on mobile */}
              <div>
                <p className="text-xs text-text-muted mb-2">Last 14 days</p>
                <div className="flex gap-1.5">
                  {member.history.slice(-14).map((status, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex-1 h-6 rounded-sm",
                        status === true
                          ? "bg-primary/80"
                          : status === false
                          ? "bg-accent-rose/40"
                          : "bg-surface border border-white/10"
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-text-muted">14 days ago</span>
                  <span className="text-[10px] text-text-muted">Today</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span>Mission progress</span>
                  <span>{completed}/{total} days</span>
                </div>
                <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
