import React, { useEffect, useState } from 'react';
import { BrainCircuit, Activity, Sparkles, Send, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { getUserPod, getPodMembers } from '../../lib/podMatching';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface UserStats {
  streak_count: number;
  life_chapter: string;
  goal_statement: string;
  full_name: string;
}

interface CheckInSummary {
  total: number;
  avgMood: number;
  recentReflections: string[];
}

export default function AICoach() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [checkInSummary, setCheckInSummary] = useState<CheckInSummary | null>(null);
  const [podSize, setPodSize] = useState(0);
  const [weeklyInsight, setWeeklyInsight] = useState<string>('');
  const [insightLoaded, setInsightLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadContext();
  }, [user]);

  async function loadContext() {
    const { data: profile } = await supabase
      .from('users')
      .select('streak_count, life_chapter, goal_statement, full_name')
      .eq('id', user!.id)
      .single();

    if (profile) setUserStats(profile);

    const { data: checkIns } = await supabase
      .from('check_ins')
      .select('mood_score, reflection')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(7);

    if (checkIns && checkIns.length > 0) {
      const moods = checkIns.filter(c => c.mood_score).map(c => c.mood_score as number);
      const avgMood = moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0;
      const reflections = checkIns
        .filter(c => c.reflection)
        .map(c => c.reflection as string)
        .slice(0, 3);
      setCheckInSummary({ total: checkIns.length, avgMood, recentReflections: reflections });
    }

    const pod = await getUserPod(user!.id);
    if (pod?.pod_id) {
      const members = await getPodMembers(pod.pod_id);
      setPodSize(members.length);
    }
  }

  function buildSystemPrompt(stats: UserStats, summary: CheckInSummary | null, podMembers: number) {
    return `You are an elite AI accountability coach for SIDEQUEST, a 30-day mission pod app.

USER CONTEXT:
- Name: ${stats.full_name}
- Current Chapter: ${stats.life_chapter}
- Goal: ${stats.goal_statement || 'Not set'}
- Current Streak: ${stats.streak_count} days
- Pod Size: ${podMembers} members
- Check-ins this week: ${summary?.total || 0}
- Average mood score: ${summary?.avgMood ? summary.avgMood.toFixed(1) : 'N/A'}/5
- Recent reflections: ${summary?.recentReflections?.join(' | ') || 'None yet'}

YOUR ROLE:
- Be direct, warm, and motivating
- Give specific, actionable advice based on their actual data
- Reference their streak and mood trends
- Keep responses concise (2-4 sentences max unless asked for more)
- Never be generic. Always personalise to their chapter and goal.`;
  }

  async function generateWeeklyInsight() {
    if (!userStats) return;
    setLoadingInsight(true);

    const systemPrompt = buildSystemPrompt(userStats, checkInSummary, podSize);
    const prompt = `Give me a personalised weekly insight for ${userStats.full_name}. 
    Analyse their ${checkInSummary?.total || 0} check-ins, average mood of ${checkInSummary?.avgMood?.toFixed(1) || 'unknown'}/5, 
    and ${userStats.streak_count}-day streak in the ${userStats.life_chapter} chapter. 
    Be specific, encouraging, and give one concrete tip for the week ahead. 
    Keep it to 3-4 sentences.`;

    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          systemPrompt,
          messages: [{ role: 'user', content: prompt }],
        },
      });
      if (error) throw error;
      const text = data?.text || 'Unable to generate insight right now.';
      setWeeklyInsight(text);
      setInsightLoaded(true);
    } catch {
      setWeeklyInsight('Unable to connect to AI Coach right now. Check back soon.');
      setInsightLoaded(true);
    }

    setLoadingInsight(false);
  }

  async function sendMessage() {
    if (!input.trim() || !userStats || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const systemPrompt = buildSystemPrompt(userStats, checkInSummary, podSize);

    try {
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          systemPrompt,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        },
      });
      if (error) throw error;
      const text = data?.text || 'I could not generate a response. Try again.';
      setMessages([...newMessages, { role: 'assistant', content: text }]);
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: 'Connection error. Please try again.',
      }]);
    }

    setLoading(false);
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-2">AI Coach</h1>
          <p className="text-text-secondary">Intelligence that cares about your momentum.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.15)]">
          <BrainCircuit className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Insight */}
        <div className="glass-card p-8 rounded-3xl border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-medium text-white">Weekly Insight</h2>
            </div>
            <button
              onClick={generateWeeklyInsight}
              disabled={loadingInsight}
              className="btn-gold gap-2 px-4 py-2 text-sm"
            >
              <RefreshCw className={`w-3 h-3 ${loadingInsight ? 'animate-spin' : ''}`} />
              {insightLoaded ? 'Refresh' : 'Generate'}
            </button>
          </div>

          <div className="relative z-10">
            {loadingInsight ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/5 rounded animate-pulse w-full" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-4/5" />
                <div className="h-4 bg-white/5 rounded animate-pulse w-3/5" />
              </div>
            ) : weeklyInsight ? (
              <p className="text-text-secondary leading-relaxed">{weeklyInsight}</p>
            ) : (
              <div className="text-center py-4">
                <p className="text-text-secondary text-sm mb-2">
                  Get a personalised insight based on your check-ins and streak.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-white" />
            <h2 className="text-lg font-medium text-white">Your Stats</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-surface border border-white/5">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">
                Current Streak
              </p>
              <p className="text-2xl font-serif text-white">
                {userStats?.streak_count || 0} days
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-white/5">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">
                Avg Mood
              </p>
              <p className="text-2xl font-serif text-white">
                {checkInSummary?.avgMood
                  ? `${checkInSummary.avgMood.toFixed(1)}/5`
                  : '—'}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-white/5">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">
                Check-ins
              </p>
              <p className="text-2xl font-serif text-white">
                {checkInSummary?.total || 0}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-white/5">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-2">
                Pod Members
              </p>
              <p className="text-2xl font-serif text-white">{podSize}</p>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-medium text-white">Ask Your Coach</h2>
            <p className="text-sm text-text-secondary mt-1">
              Ask anything about your progress, habits, or strategy.
            </p>
          </div>

          {/* Messages */}
          <div className="p-6 space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-muted text-sm">
                  Try: "How is my streak looking?" or "Give me motivation for today"
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary/20 text-white border border-primary/20'
                        : 'bg-surface text-text-secondary border border-white/5'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-white/5 px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-white/5">
            <div className="flex gap-3">
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask your coach anything..."
                rows={1}
                className="input-field resize-none overflow-hidden min-h-[48px] max-h-[160px]"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="btn-gold px-4 py-3"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
