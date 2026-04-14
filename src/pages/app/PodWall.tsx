import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Flame, Send } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserPod, getPodMembers } from '../../lib/podMatching';
import { supabase } from '../../lib/supabase';
import { cn } from '@/lib/utils';

interface PodMember {
  user_id: string;
  role: string;
  users: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    streak_count: number;
    goal_statement: string | null;
    life_chapter: string;
  };
}

interface CheckIn {
  id: string;
  user_id: string;
  check_in_date: string;
  reflection: string | null;
  mood_score: number | null;
  streak_day: number;
  created_at: string;
  users: {
    full_name: string;
    avatar_url: string | null;
  };
}

interface Message {
  id: string;
  pod_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  users: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export default function PodWall() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [podData, setPodData] = useState<any>(null);
  const [members, setMembers] = useState<PodMember[]>([]);
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasPod, setHasPod] = useState(false);
  const [podId, setPodId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadPodData();
  }, [user]);

  useEffect(() => {
    if (!podId) return;

    // Subscribe to realtime messages
    const channel = supabase
      .channel(`pod-chat-${podId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `pod_id=eq.${podId}`,
        },
        async (payload) => {
          // Fetch sender info for the new message
          const { data: userData } = await supabase
            .from('users')
            .select('full_name, avatar_url')
            .eq('id', payload.new.sender_id)
            .single();

          const newMsg: Message = {
            ...(payload.new as any),
            users: userData || null,
          };

          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [podId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadPodData() {
    setLoading(true);

    const pod = await getUserPod(user!.id);

    if (!pod?.pod_id) {
      setHasPod(false);
      setLoading(false);
      return;
    }

    setHasPod(true);
    setPodData(pod);
    setPodId(pod.pod_id);

    const podMembers = await getPodMembers(pod.pod_id);
    const formattedMembers = (podMembers as any[]).map(m => ({
      ...m,
      users: Array.isArray(m.users) ? m.users[0] : m.users
    }));
    setMembers(formattedMembers as PodMember[]);

    const memberIds = formattedMembers.map((m: any) => m.user_id);
    const today = new Date().toISOString().split('T')[0];

    const { data: recentCheckIns } = await supabase
      .from('check_ins')
      .select(`
        id, user_id, check_in_date, reflection, mood_score, streak_day, created_at,
        users ( full_name, avatar_url )
      `)
      .in('user_id', memberIds)
      .order('created_at', { ascending: false })
      .limit(20);

    if (recentCheckIns) {
      const formattedCheckIns = (recentCheckIns as any[]).map(c => ({
        ...c,
        users: Array.isArray(c.users) ? c.users[0] : c.users
      }));
      setCheckIns(formattedCheckIns as CheckIn[]);
    }

    // Load existing messages
    const { data: existingMessages } = await supabase
      .from('messages')
      .select(`
        id, pod_id, sender_id, content, created_at,
        users ( full_name, avatar_url )
      `)
      .eq('pod_id', pod.pod_id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (existingMessages) {
      const formattedMessages = (existingMessages as any[]).map(m => ({
        ...m,
        users: Array.isArray(m.users) ? m.users[0] : m.users
      }));
      setMessages(formattedMessages as Message[]);
    }

    setLoading(false);
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !user || !podId || sending) return;
    setSending(true);

    const { error } = await supabase
      .from('messages')
      .insert({
        pod_id: podId,
        sender_id: user.id,
        content: newMessage.trim(),
      });

    if (!error) setNewMessage('');
    setSending(false);
  }

  const getAvatar = (name: string, url: string | null) =>
    url || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`;

  const today = new Date().toISOString().split('T')[0];

  const checkedInToday = new Set(
    checkIns.filter((c) => c.check_in_date === today).map((c) => c.user_id)
  );

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
        <div className="text-5xl">🏕️</div>
        <h2 className="font-serif text-2xl text-white">You're not in a pod yet</h2>
        <p className="text-text-secondary max-w-sm">
          Head to Discover to join a pod with people on the same chapter as you.
        </p>
        <button
          onClick={() => navigate('/app/discover')}
          className="px-6 py-3 rounded-full bg-white text-background font-medium hover:bg-gray-100 transition-colors"
        >
          Go to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Pod Header */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-serif text-2xl text-white mb-1">
              {podData?.pods?.name || 'Your Pod'}
            </h1>
            <p className="text-text-secondary text-sm">
              {members.length} members · {podData?.pods?.life_chapter}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Active</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {members.map((member) => {
            const m = member.users;
            const checkedIn = checkedInToday.has(member.user_id);
            return (
              <div key={member.user_id} className="flex flex-col items-center gap-1">
                <div className="relative">
                  <img
                    src={getAvatar(m.full_name, m.avatar_url)}
                    alt={m.full_name}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 object-cover",
                      checkedIn ? "border-emerald-400" : "border-white/10"
                    )}
                  />
                  {checkedIn && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-background" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-text-secondary truncate w-14 text-center">
                  {m.full_name.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pod Chat */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-medium text-white uppercase tracking-wider">
            Pod Chat
          </h3>
          <p className="text-xs text-text-secondary mt-1">Messages are live — no refresh needed</p>
        </div>

        {/* Messages */}
        <div className="p-5 space-y-4 min-h-[200px] max-h-[400px] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-text-muted text-sm">No messages yet. Say hi to your pod! 👋</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              const name = msg.users?.full_name || 'Member';
              const avatar = getAvatar(name, msg.users?.avatar_url || null);
              return (
                <div key={msg.id} className={cn("flex gap-3", isMe && "flex-row-reverse")}>
                  {!isMe && (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-8 h-8 rounded-full border border-white/10 object-cover flex-shrink-0 mt-1"
                    />
                  )}
                  <div className={cn("max-w-[75%] space-y-1", isMe && "items-end flex flex-col")}>
                    {!isMe && (
                      <span className="text-xs text-text-muted px-1">{name.split(' ')[0]}</span>
                    )}
                    <div className={cn(
                      "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                      isMe
                        ? "bg-primary/20 text-white border border-primary/20 rounded-tr-sm"
                        : "bg-surface text-text-secondary border border-white/5 rounded-tl-sm"
                    )}>
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-text-muted px-1">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Message your pod..."
              className="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
              className="px-4 py-3 rounded-xl bg-primary/20 border border-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Check-in Feed */}
      <div>
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-4">
          Recent Activity
        </h3>

        {checkIns.length === 0 ? (
          <div className="glass-card p-8 rounded-3xl text-center">
            <div className="text-3xl mb-3">🌅</div>
            <p className="text-white font-medium mb-1">No check-ins yet</p>
            <p className="text-text-secondary text-sm">Be the first to check in today!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {checkIns.map((checkIn) => {
              const name = checkIn.users?.full_name || 'Member';
              const avatar = getAvatar(name, checkIn.users?.avatar_url || null);
              const isToday = checkIn.check_in_date === today;
              return (
                <div key={checkIn.id} className="glass-card p-5 rounded-2xl">
                  <div className="flex items-start gap-4">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-10 h-10 rounded-full border border-white/10 object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{name}</span>
                        <span className="text-xs text-text-muted">
                          {isToday ? 'Today' : checkIn.check_in_date}
                        </span>
                        {checkIn.mood_score && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            Mood {checkIn.mood_score}/5
                          </span>
                        )}
                      </div>
                      {checkIn.reflection && (
                        <p className="text-text-secondary text-sm leading-relaxed">
                          "{checkIn.reflection}"
                        </p>
                      )}
                      <div className="flex items-center gap-1 mt-2">
                        <Flame className="w-3 h-3 text-accent-amber" />
                        <span className="text-xs text-text-muted">Day {checkIn.streak_day}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
