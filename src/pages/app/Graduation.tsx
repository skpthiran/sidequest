import { motion } from 'motion/react';
import { Award, ArrowRight, Share2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Graduation() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-8 md:p-12 rounded-[3rem] text-center relative overflow-hidden border-primary/30 shadow-[0_0_100px_rgba(212,175,55,0.15)]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent-amber flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(212,175,55,0.4)]">
              <Award className="w-12 h-12 text-background" />
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">Mission Accomplished</h1>
            <p className="text-xl text-text-secondary mb-12">
              You and your pod successfully completed 30 days of Deep Work Discipline.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="p-4 rounded-2xl bg-surface border border-white/5">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Days</p>
                <p className="text-2xl font-serif text-white">30/30</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-white/5">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Consistency</p>
                <p className="text-2xl font-serif text-primary">96%</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-white/5">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Pod Avg</p>
                <p className="text-2xl font-serif text-white">92%</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-white/5">
                <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Reflections</p>
                <p className="text-2xl font-serif text-white">28</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/app/discover" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-background font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                Start Next Chapter <ArrowRight className="w-4 h-4" />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white border border-white/10 font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Share2 className="w-4 h-4" /> Share Result
              </button>
            </div>
            
            <button className="mt-8 text-sm text-text-secondary hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
              <Download className="w-4 h-4" /> Download Mission Archive
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
