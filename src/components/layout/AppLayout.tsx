import { Outlet, NavLink, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  Compass, 
  BrainCircuit, 
  UserCircle, 
  Settings,
  Shield,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/app' },
  { icon: Users, label: 'Pod Wall', path: '/app/pod' },
  { icon: Target, label: 'Progress', path: '/app/progress' },
  { icon: Compass, label: 'Discover', path: '/app/discover' },
  { icon: BrainCircuit, label: 'AI Coach', path: '/app/coach' },
];

const bottomNavItems = [
  { icon: UserCircle, label: 'Profile', path: '/app/profile' },
  { icon: Settings, label: 'Settings', path: '/app/settings' },
];

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-background text-text-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-surface-elevated/30 backdrop-blur-xl">
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link to="/app" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-amber flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              <Shield className="w-4 h-4 text-background" />
            </div>
            <span className="font-serif font-semibold text-lg tracking-wider uppercase text-white">Sidequest</span>
          </Link>
        </div>

        <div className="flex-1 py-8 px-4 flex flex-col gap-2">
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Mission Control</p>
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" 
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-white/10 text-white" 
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-white/5 bg-surface flex items-center justify-between px-4">
          <Link to="/app" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent-amber flex items-center justify-center">
              <Shield className="w-3 h-3 text-background" />
            </div>
          </Link>
          <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-text-secondary">
            <Bell className="w-4 h-4" />
          </button>
        </header>

        {/* Top bar for desktop */}
        <header className="hidden md:flex h-20 items-center justify-between px-8 border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="h-8 px-3 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
              <span className="text-xs font-medium text-text-secondary">Day 12 of 30</span>
            </div>
            <h1 className="text-sm font-medium text-white">Deep Work Discipline</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-secondary hover:text-white transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-accent-rose"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-elevated border border-white/10 overflow-hidden">
              <img src="https://picsum.photos/seed/avatar1/100/100" alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-white/5 flex items-center justify-around px-2 pb-safe z-50">
          {[...navItems.slice(0, 4), { icon: UserCircle, label: 'Profile', path: '/app/profile' }].map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors",
                isActive ? "text-white" : "text-text-muted hover:text-text-secondary"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
