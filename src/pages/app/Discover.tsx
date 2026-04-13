import { Compass, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Discover() {
  const categories = ["All", "Fitness", "Career", "Mindset", "Recovery"];
  
  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-2">Discover Chapters</h1>
          <p className="text-text-secondary">Find your next 30-day mission.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {categories.map((cat, i) => (
            <button 
              key={cat}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                i === 0 ? "bg-white text-background" : "bg-surface border border-white/10 text-text-secondary hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="glass-card p-8 rounded-3xl relative overflow-hidden group cursor-pointer border-primary/20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-6">
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Expert-Led Cohort</span>
            </div>
            <h2 className="font-serif text-3xl text-white mb-4">75 Hard Preparation</h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              A 30-day ramp-up mission designed to build the baseline discipline required before attempting the full 75 Hard challenge.
            </p>
            <button className="px-6 py-3 rounded-full bg-white text-background font-medium hover:bg-gray-100 transition-colors flex items-center gap-2">
              View Details <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="hidden md:block">
            <img src="https://picsum.photos/seed/fitness/800/600" className="rounded-2xl border border-white/10 shadow-2xl" alt="Featured" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Dopamine Detox", category: "Mindset", members: "1.2k active", color: "from-purple-500/20 to-indigo-500/20" },
          { title: "Sleep Reset", category: "Recovery", members: "850 active", color: "from-slate-500/20 to-gray-500/20" },
          { title: "Morning Runner", category: "Fitness", members: "2.1k active", color: "from-blue-500/20 to-cyan-500/20" },
          { title: "Creator Sprint", category: "Career", members: "420 active", color: "from-amber-500/20 to-orange-500/20" },
          { title: "Sober Month", category: "Mindset", members: "3.5k active", color: "from-emerald-500/20 to-teal-500/20" },
          { title: "Reading Habit", category: "Mindset", members: "1.8k active", color: "from-rose-500/20 to-pink-500/20" }
        ].map((chapter, i) => (
          <div key={i} className="group relative p-6 rounded-2xl border border-white/5 bg-surface hover:border-white/20 transition-all duration-300 cursor-pointer overflow-hidden">
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", chapter.color)} />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">{chapter.category}</span>
                <Compass className="w-4 h-4 text-text-muted group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-serif text-white mb-2">{chapter.title}</h3>
              <p className="text-sm text-text-secondary mb-6">{chapter.members}</p>
              <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                Join Waitlist <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
