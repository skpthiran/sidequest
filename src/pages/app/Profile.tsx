import { UserCircle, Award, History, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Header */}
      <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <div className="w-32 h-32 rounded-full border-4 border-surface overflow-hidden shadow-2xl">
            <img src="https://picsum.photos/seed/avatar1/200/200" className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-3xl text-white mb-2">Alex Chen</h1>
            <p className="text-text-secondary mb-6">Joined March 2026 • Premium Member</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-4 py-2 rounded-xl bg-surface border border-white/5">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Missions Completed</p>
                <p className="text-xl font-serif text-white">4</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-surface border border-white/5">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Best Streak</p>
                <p className="text-xl font-serif text-white">28 Days</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-surface border border-white/5 border-primary/20">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Avg Consistency</p>
                <p className="text-xl font-serif text-primary">94%</p>
              </div>
            </div>
          </div>
          <div>
            <Link to="/app/settings" className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center text-text-secondary hover:text-white transition-colors">
              <SettingsIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current Mission */}
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-white">Current Mission</h2>
          </div>
          <div className="p-6 rounded-2xl bg-surface border border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-serif text-xl text-white mb-1">Deep Work Discipline</h3>
                <p className="text-sm text-text-secondary">Day 12 of 30</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                Active
              </div>
            </div>
            <div className="w-full h-2 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[40%]" />
            </div>
          </div>
        </div>

        {/* Mission History */}
        <div className="glass-card p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-white" />
              <h2 className="text-lg font-medium text-white">Mission History</h2>
            </div>
            <button className="text-sm text-text-secondary hover:text-white transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {[
              { title: "Morning Runner", date: "Feb 2026", result: "Completed", score: "96%" },
              { title: "Dopamine Detox", date: "Jan 2026", result: "Completed", score: "88%" },
              { title: "Sleep Reset", date: "Nov 2025", result: "Completed", score: "100%" }
            ].map((mission, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5">
                <div>
                  <p className="font-medium text-white">{mission.title}</p>
                  <p className="text-xs text-text-secondary">{mission.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-emerald-400">{mission.result}</p>
                  <p className="text-xs text-text-muted">{mission.score} Consistency</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
