import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, Users, TrendingUp, Compass, BrainCircuit, User, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from '../../lib/auth';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const navItems = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/pod', label: 'Pod Wall', icon: Users },
  { to: '/app/progress', label: 'Progress', icon: TrendingUp },
  { to: '/app/discover', label: 'Discover', icon: Compass },
  { to: '/app/coach', label: 'AI Coach', icon: BrainCircuit },
];

const bottomNavItems = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/pod', label: 'Pod', icon: Users },
  { to: '/app/progress', label: 'Progress', icon: TrendingUp },
  { to: '/app/discover', label: 'Discover', icon: Compass },
  { to: '/app/profile', label: 'Profile', icon: User },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<{
    full_name: string;
    life_chapter: string;
    streak_count: number;
    avatar_url: string | null;
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('users')
      .select('full_name, life_chapter, streak_count, avatar_url')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
      });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const chapter = profile?.life_chapter || '...';
  const streak = profile?.streak_count || 0;
  const avatarUrl = profile?.avatar_url || 
    `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name || 'SQ'}`;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 p-6 fixed h-full z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">S</span>
          </div>
          <span className="font-serif text-lg text-white">SIDEQUEST</span>
        </div>

        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-4">
          Mission Control
        </p>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                )
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1 pt-4 border-t border-white/5">
          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              )
            }
          >
            <User className="w-4 h-4" />
            Profile
          </NavLink>
          <NavLink
            to="/app/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              )
            }
          >
            <Settings className="w-4 h-4" />
            Settings
          </NavLink>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 border-b border-white/5 bg-background/80 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-text-secondary">
                  Day {streak} of 30
                </span>
              </div>
              <span className="text-sm font-medium text-white hidden sm:block">
                {chapter}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/app/profile')}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-10 border-t border-white/5 bg-background/95 backdrop-blur-sm px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {bottomNavItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                  isActive ? 'text-white' : 'text-text-muted'
                )
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
