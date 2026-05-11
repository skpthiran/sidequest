import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  BookOpen,
  BrainCircuit,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  Flame,
  Heart,
  Menu,
  MessageSquare,
  Moon,
  Plus,
  Shield,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ButtonProps = {
  children: ReactNode;
  to?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

type Chapter = {
  title: string;
  icon: typeof Activity;
  theme: string;
  border: string;
  glow: string;
  desc: string;
  badge: string;
  pulse: string;
};

const chapters: Chapter[] = [
  {
    title: 'Fitness Discipline',
    icon: Activity,
    theme: 'from-orange-500/20 via-red-500/10 to-transparent',
    border: 'hover:border-orange-500/40',
    glow: 'bg-orange-500/25',
    desc: '30 days of physical intensity, morning runs, and visible proof that you showed up.',
    badge: 'Body Stack',
    pulse: 'bg-orange-400',
  },
  {
    title: 'Study Grind',
    icon: BookOpen,
    theme: 'from-blue-500/20 via-cyan-500/10 to-transparent',
    border: 'hover:border-cyan-500/40',
    glow: 'bg-cyan-500/20',
    desc: 'Deep work rituals, late-night libraries, and a pod that keeps your focus locked in.',
    badge: 'Focus Lane',
    pulse: 'bg-cyan-400',
  },
  {
    title: 'Career Focus',
    icon: Briefcase,
    theme: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    border: 'hover:border-emerald-500/40',
    glow: 'bg-emerald-500/20',
    desc: 'Skill leverage, shipped work, and structured accountability for your next professional leap.',
    badge: 'Operator Mode',
    pulse: 'bg-emerald-400',
  },
  {
    title: 'Breakup Recovery',
    icon: Heart,
    theme: 'from-rose-500/20 via-pink-500/10 to-transparent',
    border: 'hover:border-rose-500/40',
    glow: 'bg-rose-500/20',
    desc: 'A calm 30-day reset for rebuilding emotional stability, routine, and momentum.',
    badge: 'Recovery Pod',
    pulse: 'bg-rose-400',
  },
  {
    title: 'Sleep Reset',
    icon: Moon,
    theme: 'from-indigo-500/20 via-slate-500/10 to-transparent',
    border: 'hover:border-indigo-400/40',
    glow: 'bg-indigo-400/20',
    desc: 'Circadian discipline, quieter nights, and a squad that notices if you drift.',
    badge: 'Night Protocol',
    pulse: 'bg-indigo-300',
  },
  {
    title: 'Founder Mode',
    icon: Zap,
    theme: 'from-violet-500/20 via-purple-500/10 to-transparent',
    border: 'hover:border-violet-400/40',
    glow: 'bg-violet-400/20',
    desc: 'Weekly shipping, MVP pressure, and peers who expect proof instead of ideas.',
    badge: 'Build Cycle',
    pulse: 'bg-violet-400',
  },
];

const journey = [
  {
    num: '01',
    title: 'Select your life chapter',
    desc: 'Choose your focus area: physical health, deep study, career acceleration, or recovery.',
  },
  {
    num: '02',
    title: 'Form your squad',
    desc: 'We place you in a private pod of 4–8 peers in the same season and timezone as you.',
  },
  {
    num: '03',
    title: 'Prove the work',
    desc: 'Upload daily proof. A photo, a note, a reflection, a commit — something real.',
  },
  {
    num: '04',
    title: 'Maintain momentum',
    desc: 'Your squad and AI coach detect patterns early and help you recover before momentum snaps.',
  },
  {
    num: '05',
    title: 'Graduate to elite',
    desc: 'Finish the 30 days and unlock higher-tier missions, streak history, and stronger identity.',
  },
];

const archetypes = [
  {
    title: 'The Sprinter',
    desc: 'Studies intensely for 3 days, then disappears for a week.',
    label: 'Needs consistency over intensity.',
  },
  {
    title: 'The Solo Founder',
    desc: 'Has a massive vision but struggles with the daily mundane execution.',
    label: 'Needs daily shipped proof.',
  },
  {
    title: 'The Rebuilder',
    desc: 'Healing from heartbreak and trying to rediscover a stable routine.',
    label: 'Needs supportive witnesses.',
  },
  {
    title: 'The Empty Gym-Goer',
    desc: 'Cannot find a reason to go when nobody notices they stayed home.',
    label: 'Needs shared stakes.',
  },
];

const stats = [
  { label: 'POD SIZE', value: '4–8' },
  { label: 'MISSION LENGTH', value: '30D' },
  { label: 'DAILY STREAK', value: '87%' },
];

const POD_DEPLOYMENT_INTERVAL = { hours: 4, minutes: 22, seconds: 15 } as const;
const POD_DEPLOYMENT_INTERVAL_MS =
  ((POD_DEPLOYMENT_INTERVAL.hours * 60 + POD_DEPLOYMENT_INTERVAL.minutes) * 60 + POD_DEPLOYMENT_INTERVAL.seconds) * 1000;
const DEPLOYMENT_TIMESTAMP_STORAGE_KEY = 'sidequest-next-deployment-at';

const squad = [
  { initials: 'LV', hue: 0 },
  { initials: 'AN', hue: 35 },
  { initials: 'KM', hue: 70 },
  { initials: 'RJ', hue: 110 },
  { initials: 'SE', hue: 145 },
];

const Button = ({ children, to, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 active:scale-95 disabled:pointer-events-none disabled:opacity-50';
  const variants = {
    primary: 'bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.1)] hover:bg-white/90',
    outline: 'border border-white/10 bg-white/5 text-white backdrop-blur-xl hover:border-white/25 hover:bg-white/8',
    ghost: 'text-white/60 hover:bg-white/5 hover:text-white',
  } as const;

  if (to?.startsWith('#')) {
    return (
      <a href={to} className={cn(baseClasses, variants[variant], className)}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={cn(baseClasses, variants[variant], className)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn(baseClasses, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

const formatCountdown = (timeLeftMs: number) => {
  const totalSeconds = Math.max(0, Math.floor(timeLeftMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
};

const FadeIn = ({ children, delay = 0, className = '' }: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const BackgroundParticles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({ length: 18 }).map((_, index) => (
      <motion.span
        key={index}
        className="absolute rounded-full bg-white/30"
        style={{
          width: `${(index % 3) + 1}px`,
          height: `${(index % 3) + 1}px`,
          left: `${(index * 17) % 100}%`,
          top: `${(index * 11) % 100}%`,
        }}
        animate={{
          y: [0, -220 - (index % 5) * 28],
          x: [0, (index % 2 === 0 ? 20 : -20)],
          opacity: [0, 0.55, 0],
        }}
        transition={{
          duration: 12 + (index % 7) * 2,
          repeat: Infinity,
          ease: 'linear',
          delay: index * 0.35,
        }}
      />
    ))}
  </div>
);

const AmbientRouteLines = () => (
  <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 1440 900" fill="none">
    <motion.path
      d="M-80 560 Q 260 380 720 220 T 1520 480"
      stroke="white"
      strokeWidth="0.8"
      strokeDasharray="10 16"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 3.2, ease: 'easeInOut' }}
    />
    <motion.path
      d="M-40 700 Q 420 760 860 280 T 1540 140"
      stroke="white"
      strokeWidth="0.8"
      strokeDasharray="10 16"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 4.1, delay: 0.6, ease: 'easeInOut' }}
    />
  </svg>
);

const Avatar = ({ initials, hue, size = 'w-10 h-10 text-[11px]' }: { initials: string; hue: number; size?: string }) => (
  <div
    className={cn(
      'flex items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/20 to-white/5 font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-xl',
      size,
    )}
    style={{ filter: `hue-rotate(${hue}deg)` }}
  >
    {initials}
  </div>
);

const MetricBar = ({ color, width }: { color: string; width: string }) => (
  <div className="h-2 overflow-hidden rounded-full bg-white/10">
    <div className={cn('h-full rounded-full', color)} style={{ width }} />
  </div>
);

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Chapters', href: '#chapters' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <>
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-500',
          scrolled ? 'border-b border-white/5 bg-[#020202]/80 py-4 backdrop-blur-2xl' : 'bg-transparent py-8',
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black text-xl font-bold tracking-tighter shadow-[0_0_24px_rgba(255,255,255,0.16)] transition-transform group-hover:scale-110">
              S
            </div>
            <span className="font-display text-2xl font-medium tracking-tight">Sidequest</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <div className="flex items-center gap-6 rounded-full border border-white/5 bg-white/5 px-6 py-2 backdrop-blur-xl">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} className="text-sm font-medium text-white/50 transition-colors hover:text-white">
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button to="/login" variant="ghost" className="h-11 px-5 text-sm">
                Sign In
              </Button>
              <Button to="/signup" className="h-11 px-6 text-sm">
                Start Mission
              </Button>
            </div>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-[#020202] p-8"
          >
            <button
              type="button"
              className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5"
              aria-label="Close navigation menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mb-12 flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-display text-4xl font-medium tracking-tight"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex w-full max-w-xs flex-col gap-4">
              <Button to="/login" variant="outline" className="h-16 w-full text-lg">
                Sign In
              </Button>
              <Button to="/signup" className="h-16 w-full text-lg">
                Start Mission
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HeroSection = ({ missionWindowLabel }: { missionWindowLabel: string }) => (
  <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-24">
    <div className="absolute inset-0">
      <div className="absolute bottom-0 left-0 right-0 h-[60vh] opacity-20">
        <svg className="h-full w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#020202"
            d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L0,320Z"
          />
        </svg>
      </div>
      <div className="absolute left-1/2 top-1/4 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600/15 via-amber-500/10 to-cyan-500/15 blur-[140px] opacity-60" />
      <div className="absolute left-[18%] top-[18%] h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[100px]" />
      <div className="absolute bottom-0 left-1/2 h-[70vh] w-[2px] -translate-x-1/2 bg-gradient-to-t from-amber-500/40 via-amber-500/20 to-transparent" />
      <div className="absolute bottom-0 left-1/2 h-[400px] w-[220px] -translate-x-1/2 bg-amber-500/5 blur-[90px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_58%)] opacity-60" />
      <div className="absolute inset-0 bg-grid-white opacity-[0.03] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_45%,black,transparent_75%)]" />
      <AmbientRouteLines />
      <BackgroundParticles />
    </div>

    <div className="container relative z-10 mx-auto mt-12 grid items-center gap-12 px-4 sm:px-6 lg:mt-0 lg:grid-cols-2 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left"
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-white/90 shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          Join the Next Chapter
        </div>
        <h1 className="mb-8 font-display text-5xl font-medium leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl">
          Your next 30 days <br className="hidden sm:block" />
          <span className="font-light italic text-white/40">shouldn&apos;t be</span> <br className="hidden sm:block" />
          survived alone.
        </h1>
        <p className="mx-auto mb-12 max-w-xl text-lg font-light leading-relaxed text-white/60 sm:text-2xl lg:mx-0">
          Match with a private mission pod of 4–8 people in the same chapter of life. Check in daily, build momentum, and finish what you keep starting.
        </p>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center lg:justify-start">
          <Button to="/signup" className="group h-16 w-full px-10 text-lg sm:w-auto">
            Start Your Mission
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button to="#how-it-works" variant="outline" className="h-16 w-full px-10 text-lg sm:w-auto">
            How Pods Work
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, rotateY: 18 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="perspective-1000 relative mt-12 w-full max-w-xl justify-self-center lg:mt-0 lg:justify-self-end"
      >
        <motion.div
          animate={{ y: [-14, 14, -14], rotateX: [2, -2, 2], rotateY: [1.5, -1.5, 1.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/20 bg-[#0A0F1C]/80 p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/10 backdrop-blur-3xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-40" />
          <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-indigo-500/15 blur-[80px]" />
          <div className="relative z-10 mb-8 flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl font-medium tracking-tight text-white/95">Physical Discipline</h3>
              <p className="text-sm font-medium tracking-wide text-white/40">
                30 DAY MISSION • <span className="text-amber-400">{missionWindowLabel}</span>
              </p>
            </div>
            <div className="flex -space-x-3">
              {squad.map((member) => (
                <div key={member.initials} className="rounded-full border-2 border-[#0A0F1C]">
                  <Avatar initials={member.initials} hue={member.hue} />
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/[0.08]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white/90">Daily Proof Verified</p>
                  <p className="text-xs uppercase tracking-widest text-white/40">Momentum +15%</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Flame className="h-6 w-6 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <span className="mt-1 text-[10px] font-bold text-amber-500">STREAK 12</span>
              </div>
            </motion.div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="font-medium text-white/60">Pod Momentum</span>
                <span className="font-bold tracking-tight text-emerald-400">87.4%</span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '87.4%' }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                />
                <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.22)_50%,transparent_100%)]" />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
            {[
              { label: 'Check-ins', value: '12/30', tone: 'text-white' },
              { label: 'Squad Rank', value: '#2', tone: 'text-white' },
              { label: 'XP Gained', value: '+1,240', tone: 'text-emerald-400' },
            ].map((item) => (
              <div key={item.label}>
                <p className="mb-1 text-[10px] uppercase tracking-widest text-white/40">{item.label}</p>
                <p className={cn('font-display text-xl', item.tone)}>{item.value}</p>
              </div>
            ))}
          </div>

          <motion.div
            animate={{ y: [-8, 8, -8], x: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute -right-10 top-24 z-20 hidden items-center gap-3 rounded-2xl border border-white/20 bg-[#0A0F1C] p-4 shadow-2xl md:flex"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-amber-500">TIER 2 MISSION</span>
              <span className="text-xs font-semibold text-white/90">Elite Status Unlocked</span>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [8, -8, 8], x: [5, -5, 5] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="absolute -left-12 bottom-20 z-20 hidden items-center gap-3 rounded-2xl border border-white/20 bg-[#0A0F1C] p-4 shadow-2xl lg:flex"
          >
            <BrainCircuit className="h-6 w-6 text-violet-400 drop-shadow-[0_0_5px_rgba(167,139,250,0.5)]" />
            <div className="max-w-[132px]">
              <span className="block text-[10px] font-bold text-violet-400">AI COACH</span>
              <span className="text-xs font-medium leading-tight text-white/80">Momentum dip detected. Rally the pod?</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const ProblemSection = () => (
  <section className="relative overflow-hidden bg-[#020202] py-24">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]" />
    <div className="container mx-auto px-6">
      <div className="mx-auto mb-20 max-w-3xl text-balance text-center">
        <FadeIn>
          <h2 className="mb-6 font-display text-4xl font-medium leading-tight tracking-tight md:text-6xl">
            Discipline breaks <br /> when you disappear.
          </h2>
          <p className="text-xl font-light leading-relaxed text-white/50">
            Most people do not fail because they are weak. They fail because isolation leads to overthinking, and overthinking leads to quitting.
          </p>
        </FadeIn>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <FadeIn>
          <div className="group flex min-h-[500px] flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#050505] p-10 opacity-75 grayscale transition-all duration-500 hover:border-white/10 hover:opacity-100 lg:p-12">
            <div className="absolute inset-0 hidden" />
            <div className="relative z-10 space-y-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/20">
                <span className="text-2xl font-serif italic opacity-40">A</span>
              </div>
              <h3 className="font-display text-3xl font-medium text-white/40">The &ldquo;Alone&rdquo; Cycle</h3>
              <p className="text-lg font-light leading-relaxed text-white/30">
                No structure. No witness. No return path. The heavy feeling of starting over for the 10th time this year.
              </p>
            </div>
            <div className="relative z-10 mt-auto pt-10">
              <div className="flex gap-2">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className={cn('h-2 flex-1 rounded-full', index < 3 ? 'bg-white/10' : 'border border-red-500/20 bg-red-500/10')} />
                ))}
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400/50">Inconsistency Detected</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="group relative flex min-h-[500px] flex-col overflow-hidden rounded-[2.5rem] border border-amber-500/20 bg-[#080B14] p-10 shadow-[0_30px_60px_rgba(245,158,11,0.05)] transition-all hover:border-amber-500/40 lg:p-12">
            <div className="absolute inset-0">
              <div className="absolute right-0 top-0 h-[400px] w-[400px] bg-amber-500/10 blur-[100px] transition-all duration-700 group-hover:bg-amber-500/20" />
              <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
              <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 400">
                <motion.circle
                  cx="200"
                  cy="200"
                  r="100"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="0.6"
                  strokeDasharray="5 5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                />
              </svg>
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-transform group-hover:scale-110">
                <Flame className="h-7 w-7 text-amber-400" />
              </div>
              <h3 className="font-display text-3xl font-medium text-white/95">In a Pod</h3>
              <p className="text-lg font-light leading-relaxed text-white/60">
                Daily proof. Shared momentum. People who expect you back. It becomes impossible to hide when your squad is watching.
              </p>
            </div>
            <div className="relative z-10 mt-auto pt-10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {squad.slice(0, 4).map((member) => (
                    <div key={member.initials} className="rounded-full border-2 border-[#090C15] ring-1 ring-white/10">
                      <Avatar initials={member.initials} hue={member.hue} />
                    </div>
                  ))}
                </div>
                <div className="relative h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent">
                  <motion.div
                    animate={{ left: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-amber-400 blur-md"
                  />
                </div>
              </div>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">MISSION ACTIVE • WEEK 2</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const ChaptersSection = () => (
  <section className="relative overflow-hidden py-24 md:py-40">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    <div className="container relative z-10 mx-auto px-4 sm:px-6">
      <div className="mb-20 flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <FadeIn className="max-w-xl">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.3em] text-amber-500">Selection</span>
          <h2 className="mb-6 font-display text-4xl font-medium tracking-tight md:text-5xl lg:text-7xl">Choose your chapter.</h2>
          <p className="text-xl font-light leading-relaxed text-white/50">
            Missions are curated by intense focuses. You are not just joining an app; you are entering a 30-day crucible.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Button to="/signup" variant="outline" className="group h-14 px-8">
            Browse All Missions
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </FadeIn>
      </div>

      <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
        {chapters.map((chapter, index) => {
          const Icon = chapter.icon;
          return (
            <motion.div
              key={chapter.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Link
                to="/signup"
                className={cn(
                  'group relative block h-full overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#080808] p-10 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)]',
                  chapter.border,
                )}
              >
                <div className="absolute inset-0">
                  <div className={cn('absolute inset-0 bg-gradient-to-br opacity-90 transition-opacity duration-700', chapter.theme)} />
                  <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
                  <div className={cn('absolute -right-12 -top-16 h-48 w-48 rounded-full blur-[90px] opacity-60 transition-all duration-700 group-hover:opacity-100', chapter.glow)} />
                  <div className="absolute left-6 top-6 h-24 w-24 rounded-full border border-white/8" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <MetricBar color="bg-white/20" width="80%" />
                    <div className="mt-3 flex gap-2">
                      <MetricBar color={chapter.pulse} width="65%" />
                      <MetricBar color="bg-white/15" width="48%" />
                    </div>
                  </div>
                  <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 400 500" fill="none">
                    <path d="M20 420 Q140 340 220 360 T380 170" stroke="white" strokeWidth="1" strokeDasharray="8 12" />
                    <circle cx="288" cy="184" r="28" stroke="white" strokeOpacity="0.2" />
                  </svg>
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.55)]" />
                </div>

                <div className="relative z-10 flex h-full flex-col">
                  <div className="mb-24 flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                      <span className="rounded-full border border-white/5 bg-white/5 px-3 py-1 backdrop-blur-md">30 Days</span>
                      <span className="rounded-full border border-white/5 bg-white/5 px-3 py-1 backdrop-blur-md">Elite Squad</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/55 backdrop-blur-md">
                      <span className={cn('h-2 w-2 rounded-full', chapter.pulse)} />
                      {chapter.badge}
                    </div>
                    <h3 className="mb-4 font-display text-3xl font-medium tracking-tight transition-colors group-hover:text-white">{chapter.title}</h3>
                    <p className="mb-8 text-lg font-light leading-relaxed text-white/45 transition-colors group-hover:text-white/65">{chapter.desc}</p>
                    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/45 transition-all duration-500 group-hover:scale-105 group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                      Enter Mission
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

const TimelineSection = () => (
  <section id="how-it-works" className="relative overflow-hidden border-y border-white/5 bg-[#020202] py-32 md:py-48">
    <div className="pointer-events-none absolute inset-0 opacity-20">
      <svg className="h-full w-full" viewBox="0 0 1440 900" fill="none">
        <motion.path
          d="M-50 100 Q 300 200 720 150 T 1490 200"
          stroke="url(#map-line)"
          strokeWidth="1"
          strokeDasharray="10 15"
          animate={{ strokeDashoffset: [0, -100] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <defs>
          <linearGradient id="map-line" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" stopOpacity="0" />
            <stop offset="0.5" stopColor="white" stopOpacity="0.2" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div className="container relative z-10 mx-auto px-6">
      <FadeIn className="mx-auto mb-24 max-w-3xl text-balance text-center md:mb-40">
        <span className="mb-6 block text-xs font-bold uppercase tracking-[0.4em] text-white/30">The Operations</span>
        <h2 className="mb-8 font-display text-4xl font-medium tracking-tight md:text-5xl lg:text-7xl">
          From intention to habit in 30 days.
        </h2>
        <p className="mx-auto max-w-2xl text-xl font-light text-white/40">
          A precise journey designed to replace erratic motivation with structural consistency.
        </p>
      </FadeIn>

      <div className="relative mx-auto max-w-5xl">
        <div className="absolute bottom-0 left-1/2 top-0 hidden w-[2px] -translate-x-1/2 bg-white/[0.03] md:block" />
        <div className="space-y-24 md:space-y-48">
          {journey.map((step, index) => (
            <div key={step.num}>
              <FadeIn delay={0.08}>
              {(() => {
                const isReversed = index % 2 === 1;
                const textAlignment = isReversed ? 'md:text-left' : 'md:text-right';

                return (
                  <div className={cn('flex flex-col items-center gap-12 md:flex-row', isReversed && 'md:flex-row-reverse')}>
                    <div className={cn('w-full flex-1 text-center', textAlignment)}>
                  <div className="mb-6 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 transition-all hover:border-white hover:bg-white hover:text-black">
                    Phase {step.num}
                  </div>
                  <h3 className="mb-6 font-display text-3xl font-medium tracking-tight text-white/90 md:text-4xl">{step.title}</h3>
                  <p className="text-lg font-light leading-relaxed text-white/40">{step.desc}</p>
                </div>

                    <div className="relative z-10 flex-shrink-0">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-white/5 bg-[#050505] transition-all duration-700 hover:scale-110 hover:border-white/40 hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                        <span className="text-2xl font-mono text-white/15">{step.num}</span>
                      </div>
                      <div className="pointer-events-none absolute inset-2 rounded-full border border-white/5 opacity-70" />
                    </div>

                    <div className="hidden flex-1 md:block" />
                  </div>
                );
              })()}
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const PodExperience = () => (
  <section className="relative overflow-hidden py-24 md:py-48">
    <div className="pointer-events-none absolute left-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-blue-500/10 blur-[150px] opacity-40" />
    <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[150px] opacity-40" />

    <div className="container relative z-10 mx-auto px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-24 lg:grid-cols-2 lg:gap-32">
        <FadeIn>
          <span className="mb-6 block text-xs font-bold uppercase tracking-[0.4em] text-blue-500">Environment</span>
          <h2 className="mb-8 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-7xl">
            Not a feed.<br />A private squad.
          </h2>
          <p className="mb-12 text-xl font-light leading-relaxed text-white/50">
            We removed everything that makes social media exhausting. No infinite scroll, no public counts, no performative posting.
          </p>

          <ul className="mb-12 space-y-8">
            {[
              { title: 'Small private pods', desc: 'Synchronous accountability with only 4–8 people.' },
              { title: 'No infinite scroll', desc: 'Open, check in, support your squad, and get back to life.' },
              { title: 'Proof-based social', desc: 'The only currency is showing up and doing the work.' },
            ].map((item) => (
              <li key={item.title} className="group flex items-start gap-5">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all group-hover:bg-white group-hover:text-black">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="mb-1 text-xl font-medium text-white/90">{item.title}</h4>
                  <p className="font-light text-white/40">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <Button to="/signup" className="group h-16 px-10">
            Explore Pod Wall
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </FadeIn>

        <FadeIn className="relative mx-auto w-full max-w-sm">
          <div className="perspective-1000 rotate-x-5 rotate-y-10-neg group relative aspect-[9/19] overflow-hidden rounded-[3rem] border-[12px] border-[#111] bg-[#020202] shadow-[0_50px_100px_rgba(0,0,0,0.8)] ring-1 ring-white/20 transition-all duration-1000 ease-out hover:rotate-x-0 hover:rotate-y-[0deg]">
            <div className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-br from-white/10 via-transparent to-black/40" />
            <div className="absolute inset-0 flex h-full flex-col pb-24 pt-12">
              <div className="flex items-center justify-between border-b border-white/5 px-6 pb-6">
                <div>
                  <h4 className="mb-1 font-display text-lg font-medium leading-none">Morning Ritual</h4>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Week 2 • Day 12</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <Users className="h-5 w-5 text-white/60" />
                </div>
              </div>

              <div className="flex-1 space-y-4 overflow-hidden p-4">
                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar initials="LV" hue={0} size="w-6 h-6 text-[9px]" />
                      <span className="text-xs font-semibold">Leon V.</span>
                    </div>
                    <span className="text-[10px] text-white/30">Just now</span>
                  </div>
                  <div className="relative aspect-square overflow-hidden rounded-xl border border-white/5 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),linear-gradient(135deg,rgba(79,70,229,0.35),rgba(6,182,212,0.14)_50%,rgba(0,0,0,0.6))]">
                    <div className="absolute inset-0 bg-grid-white opacity-[0.08]" />
                    <div className="absolute left-5 top-5 h-20 w-20 rounded-full border border-white/15 bg-white/8 backdrop-blur-2xl" />
                    <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/25 p-3 backdrop-blur-xl">
                      <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                        <span>Proof Capture</span>
                        <span>98%</span>
                      </div>
                      <MetricBar color="bg-emerald-400" width="92%" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-xl">
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="rounded bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-400">Daily Done</span>
                    <span className="rounded bg-white/5 px-2 py-1 text-[10px] font-bold text-white/40">+12 Streak</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/20">
                    <Flame className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-500">7-Day Squad Streak!</p>
                    <p className="text-[10px] text-white/40">Keep the momentum alive today.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex h-20 items-center justify-around border-t border-white/10 bg-black/80 px-6 pb-2 backdrop-blur-3xl">
              <motion.div whileTap={{ scale: 0.9 }}><Compass className="h-6 w-6 text-white/20" /></motion.div>
              <motion.div whileTap={{ scale: 0.9 }}><Activity className="h-6 w-6 text-white" /></motion.div>
              <motion.div whileHover={{ scale: 1.1 }} className="-mt-8 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#111] bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.2)]">
                <Plus className="h-6 w-6" />
              </motion.div>
              <motion.div whileTap={{ scale: 0.9 }}><MessageSquare className="h-6 w-6 text-white/20" /></motion.div>
              <motion.div whileTap={{ scale: 0.9 }} className="h-6 w-6 rounded-full border border-white/20 bg-indigo-500/20" />
            </div>
          </div>

          <motion.div
            animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -right-20 top-1/4 z-40 hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-2xl md:block"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20"><Check className="h-5 w-5 text-emerald-400" /></div>
              <div>
                <span className="block text-[10px] font-bold tracking-widest text-emerald-400">VERIFIED</span>
                <span className="text-xs font-semibold text-white/90">Proof Accepted</span>
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const AICoachSection = () => (
  <section className="relative bg-[#020202] py-24 md:py-48">
    <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
    <div className="absolute right-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

    <div className="container mx-auto px-6">
      <div className="mx-auto grid max-w-7xl items-center gap-24 lg:grid-cols-2">
        <FadeIn className="order-2 lg:order-1">
          <div className="group relative overflow-hidden rounded-[3rem] border border-white/5 bg-[#050505] p-10 shadow-[0_50px_100px_rgba(139,92,246,0.1)] transition-all duration-700 hover:border-violet-500/30 lg:p-14">
            <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] bg-violet-600/10 blur-[100px] transition-all duration-1000 group-hover:bg-violet-600/20" />
            <div className="mb-12 flex items-center gap-5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <BrainCircuit className="h-7 w-7 text-violet-400" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium">Sidequest AI</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Active Analysis</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="max-w-[85%] rounded-2xl rounded-tl-none border border-white/[0.05] bg-white/[0.04] p-5 transition-colors group-hover:bg-white/[0.06]">
                <p className="text-base font-light italic leading-relaxed text-white/80">
                  &ldquo;You usually miss check-ins on Sundays. Want a lighter 5-minute plan for tonight to keep that 12-day streak alive?&rdquo;
                </p>
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tl-none border border-white/[0.05] bg-white/[0.04] p-5 transition-colors group-hover:bg-white/[0.06]">
                <p className="text-base font-light italic leading-relaxed text-white/80">
                  &ldquo;Your pod has reached 100% squad daily consistency. Leon and Sarah have already checked in today.&rdquo;
                </p>
              </div>
              <div className="relative max-w-[85%] overflow-hidden rounded-2xl rounded-tl-none border border-emerald-500/20 bg-emerald-500/10 p-5 transition-all group-hover:bg-emerald-500/20">
                <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay" />
                <p className="text-base font-medium leading-relaxed text-emerald-100/90">
                  &ldquo;You are not behind. You are only one proof away from getting back on track.&rdquo;
                </p>
              </div>
            </div>

            <motion.div
              className="pointer-events-none absolute bottom-[-100px] left-[-100px] h-64 w-64 rounded-full border border-violet-500/10"
              animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.08, 0.22, 0.08] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </FadeIn>

        <FadeIn className="order-1 lg:order-2">
          <span className="mb-6 block text-xs font-bold uppercase tracking-[0.4em] text-violet-400">Intelligence</span>
          <h2 className="mb-8 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-7xl">
            An AI coach that feels the frequency.
          </h2>
          <p className="mb-10 text-xl font-light leading-relaxed text-white/50">
            Supportive, calm, and highly perceptive. Sidequest AI does not nag; it spots behavioral patterns and offers the path of least resistance to success.
          </p>
          <ul className="space-y-6 text-lg text-white/60">
            {[
              'Pattern detection & slip prevention',
              'Weekly momentum deep-dives',
              'Subtle, non-judgmental recovery nudges',
              'Personalized mission calibration',
            ].map((item) => (
              <li key={item} className="group flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-violet-400/40 transition-all duration-300 group-hover:scale-150 group-hover:bg-violet-400" />
                <span className="font-light transition-colors group-hover:text-white">{item}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </div>
  </section>
);

const SocialProofSection = () => (
  <section className="relative bg-[#020202] py-24 md:py-48">
    <div className="pointer-events-none absolute inset-0 mt-24 h-[300px] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-0 bg-grid-white opacity-[0.03] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
    </div>

    <div className="container relative z-10 mx-auto px-4 sm:px-6">
      <FadeIn className="mx-auto mb-24 max-w-4xl text-balance text-center">
        <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">Target Profiles</span>
        <h2 className="mb-8 font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-7xl">Stop the &ldquo;Day 1&rdquo; loop.</h2>
        <p className="mx-auto max-w-2xl text-xl font-light text-white/40">
          Sidequest identifies common friction points to help you finish what you and every other high-performer keep starting.
        </p>
      </FadeIn>

      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
        {archetypes.map((item, index) => (
          <div key={item.title}>
            <FadeIn delay={index * 0.1}>
            <div className="group relative h-full overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.01] p-10 transition-all duration-500 hover:-translate-y-2 hover:bg-white/[0.03] hover:shadow-[0_20px_50px_rgba(255,255,255,0.02)]">
              <div className="absolute right-0 top-0 p-6 opacity-0 transition-opacity group-hover:opacity-100">
                <Shield className="h-5 w-5 text-white/10" />
              </div>
              <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500/60">{item.label}</span>
              <h3 className="mb-4 font-display text-2xl font-medium transition-colors group-hover:text-white">{item.title}</h3>
              <p className="text-xl font-light italic leading-relaxed text-white/40">&ldquo;{item.desc}&rdquo;</p>
              <div className="mt-10 h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            </FadeIn>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const PricingSection = () => (
  <section className="relative border-t border-white/5 bg-[#0A0A0A] py-16 md:py-32">
    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03),transparent_70%)]" />
    <div className="container relative z-10 mx-auto px-4 sm:px-6">
      <FadeIn className="mx-auto mb-16 max-w-3xl text-center md:mb-24">
        <h2 className="font-display text-4xl font-medium leading-tight tracking-tight md:text-5xl lg:text-6xl">
          Start free. Upgrade when the <br className="hidden md:block" /> mission becomes serious.
        </h2>
      </FadeIn>

      <div className="mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-3 lg:gap-8">
        <FadeIn delay={0.1}>
          <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-8 transition-colors hover:bg-white/[0.02] lg:p-10">
            <h3 className="mb-2 text-lg font-medium text-white/80">Basic Mission</h3>
            <div className="mb-6 font-display text-4xl lg:text-5xl">$0</div>
            <ul className="mb-8 space-y-4 text-sm font-light text-white/60">
              {['1 active pod', 'Daily check-ins', 'Standard matching', 'Pod wall'].map((item) => (
                <li key={item} className="flex items-center gap-3"><Check className="h-4 w-4 text-white/40" /> {item}</li>
              ))}
            </ul>
            <Button to="/signup" variant="outline" className="w-full">
              Join Basic
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.2} className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-[#161005] p-8 shadow-[0_30px_60px_rgba(245,166,35,0.1)] transition-transform duration-500 hover:-translate-y-2 md:-mb-8 md:-mt-8 lg:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="absolute -right-32 -top-32 h-64 w-64 bg-amber-500/10 blur-[80px]" />
            <h3 className="mb-2 font-display text-lg font-medium text-amber-400">Premium</h3>
            <div className="mb-1 font-display text-5xl text-white lg:text-6xl">
              $12<span className="font-sans text-lg text-white/40">/mo</span>
            </div>
            <p className="mb-6 text-xs uppercase tracking-wider text-white/40">Cancel anytime</p>
            <ul className="mb-8 space-y-4 text-sm font-light text-white/80">
              {['3 active pods', 'AI coach insights', 'Advanced analytics', 'Priority matching', 'Graduation history'].map((item) => (
                <li key={item} className="flex items-center gap-3"><Check className="h-4 w-4 text-amber-400" /> {item}</li>
              ))}
            </ul>
            <Button
              to="/signup"
              className="w-full border-transparent bg-amber-500 text-[#050505] shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,166,35,0.5)]"
            >
              Get Premium
            </Button>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="rounded-3xl border border-white/5 bg-white/[0.01] p-8 transition-colors hover:bg-white/[0.02] lg:p-10">
            <h3 className="mb-2 text-lg font-medium text-white/80">Expert-Led Cohorts</h3>
            <div className="mb-6 font-display text-4xl lg:text-5xl">
              $49<span className="font-sans text-lg text-white/40">+</span>
            </div>
            <ul className="mb-8 space-y-4 text-sm font-light text-white/60">
              {['Guided missions', 'Expert resources', 'Premium hand-picked cohorts'].map((item) => (
                <li key={item} className="flex items-center gap-3"><Check className="h-4 w-4 text-white/40" /> {item}</li>
              ))}
            </ul>
            <Button to="/signup" variant="outline" className="w-full">
              View Cohorts
            </Button>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

const FinalCTA = ({ countdown }: { countdown: string }) => (
  <section className="relative overflow-hidden bg-[#020202] py-32 md:py-64">
    <div className="pointer-events-none absolute inset-0 bg-grid-white opacity-[0.02]" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent" />

    <div className="container relative z-10 mx-auto px-6 text-center">
      <FadeIn className="mx-auto max-w-4xl">
        <span className="mb-8 block text-sm font-bold uppercase tracking-[0.4em] text-amber-500">Final Orders</span>
        <h2 className="mb-12 font-display text-5xl font-medium leading-none tracking-tighter md:text-7xl lg:text-9xl">
          Your next 30 days start tonight.
        </h2>
        <p className="mx-auto mb-16 max-w-2xl text-xl font-light leading-relaxed text-white/50 md:text-2xl">
          Stop waiting for motivation. Build the structure that makes discipline inevitable. Join a pod, start your mission.
        </p>
        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Button to="/signup" className="group h-20 w-full px-12 text-xl shadow-[0_20px_50px_rgba(255,255,255,0.1)] sm:w-auto">
            Begin Your Mission
            <ChevronRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button to="/signup" variant="outline" className="h-20 w-full px-12 text-xl sm:w-auto">
            View Quest Board
          </Button>
        </div>
        <p className="mt-12 text-sm uppercase tracking-[0.2em] text-white/20">
          Next pod deployment in: <span className="text-white/60">{countdown}</span>
        </p>
      </FadeIn>
    </div>

    <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-full opacity-10">
      <svg className="h-full w-full" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="none">
        <path d="M0 300L240 180L480 250L720 100L960 220L1200 150L1440 300H0Z" fill="white" />
      </svg>
    </div>
  </section>
);

const Footer = () => (
  <footer className="relative border-t border-white/5 bg-[#020202] py-20">
    <div className="container mx-auto px-6">
      <div className="mb-20 grid gap-12 md:grid-cols-4">
        <div className="col-span-2">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl font-bold tracking-tighter text-black shadow-2xl">S</div>
            <span className="font-display text-3xl font-medium tracking-tight">Sidequest</span>
          </div>
          <p className="mb-8 max-w-sm text-lg font-light leading-relaxed text-white/40">
            A premium mission world for people who want to build identity through shared discipline.
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { label: 'Mission Map', href: '#chapters' },
              { label: 'How Pods Work', href: '#how-it-works' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Sign In', href: '/login', route: true },
            ].map((item) =>
              item.route ? (
                <Link key={item.label} to={item.href} className="text-sm font-medium uppercase tracking-wide text-white/30 transition-colors hover:text-white">
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} className="text-sm font-medium uppercase tracking-wide text-white/30 transition-colors hover:text-white">
                  {item.label}
                </a>
              ),
            )}
          </div>
        </div>

        <div>
          <h4 className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-white">Protocol</h4>
          <ul className="space-y-4">
            {[
              { label: 'Chapters', href: '#chapters' },
              { label: 'App Experience', href: '#pod-experience' },
              { label: 'Quest Map', href: '#how-it-works' },
              { label: 'Pricing', href: '#pricing' },
            ].map((item) => (
              <li key={item.label}><a href={item.href} className="font-light text-white/40 transition-colors hover:text-white">{item.label}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-8 text-sm font-bold uppercase tracking-[0.2em] text-white">Resources</h4>
          <ul className="space-y-4">
            {[
              { label: 'Mission Guide', href: '#how-it-works' },
              { label: 'Squad Rules', href: '#chapters' },
              { label: 'Start Mission', href: '/signup', route: true },
              { label: 'Sign In', href: '/login', route: true },
            ].map((item) => (
              <li key={item.label}>
                {item.route ? (
                  <Link to={item.href} className="font-light text-white/40 transition-colors hover:text-white">{item.label}</Link>
                ) : (
                  <a href={item.href} className="font-light text-white/40 transition-colors hover:text-white">{item.label}</a>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-12 md:flex-row">
        <p className="text-xs uppercase tracking-widest text-white/20">© 2026 Mission Control. All rights reserved.</p>
        <p className="text-xs uppercase tracking-widest text-white/20">Sidequest • Chapter 01 • V1.0.42</p>
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  const missionWindowLabel = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date()).toUpperCase();
  const [countdown, setCountdown] = useState(() => formatCountdown(POD_DEPLOYMENT_INTERVAL_MS));

  useEffect(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main.flex-grow');

    const previousHeaderDisplay = header instanceof HTMLElement ? header.style.display : '';
    const previousFooterDisplay = footer instanceof HTMLElement ? footer.style.display : '';
    const previousMainPaddingTop = main instanceof HTMLElement ? main.style.paddingTop : '';

    if (header instanceof HTMLElement) header.style.display = 'none';
    if (footer instanceof HTMLElement) footer.style.display = 'none';
    if (main instanceof HTMLElement) main.style.paddingTop = '0px';

    return () => {
      if (header instanceof HTMLElement) header.style.display = previousHeaderDisplay;
      if (footer instanceof HTMLElement) footer.style.display = previousFooterDisplay;
      if (main instanceof HTMLElement) main.style.paddingTop = previousMainPaddingTop;
    };
  }, []);

  useEffect(() => {
    const readStoredDeploymentAt = () => {
      const storedValue = window.localStorage.getItem(DEPLOYMENT_TIMESTAMP_STORAGE_KEY);
      const storedTimestamp = storedValue ? Number(storedValue) : Number.NaN;

      if (Number.isFinite(storedTimestamp) && storedTimestamp > Date.now()) {
        return storedTimestamp;
      }

      const nextDeploymentAt = Date.now() + POD_DEPLOYMENT_INTERVAL_MS;
      window.localStorage.setItem(DEPLOYMENT_TIMESTAMP_STORAGE_KEY, String(nextDeploymentAt));
      return nextDeploymentAt;
    };

    let deploymentAt = readStoredDeploymentAt();
    const updateCountdown = () => {
      const timeLeft = deploymentAt - Date.now();

      if (timeLeft <= 0) {
        deploymentAt = Date.now() + POD_DEPLOYMENT_INTERVAL_MS;
        window.localStorage.setItem(DEPLOYMENT_TIMESTAMP_STORAGE_KEY, String(deploymentAt));
      }

      setCountdown(formatCountdown(deploymentAt - Date.now()));
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] font-sans text-white selection:bg-white/20">
      <Navbar />
      <main>
        <HeroSection missionWindowLabel={missionWindowLabel} />
        <ProblemSection />
        <div id="chapters">
          <ChaptersSection />
        </div>
        <TimelineSection />
        <div id="pod-experience">
          <PodExperience />
        </div>
        <AICoachSection />
        <SocialProofSection />
        <div id="pricing">
          <PricingSection />
        </div>
        <FinalCTA countdown={countdown} />
      </main>
      <Footer />
    </div>
  );
}
