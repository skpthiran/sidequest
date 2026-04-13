import { motion } from 'motion/react';
import { MessageSquare, Heart, Flame, ShieldAlert } from 'lucide-react';

export default function PodWall() {
  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-2">Pod Wall</h1>
          <p className="text-text-secondary">Your private space with 5 other members.</p>
        </div>
        <div className="flex -space-x-4">
          {[1,2,3,4,5,6].map(i => (
            <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-10 h-10 rounded-full border-2 border-background" alt="User" referrerPolicy="no-referrer" />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Post Input */}
          <div className="glass-card p-6 rounded-3xl">
            <textarea 
              className="w-full bg-transparent border-none text-white focus:outline-none resize-none placeholder:text-text-muted"
              placeholder="Share a reflection or encourage the pod..."
              rows={2}
            />
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
              <button className="text-sm text-text-secondary hover:text-white transition-colors">Add Image</button>
              <button className="px-6 py-2 rounded-full bg-white text-background font-medium hover:bg-gray-100 transition-colors text-sm">
                Post
              </button>
            </div>
          </div>

          {/* Feed */}
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} className="w-10 h-10 rounded-full" alt="User" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-sm font-medium text-white">Member {i}</p>
                      <p className="text-xs text-text-muted">Checked in • 2h ago</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-text-secondary">
                    Day 12
                  </div>
                </div>
                
                <p className="text-text-primary leading-relaxed mb-4">
                  {i % 2 === 0 
                    ? "Really struggled to stay focused today, but managed to get 3 hours of deep work done. The pod streak is the only thing keeping me going right now."
                    : "Hit my 4 hours! Uploaded a picture of my clean desk setup. Let's go team!"}
                </p>

                {i % 2 !== 0 && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-white/10">
                    <img src={`https://picsum.photos/seed/desk${i}/800/400`} className="w-full h-48 object-cover" alt="Proof" referrerPolicy="no-referrer" />
                  </div>
                )}

                <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                  <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-rose transition-colors">
                    <Heart className="w-4 h-4" /> 3
                  </button>
                  <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors">
                    <MessageSquare className="w-4 h-4" /> 1
                  </button>
                  <button className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent-amber transition-colors">
                    <Flame className="w-4 h-4" /> 2
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-4">Mission Rules</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Check in before midnight local time.
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Proof is optional but highly encouraged.
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Support each other. No judgment.
              </li>
            </ul>
          </div>

          <div className="glass-card p-6 rounded-3xl border-white/5">
            <button className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors w-full">
              <ShieldAlert className="w-4 h-4" />
              Report an issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
