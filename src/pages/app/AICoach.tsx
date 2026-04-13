import { BrainCircuit, Activity, AlertTriangle, Sparkles } from 'lucide-react';

export default function AICoach() {
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
        {/* Weekly Recap */}
        <div className="glass-card p-8 rounded-3xl border-primary/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-medium text-white">Weekly Recap</h2>
          </div>
          <div className="space-y-4 relative z-10">
            <p className="text-text-primary leading-relaxed">
              Your pod is showing exceptional resilience. Despite a collective dip in energy reported on Wednesday, 5 out of 6 members maintained their streak. 
            </p>
            <p className="text-text-primary leading-relaxed">
              You specifically have been checking in earlier in the day compared to last week, which correlates with your higher reported mood scores.
            </p>
          </div>
        </div>

        {/* Momentum Warning */}
        <div className="glass-card p-8 rounded-3xl border-accent-amber/10">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-accent-amber" />
            <h2 className="text-lg font-medium text-white">Pattern Detection</h2>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-white/5 mb-6">
            <p className="text-sm text-text-secondary mb-2">Vulnerability Window</p>
            <p className="text-white font-medium">Weekends (Saturday & Sunday)</p>
          </div>
          <p className="text-text-secondary leading-relaxed">
            Based on your history in previous chapters, weekends are your highest risk period for breaking a streak. Consider setting your intention for Saturday morning right now.
          </p>
          <button className="mt-6 px-6 py-3 rounded-full bg-white/5 text-white border border-white/10 font-medium text-sm hover:bg-white/10 transition-colors">
            Set Weekend Intention
          </button>
        </div>

        {/* Pod Health */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="w-5 h-5 text-white" />
            <h2 className="text-lg font-medium text-white">Pod Health Analysis</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <p className="text-sm text-text-secondary uppercase tracking-wider mb-2">Emotional Tone</p>
              <p className="text-xl font-serif text-white mb-2">Supportive & Focused</p>
              <p className="text-xs text-text-muted">Based on reflection sentiment</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <p className="text-sm text-text-secondary uppercase tracking-wider mb-2">Consistency Risk</p>
              <p className="text-xl font-serif text-emerald-400 mb-2">Low</p>
              <p className="text-xs text-text-muted">92% completion rate</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-white/5">
              <p className="text-sm text-text-secondary uppercase tracking-wider mb-2">Suggested Action</p>
              <p className="text-sm font-medium text-white mb-2">Encourage Emma</p>
              <p className="text-xs text-text-muted">She missed yesterday's check-in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
