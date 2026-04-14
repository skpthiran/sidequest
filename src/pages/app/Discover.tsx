import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Zap, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { getOrCreatePod, getUserPod } from '../../lib/podMatching';
import { cn } from '@/lib/utils';

const chapters = [
  { name: "Fitness Discipline", emoji: "💪", desc: "Build your body, build discipline." },
  { name: "Study Grind", emoji: "📚", desc: "Lock in. Academic excellence awaits." },
  { name: "Career Focus", emoji: "🚀", desc: "Level up your professional game." },
  { name: "Breakup Recovery", emoji: "💔", desc: "Heal, grow, and move forward." },
  { name: "Dopamine Detox", emoji: "🧘", desc: "Reclaim your focus and clarity." },
  { name: "Sleep Reset", emoji: "🌙", desc: "Fix your sleep, fix your life." },
];

interface ChapterCount {
  life_chapter: string;
  count: number;
}

export default function Discover() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userChapter, setUserChapter] = useState<string>('');
  const [chapterCounts, setChapterCounts] = useState<ChapterCount[]>([]);
  const [hasPod, setHasPod] = useState(false);
  const [joining, setJoining] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);

    const { data: profile } = await supabase
      .from('users')
      .select('life_chapter')
      .eq('id', user!.id)
      .single();

    if (profile) setUserChapter(profile.life_chapter);

    const pod = await getUserPod(user!.id);
    if (pod?.pod_id) setHasPod(true);

    // Count users per chapter
    const { data: counts } = await supabase
      .from('users')
      .select('life_chapter')
      .eq('is_onboarded', true);

    if (counts) {
      const tally: Record<string, number> = {};
      counts.forEach(({ life_chapter }) => {
        if (life_chapter) tally[life_chapter] = (tally[life_chapter] || 0) + 1;
      });
      setChapterCounts(
        Object.entries(tally).map(([life_chapter, count]) => ({ life_chapter, count }))
      );
    }

    setLoading(false);
  }

  async function handleJoinPod() {
    if (!user || !userChapter) return;
    setJoining(true);
    const podId = await getOrCreatePod(user.id, userChapter);
    if (podId) {
      setHasPod(true);
      navigate('/app/pod');
    }
    setJoining(false);
  }

  const getMemberCount = (chapter: string) =>
    chapterCounts.find((c) => c.life_chapter === chapter)?.count || 0;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div>
        <h1 className="font-serif text-3xl text-white mb-2">Discover</h1>
        <p className="text-text-secondary">Find your chapter. Join your pod.</p>
      </div>

      {/* Your Chapter CTA */}
      {userChapter && (
        <div className="glass-card p-6 rounded-3xl border-primary/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-text-secondary mb-1">Your current chapter</p>
              <h2 className="text-xl font-medium text-white">{userChapter}</h2>
              <p className="text-sm text-text-secondary mt-1">
                {getMemberCount(userChapter)} people in this chapter
              </p>
            </div>
            {hasPod ? (
              <button
                onClick={() => navigate('/app/pod')}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium"
              >
                <CheckCircle2 className="w-4 h-4" />
                View Your Pod
              </button>
            ) : (
              <button
                onClick={handleJoinPod}
                disabled={joining}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-background font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                {joining ? 'Matching...' : 'Join a Pod Now'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* All Chapters */}
      <div>
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">
          All Chapters
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => {
            const count = getMemberCount(chapter.name);
            const isYours = chapter.name === userChapter;
            return (
              <div
                key={chapter.name}
                className={cn(
                  "glass-card p-6 rounded-2xl border transition-all",
                  isYours
                    ? "border-primary/30 bg-primary/5"
                    : "border-white/5 hover:border-white/20"
                )}
              >
                <div className="text-3xl mb-3">{chapter.emoji}</div>
                <h3 className="font-medium text-white mb-1">{chapter.name}</h3>
                <p className="text-xs text-text-secondary mb-3">{chapter.desc}</p>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Users className="w-3 h-3" />
                  <span>{count} {count === 1 ? 'person' : 'people'} active</span>
                  {isYours && (
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-medium">
                      Yours
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
