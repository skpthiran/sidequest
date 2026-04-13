import { Shield, Bell, Lock, CreditCard, LogOut } from 'lucide-react';

export default function Settings() {
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
              <label className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                defaultValue="alex@example.com"
                className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">Timezone</label>
              <select className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none">
                <option>Pacific Time (PT)</option>
                <option>Eastern Time (ET)</option>
              </select>
            </div>
            <button className="px-6 py-2.5 rounded-full bg-white/5 text-white font-medium hover:bg-white/10 transition-colors text-sm">
              Save Changes
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
              { title: "Daily Check-in Reminder", desc: "Get notified 2 hours before midnight." },
              { title: "Pod Activity", desc: "When someone in your pod checks in or posts." },
              { title: "AI Coach Insights", desc: "Weekly recaps and momentum warnings." }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-white">{item.title}</p>
                  <p className="text-sm text-text-secondary">{item.desc}</p>
                </div>
                <div className="w-12 h-6 rounded-full bg-primary/20 relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-primary" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="glass-card rounded-3xl overflow-hidden border-accent-rose/20">
          <div className="p-6 border-b border-white/5 flex items-center gap-3">
            <Lock className="w-5 h-5 text-accent-rose" />
            <h2 className="text-lg font-medium text-accent-rose">Danger Zone</h2>
          </div>
          <div className="p-6 space-y-4">
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-accent-rose/50 transition-colors group">
              <span className="font-medium text-white group-hover:text-accent-rose transition-colors">Sign Out</span>
              <LogOut className="w-5 h-5 text-text-muted group-hover:text-accent-rose transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:border-accent-rose/50 transition-colors group">
              <span className="font-medium text-text-secondary group-hover:text-accent-rose transition-colors">Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
