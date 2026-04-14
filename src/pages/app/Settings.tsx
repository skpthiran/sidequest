import React, { useEffect, useState } from 'react';
import { Shield, Bell, Lock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { signOut } from '../../lib/auth';
import { registerPushNotifications, unregisterPushNotifications, isPushEnabled } from '../../lib/pushNotifications';

const timezones = [
  { label: "Pacific Time (PT)", value: "America/Los_Angeles" },
  { label: "Eastern Time (ET)", value: "America/New_York" },
  { label: "Greenwich Mean Time (GMT)", value: "UTC" },
  { label: "Central European Time (CET)", value: "Europe/Paris" },
  { label: "India Standard Time (IST)", value: "Asia/Kolkata" },
  { label: "Singapore Time (SGT)", value: "Asia/Singapore" },
];

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    if (user) isPushEnabled(user.id).then(setPushEnabled);
  }, [user]);

  const handlePushToggle = async () => {
    if (!user) return;
    if (pushEnabled) {
      await unregisterPushNotifications(user.id);
      setPushEnabled(false);
    } else {
      const ok = await registerPushNotifications(user.id);
      setPushEnabled(ok);
    }
  };

  // Account state
  const [timezone, setTimezone] = useState('UTC');
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountSuccess, setAccountSuccess] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Notification prefs state
  const [notifCheckIn, setNotifCheckIn] = useState(true);
  const [notifPodActivity, setNotifPodActivity] = useState(true);
  const [notifAIInsights, setNotifAIInsights] = useState(true);
  const [savingNotifs, setSavingNotifs] = useState(false);
  const [notifSuccess, setNotifSuccess] = useState(false);

  // Danger zone
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadSettings();
  }, [user]);

  async function loadSettings() {
    const { data } = await supabase
      .from('users')
      .select('timezone, notif_check_in, notif_pod_activity, notif_ai_insights')
      .eq('id', user!.id)
      .single();

    if (data) {
      setTimezone(data.timezone || 'UTC');
      setNotifCheckIn(data.notif_check_in ?? true);
      setNotifPodActivity(data.notif_pod_activity ?? true);
      setNotifAIInsights(data.notif_ai_insights ?? true);
    }
  }

  async function handleSaveAccount() {
    if (!user) return;
    setSavingAccount(true);
    setAccountError(null);

    const { error } = await supabase
      .from('users')
      .update({ timezone })
      .eq('id', user.id);

    if (error) {
      setAccountError(error.message);
    } else {
      setAccountSuccess(true);
      setTimeout(() => setAccountSuccess(false), 3000);
    }
    setSavingAccount(false);
  }

  async function handleChangePassword() {
    if (!user) return;
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setSavingPassword(false);
  }

  async function handleSaveNotifs() {
    if (!user) return;
    setSavingNotifs(true);

    await supabase
      .from('users')
      .update({
        notif_check_in: notifCheckIn,
        notif_pod_activity: notifPodActivity,
        notif_ai_insights: notifAIInsights,
      })
      .eq('id', user.id);

    setNotifSuccess(true);
    setTimeout(() => setNotifSuccess(false), 3000);
    setSavingNotifs(false);
  }

  async function handleSignOut() {
    await signOut();
    navigate('/login');
  }

  async function handleDeleteAccount() {
    if (!confirmDelete || !user) return;
    setDeleting(true);
    // Sign out — full account deletion requires server-side admin API
    // For now we clear their data and sign them out
    await supabase.from('pod_members').delete().eq('user_id', user.id);
    await supabase.from('check_ins').delete().eq('user_id', user.id);
    await supabase.from('messages').delete().eq('sender_id', user.id);
    await supabase.from('users').delete().eq('id', user.id);
    await signOut();
    navigate('/login');
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
        value ? 'bg-primary/40 border border-primary/60' : 'bg-white/10 border border-white/20'
      }`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ${
        value ? 'right-1 bg-primary' : 'left-1 bg-white/40'
      }`} />
    </button>
  );

  return (
    <div className="space-y-8 pb-20 md:pb-0 max-w-3xl mx-auto">
      <div>
        <h1 className="font-serif text-3xl text-white mb-2">Settings</h1>
        <p className="text-text-secondary">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Shield className="w-5 h-5 text-white" />
            <h2 className="text-lg font-medium text-white">Account</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field opacity-60 cursor-not-allowed"
              />
              <p className="text-xs text-text-muted mt-1">Email cannot be changed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="input-field appearance-none"
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>

            {accountError && (
              <p className="text-sm text-red-400">{accountError}</p>
            )}
            {accountSuccess && (
              <p className="text-sm text-emerald-400">✓ Settings saved</p>
            )}

            <button
              onClick={handleSaveAccount}
              disabled={savingAccount}
              className="btn-ghost px-6 py-2.5 text-sm"
            >
              {savingAccount ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Change Password */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Lock className="w-5 h-5 text-white" />
            <h2 className="text-lg font-medium text-white">Change Password</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="input-field"
              />
            </div>

            {passwordError && (
              <p className="text-sm text-red-400">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-emerald-400">✓ Password updated successfully</p>
            )}

            <button
              onClick={handleChangePassword}
              disabled={savingPassword || !newPassword}
              className="btn-ghost px-6 py-2.5 text-sm"
            >
              {savingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Bell className="w-5 h-5 text-white" />
            <h2 className="text-lg font-medium text-white">Notifications</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              {
                title: "Daily Check-in Reminder",
                desc: "Get notified 2 hours before midnight.",
                value: notifCheckIn,
                onChange: setNotifCheckIn,
              },
              {
                title: "Pod Activity",
                desc: "When someone in your pod checks in or posts.",
                value: notifPodActivity,
                onChange: setNotifPodActivity,
              },
              {
                title: "AI Coach Insights",
                desc: "Weekly recaps and momentum warnings.",
                value: notifAIInsights,
                onChange: setNotifAIInsights,
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </div>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            ))}

            {notifSuccess && (
              <p className="text-sm text-emerald-400">✓ Notification preferences saved</p>
            )}

            <button
              onClick={handleSaveNotifs}
              disabled={savingNotifs}
              className="btn-ghost px-6 py-2.5 text-sm"
            >
              {savingNotifs ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card rounded-3xl overflow-hidden border-red-500/20">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Lock className="w-5 h-5 text-red-400" />
            <h2 className="text-lg font-medium text-red-400">Danger Zone</h2>
          </div>
          <div className="p-6 space-y-4">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-red-500/50 transition-colors group"
            >
              <span className="font-medium text-white group-hover:text-red-400 transition-colors">
                Sign Out
              </span>
              <LogOut className="w-5 h-5 text-text-muted group-hover:text-red-400 transition-colors" />
            </button>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-red-500/50 transition-colors group"
              >
                <span className="font-medium text-text-secondary group-hover:text-red-400 transition-colors">
                  Delete Account
                </span>
              </button>
            ) : (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-3">
                <p className="text-sm text-red-400 font-medium">
                  Are you sure? This will delete all your data and cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="btn-ghost flex-1 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="flex-1 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-colors border border-red-500/30 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border">
          <div>
            <p className="font-medium text-text-primary">Daily Reminders</p>
            <p className="text-sm text-text-secondary">Get notified at 8 AM and 6 PM if you haven't checked in</p>
          </div>
          <button
            onClick={handlePushToggle}
            className={`w-12 h-6 rounded-full transition-colors ${pushEnabled ? 'bg-primary' : 'bg-surface-2'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${pushEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
