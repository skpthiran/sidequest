import { Outlet, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b-0 border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-amber flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-shadow">
              <Shield className="w-4 h-4 text-background" />
            </div>
            <span className="font-serif font-semibold text-xl tracking-wider uppercase text-white">Sidequest</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="#chapters" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Chapters</Link>
            <Link to="#how-it-works" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">How it Works</Link>
            <Link to="#pricing" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors hidden sm:block">
              Sign In
            </Link>
            <Link to="/signup" className="px-5 py-2.5 rounded-full bg-white text-background font-medium text-sm hover:bg-gray-100 transition-colors">
              Join a Mission
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      <footer className="border-t border-white/5 bg-surface py-16 mt-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent-amber flex items-center justify-center">
                <Shield className="w-3 h-3 text-background" />
              </div>
              <span className="font-serif font-semibold text-lg tracking-wider uppercase text-white">Sidequest</span>
            </Link>
            <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
              A premium accountability platform for those ready to enter a serious mission with real people. Find your pod. Finish your mission.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm text-text-secondary hover:text-white transition-colors">Chapters</Link></li>
              <li><Link to="#" className="text-sm text-text-secondary hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="#" className="text-sm text-text-secondary hover:text-white transition-colors">Safety & Trust</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm text-text-secondary hover:text-white transition-colors">About</Link></li>
              <li><Link to="#" className="text-sm text-text-secondary hover:text-white transition-colors">Journal</Link></li>
              <li><Link to="#" className="text-sm text-text-secondary hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">© 2026 Sidequest Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="text-xs text-text-muted hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-xs text-text-muted hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
