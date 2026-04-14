import React, { useEffect, useRef, useState } from 'react';
import { Camera, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileData {
  full_name: string;
  bio: string;
  life_chapter: string;
  goal_statement: string;
  streak_count: number;
  is_verified: boolean;
  avatar_url: string | null;
}

const chapters = [
  "Fitness Discipline", "Study Grind", "Career Focus",
  "Breakup Recovery", "Dopamine Detox", "Sleep Reset"
];

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Editable fields
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [goalStatement, setGoalStatement] = useState('');
  const [lifeChapter, setLifeChapter] = useState('');

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  async function loadProfile() {
    const { data } = await supabase
      .from('users')
      .select('full_name, bio, life_chapter, goal_statement, streak_count, is_verified, avatar_url')
      .eq('id', user!.id)
      .single();

    if (data) {
      setProfile(data);
      setFullName(data.full_name || '');
      setBio(data.bio || '');
      setGoalStatement(data.goal_statement || '');
      setLifeChapter(data.life_chapter || '');
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        bio: bio,
        goal_statement: goalStatement,
        life_chapter: lifeChapter,
      })
      .eq('id', user.id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    await loadProfile();
    setEditing(false);
    setSuccess(true);
    setSaving(false);
    setTimeout(() => setSuccess(false), 3000);
  }

  function handleCancel() {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
      setGoalStatement(profile.goal_statement || '');
      setLifeChapter(profile.life_chapter || '');
    }
    setEditing(false);
    setError(null);
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);
      await supabase.from('users').update({ avatar_url: publicUrl }).eq('id', user.id);
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : prev);
    } catch (err: any) {
      setError(err.message || 'Avatar upload failed');
    } finally {
      setUploadingAvatar(false);
    }
  }

  const avatarUrl = profile?.avatar_url ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || 'SQ'}`;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-white">Your Profile</h1>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="btn-ghost px-5 py-2 text-sm"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="btn-ghost px-4 py-2 text-sm gap-1"
            >
              <X className="w-4 h-4" /> Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-gold px-5 py-2 text-sm gap-1"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          ✓ Profile updated successfully
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Avatar + Name */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-20 h-20 rounded-full border-2 border-white/10 object-cover"
            />
            {editing && (
              <div
                className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingAvatar
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Camera className="w-5 h-5 text-white" />
                }
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>
          <div className="flex-1">
            {editing ? (
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field text-lg font-medium mb-2"
                placeholder="Your full name"
              />
            ) : (
              <h2 className="text-xl font-medium text-white mb-1">
                {profile?.full_name}
              </h2>
            )}
            <p className="text-sm text-text-secondary">{user?.email}</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
            Bio
          </label>
          {editing ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="input-field resize-none min-h-[80px]"
              placeholder="Tell your pod about yourself..."
            />
          ) : (
            <p className="text-text-secondary text-sm">
              {profile?.bio || 'No bio yet. Click Edit Profile to add one.'}
            </p>
          )}
        </div>
      </div>

      {/* Mission Info */}
      <div className="glass-card p-6 rounded-3xl space-y-5">
        <h3 className="text-sm font-medium text-white uppercase tracking-wider">
          Current Mission
        </h3>

        {/* Life Chapter */}
        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
            Chapter
          </label>
          {editing ? (
            <select
              value={lifeChapter}
              onChange={(e) => setLifeChapter(e.target.value)}
              className="input-field appearance-none"
            >
              {chapters.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          ) : (
            <p className="text-white font-medium">{profile?.life_chapter}</p>
          )}
        </div>

        {/* Goal Statement */}
        <div>
          <label className="block text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
            Goal
          </label>
          {editing ? (
            <textarea
              value={goalStatement}
              onChange={(e) => setGoalStatement(e.target.value)}
              className="input-field resize-none min-h-[80px]"
              placeholder="What does success look like in 30 days?"
            />
          ) : (
            <p className="text-text-secondary text-sm">
              {profile?.goal_statement || '—'}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="glass-card p-6 rounded-3xl">
        <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-4">
          Stats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface rounded-2xl p-4 text-center">
            <p className="text-2xl font-serif text-white">{profile?.streak_count || 0}</p>
            <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">
              Current Streak
            </p>
          </div>
          <div className="bg-surface rounded-2xl p-4 text-center">
            <p className="text-2xl font-serif text-white">30</p>
            <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">
              Mission Days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
