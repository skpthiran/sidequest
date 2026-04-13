import { Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProgressBoard() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const members = [
    { id: 1, name: 'You', streak: 12, consistency: 100, history: Array(12).fill(true).concat(Array(18).fill(null)) },
    { id: 2, name: 'Alex', streak: 12, consistency: 100, history: Array(12).fill(true).concat(Array(18).fill(null)) },
    { id: 3, name: 'Sarah', streak: 4, consistency: 85, history: [...Array(7).fill(true), false, ...Array(4).fill(true), ...Array(18).fill(null)] },
    { id: 4, name: 'Mike', streak: 12, consistency: 100, history: Array(12).fill(true).concat(Array(18).fill(null)) },
    { id: 5, name: 'Emma', streak: 0, consistency: 70, history: [...Array(10).fill(true), false, false, ...Array(18).fill(null)] },
    { id: 6, name: 'David', streak: 12, consistency: 100, history: Array(12).fill(true).concat(Array(18).fill(null)) },
  ];

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-white mb-2">Progress Board</h1>
          <p className="text-text-secondary">Track the pod's consistency over 30 days.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-4 py-2 rounded-xl text-center">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Pod Average</p>
            <p className="text-lg font-serif text-white">92%</p>
          </div>
          <div className="glass-card px-4 py-2 rounded-xl text-center border-primary/20">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Top Streak</p>
            <p className="text-lg font-serif text-primary">12 Days</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl overflow-hidden overflow-x-auto">
        <div className="min-w-[800px] p-6">
          {/* Header Row */}
          <div className="flex items-end mb-6">
            <div className="w-48 shrink-0 pb-2">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Member</span>
            </div>
            <div className="flex-1 flex gap-1">
              {days.map(day => (
                <div key={day} className="flex-1 text-center pb-2">
                  <span className={cn(
                    "text-[10px] font-medium",
                    day === 12 ? "text-primary" : "text-text-muted"
                  )}>
                    {day}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-24 shrink-0 text-right pb-2">
              <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Streak</span>
            </div>
          </div>

          {/* Member Rows */}
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="flex items-center group">
                <div className="w-48 shrink-0 flex items-center gap-3">
                  <img src={`https://picsum.photos/seed/user${member.id}/100/100`} className="w-8 h-8 rounded-full" alt={member.name} referrerPolicy="no-referrer" />
                  <span className={cn("text-sm font-medium", member.name === 'You' ? "text-white" : "text-text-secondary group-hover:text-white transition-colors")}>
                    {member.name}
                  </span>
                </div>
                <div className="flex-1 flex gap-1">
                  {member.history.map((status, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "flex-1 aspect-square rounded-sm transition-all duration-300",
                        status === true ? "bg-primary/80 shadow-[0_0_10px_rgba(212,175,55,0.2)]" :
                        status === false ? "bg-accent-rose/50" :
                        index === 11 ? "bg-white/10 border border-white/20" : // Today
                        "bg-surface"
                      )}
                    />
                  ))}
                </div>
                <div className="w-24 shrink-0 text-right flex items-center justify-end gap-2">
                  <span className="text-sm font-serif text-white">{member.streak}</span>
                  <TrendingUp className={cn("w-3 h-3", member.streak > 0 ? "text-emerald-500" : "text-text-muted")} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
