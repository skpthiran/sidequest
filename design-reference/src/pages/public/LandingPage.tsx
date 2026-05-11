import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Shield, Compass, Flame, Users, BookOpen, 
  Briefcase, Heart, Moon, Zap, Activity, Sparkles, 
  MessageSquare, CircleDashed, CheckCircle2, ChevronRight, X,
  BrainCircuit, Check, TrendingUp, Plus
} from 'lucide-react';

// -------------------------------------------------------------
// Shared / UI Components
// -------------------------------------------------------------

const Button = ({ children, to, variant = "primary", className = "", ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants: any = {
    primary: "bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    outline: "border border-white/10 hover:border-white/30 backdrop-blur-md text-white hover:bg-white/5",
    ghost: "text-white/60 hover:text-white hover:bg-white/5",
  };

  const content = (
    <>
      {children}
    </>
  );

  if (to && to.startsWith('#')) {
    return (
      <a href={to} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
        {content}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {content}
    </button>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Chapters', href: '#chapters' },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-bold text-xl tracking-tighter group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">S</div>
          <span className="text-2xl font-display font-medium tracking-tight">Sidequest</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6 px-6 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-sm font-medium text-white/50 hover:text-white transition-colors">{link.name}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Button to="/login" variant="ghost" className="px-6 h-11 text-sm">Login</Button>
            <Button to="/signup" className="px-6 h-11 text-sm">Start Mission</Button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10"
          onClick={() => setMobileMenuOpen(true)}
        >
          <div className="w-6 h-[2px] bg-white relative before:absolute before:-top-2 before:left-0 before:w-6 before:h-[2px] before:bg-white after:absolute after:top-2 after:left-0 after:w-6 after:h-[2px] after:bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] bg-[#020202] p-8 flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center gap-8 mb-12">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-display font-medium tracking-tight hover:text-white/60 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex flex-col w-full gap-4 max-w-xs">
              <Button to="/login" variant="outline" className="h-16 w-full text-lg">Login</Button>
              <Button to="/signup" className="h-16 w-full text-lg">Start Mission</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const FadeIn = ({ children, delay = 0, className = "" }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const BackgroundParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 2 + 1 + 'px',
          height: Math.random() * 2 + 1 + 'px',
          background: 'rgba(255, 255, 255, 0.3)',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
        }}
        animate={{
          y: [0, -200 - Math.random() * 200],
          x: [0, (Math.random() - 0.5) * 50],
          opacity: [0, Math.random() * 0.5 + 0.1, 0],
        }}
        transition={{
          duration: Math.random() * 20 + 10,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 10,
        }}
      />
    ))}
  </div>
);

const CinematicAtmosphere = () => (
  <div className="absolute inset-0 z-0 pointer-events-none select-none">
    {/* Atmospheric Fog */}
    <motion.div 
      animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-radial-gradient from-indigo-500/10 via-transparent to-transparent blur-[150px]" 
    />
    {/* Map Grid */}
    <div className="absolute inset-0 bg-grid-white opacity-[0.03] mix-blend-overlay [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent_70%)]" />
    <BackgroundParticles />
  </div>
);

const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center pt-24 overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Mountain Silhouette / Horizon */}
        <div className="absolute bottom-0 left-0 right-0 h-[60vh] z-10">
          <svg className="w-full h-full opacity-20" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#020202" d="M0,224L48,202.7C96,181,192,139,288,144C384,149,480,203,576,213.3C672,224,768,192,864,165.3C960,139,1056,117,1152,122.7C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-violet-600/15 via-amber-500/10 to-cyan-500/15 blur-[140px] rounded-full mix-blend-screen opacity-60" />
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full animate-pulse" />
        
        {/* Golden Light Beam */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-[70vh] bg-gradient-to-t from-amber-500/40 via-amber-500/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[400px] bg-amber-500/5 blur-[80px]" />

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
        
        {/* Animated Map Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" viewBox="0 0 1440 800">
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            d="M-100,500 Q300,400 720,200 T1540,500" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.5" 
          />
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
            d="M-50,600 Q400,700 800,200 T1600,100" 
            fill="none" 
            stroke="white" 
            strokeWidth="0.5" 
          />
        </svg>

        <CinematicAtmosphere />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-12 lg:mt-0">
        
        {/* Left Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 text-xs font-medium uppercase tracking-[0.2em] text-white/90 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Join the Next Chapter
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-display font-medium leading-[0.95] tracking-tight mb-8">
            Your next 30 days <br className="hidden sm:block"/>
            <span className="text-white/40 italic font-light">shouldn't be</span> <br className="hidden sm:block"/>
            survived alone.
          </h1>
          <p className="text-lg sm:text-2xl text-white/60 leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0 font-light">
            Match with a private mission pod of 4–8 people in the same chapter of life. 
            Check in daily, build momentum, and finish what you keep starting.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
            <Button to="/signup" className="w-full sm:w-auto h-16 text-lg px-10 group bg-white text-black">
              Start Your Mission
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button to="#how-it-works" variant="outline" className="w-full sm:w-auto h-16 text-lg px-10 hover:bg-white/5">
              How Pods Work
            </Button>
          </div>
        </motion.div>

        {/* Right Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl justify-self-center lg:justify-self-end mt-12 lg:mt-0 perspective-1000"
        >
          {/* Main Floating Card */}
          <motion.div 
            animate={{ 
              y: [-15, 15, -15],
              rotateX: [2, -2, 2],
              rotateY: [1, -1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-[#0A0F1C]/80 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-8 shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/10"
          >
            {/* Dashboard Inner Shadow & Highlights */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none opacity-40" />
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/15 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h3 className="font-display font-medium text-2xl tracking-tight text-white/95">Physical Discipline</h3>
                <p className="text-white/40 text-sm font-medium tracking-wide">30 DAY MISSION • <span className="text-amber-400">MAY 2026</span></p>
              </div>
              <div className="flex -space-x-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#0A0F1C] bg-gradient-to-br from-indigo-400 to-cyan-400 shadow-xl overflow-hidden`} style={{ filter: `hue-rotate(${i * 30}deg)`}}>
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=poduser${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Check-in UI */}
            <div className="space-y-6 relative z-10">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between transition-all hover:bg-white/[0.08]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white/90">Daily Proof Verified</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest">Momentum +15%</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <Flame className="w-6 h-6 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                   <span className="text-[10px] font-bold text-amber-500 mt-1">STREAK 12</span>
                </div>
              </motion.div>

              {/* Progress track */}
              <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-white/60 font-medium">Pod Momentum</span>
                  <span className="text-emerald-400 font-bold tracking-tight">87.4%</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "87.4%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.4)]" 
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] animate-shimmer" />
                </div>
              </div>
            </div>
            
            {/* Mission Stats */}
            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4 relative z-10">
               <div>
                 <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Check-ins</p>
                 <p className="text-white font-display text-xl">12/30</p>
               </div>
               <div>
                 <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Squad Rank</p>
                 <p className="text-white font-display text-xl">#2</p>
               </div>
               <div>
                 <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">XP Gained</p>
                 <p className="text-emerald-400 font-display text-xl">+1,240</p>
               </div>
            </div>

            {/* Mini overlay chips */}
            <motion.div 
              animate={{ y: [-8, 8, -8], x: [-5, 5, -5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-12 top-24 bg-[#0A0F1C] border border-white/20 p-4 rounded-2xl flex items-center gap-3 shadow-2xl z-20 group hover:border-amber-500/50 transition-colors"
            >
               <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                 <Shield className="w-5 h-5 text-amber-500" />
               </div>
               <div>
                 <span className="text-[10px] font-bold text-amber-500 block">TIER 2 MISSION</span>
                 <span className="text-xs font-semibold text-white/90">Elite Status Unlocked</span>
               </div>
            </motion.div>

            <motion.div 
              animate={{ y: [8, -8, 8], x: [5, -5, 5] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute -left-16 bottom-20 bg-[#0A0F1C] border border-white/20 p-4 flex items-center gap-3 rounded-2xl shadow-2xl z-20"
            >
               <BrainCircuit className="w-6 h-6 text-violet-400 drop-shadow-[0_0_5px_rgba(167,139,250,0.5)]" />
               <div className="max-w-[120px]">
                 <span className="block text-[10px] font-bold text-violet-400">AI COACH</span>
                 <span className="text-xs font-medium text-white/80 leading-tight">Momentum dip detected. Rally the pod?</span>
               </div>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ProblemSection = () => {
  return (
    <section className="py-24 relative z-10 overflow-hidden bg-[#020202]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-20 text-balance">
          <FadeIn>
            <h2 className="text-4xl md:text-6xl font-display font-medium tracking-tight mb-6 leading-tight">
              Discipline breaks <br/> when you disappear.
            </h2>
            <p className="text-xl text-white/50 leading-relaxed font-light">
              Most people don't fail because they're weak. They fail because isolation leads to overthinking, and overthinking leads to quitting.
            </p>
          </FadeIn>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Alone Card */}
          <FadeIn direction="left">
            <div className="group relative p-10 lg:p-12 rounded-[2.5rem] border border-white/5 bg-[#050505] overflow-hidden min-h-[500px] flex flex-col hover:border-white/10 transition-colors grayscale opacity-70 hover:opacity-100 duration-500">
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-900/10 blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(100,100,100,0.05),transparent_50%)]" />
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-y-[-10deg]" />
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                  <span className="text-2xl italic font-serif opacity-40">A</span>
                </div>
                <h3 className="text-3xl font-display font-medium text-white/40">The "Alone" Cycle</h3>
                <p className="text-white/30 text-lg font-light leading-relaxed">
                  No structure. No witness. No return path. The heavy feeling of starting over for the 10th time this year.
                </p>
              </div>

              <div className="relative z-10 mt-auto pt-10">
                <div className="flex gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`flex-1 h-2 rounded-full ${i < 3 ? 'bg-white/10' : 'bg-red-500/10 border border-red-500/20'}`} />
                  ))}
                </div>
                <p className="text-[10px] text-red-400/50 font-mono mt-4 uppercase tracking-[0.2em] font-bold">Inconsistency Detected</p>
              </div>
            </div>
          </FadeIn>

          {/* Pod Card */}
          <FadeIn direction="right">
            <div className="group relative p-10 lg:p-12 rounded-[2.5rem] border border-amber-500/20 bg-[#080B14] overflow-hidden min-h-[500px] flex flex-col shadow-[0_30px_60px_rgba(245,158,11,0.05)] hover:border-amber-500/40 transition-all">
              <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/10 blur-[100px] group-hover:bg-amber-500/20 transition-all duration-700" />
                <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
                  <motion.circle 
                    cx="200" cy="200" r="100" fill="none" stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="5 5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                </svg>
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">
                  <Flame className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-3xl font-display font-medium text-white/95">In a Pod</h3>
                <p className="text-white/60 text-lg font-light leading-relaxed">
                  Daily proof. Shared momentum. People who expect you back. It's impossible to hide when your squad is watching.
                </p>
              </div>

              <div className="relative z-10 mt-auto pt-10">
                <div className="flex gap-4 items-center">
                  <div className="flex -space-x-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#090C15] bg-amber-500/20 shadow-xl overflow-hidden ring-1 ring-white/10">
                         <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=squad-${i}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-500/50 to-transparent relative">
                    <motion.div 
                      animate={{ left: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 blur-md"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-amber-400 font-mono mt-4 uppercase tracking-[0.2em] font-bold animate-pulse">MISSION ACTIVE • WEEK 2</p>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
};

const ChaptersSection = () => {
  const chapters = [
    { 
      title: "Fitness Discipline", 
      icon: Activity, 
      theme: "from-orange-600/20 via-red-600/10 to-amber-600/5", 
      border: "group-hover:border-orange-500/50", 
      glow: "bg-orange-500/20", 
      desc: "30 days of physical intensity. From morning runs to heavy lifting pods.",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      title: "Study Grind", 
      icon: BookOpen, 
      theme: "from-blue-600/20 via-indigo-600/10 to-cyan-600/5", 
      border: "group-hover:border-blue-500/50", 
      glow: "bg-blue-500/20", 
      desc: "The deep work ritual. Midnight libraries and collective focus.",
      img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      title: "Career Focus", 
      icon: Briefcase, 
      theme: "from-emerald-600/20 via-teal-600/10 to-green-600/5", 
      border: "group-hover:border-emerald-500/50", 
      glow: "bg-emerald-500/20", 
      desc: "Skill leverage and professional momentum. For industry leaders.",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      title: "Breakup Recovery", 
      icon: Heart, 
      theme: "from-rose-600/20 via-pink-600/10 to-violet-600/5", 
      border: "group-hover:border-rose-500/50", 
      glow: "bg-rose-500/20", 
      desc: "Healing is a discipline. A 30-day reset for the mind and heart.",
      img: "https://images.unsplash.com/photo-1516589174418-0dd42ce11f47?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      title: "Sleep Reset", 
      icon: Moon, 
      theme: "from-indigo-600/20 via-slate-900/40 to-transparent", 
      border: "group-hover:border-indigo-400/50", 
      glow: "bg-indigo-400/20", 
      desc: "Circadian hygiene. Fixing the engine so you can win the day.",
      img: "https://images.unsplash.com/photo-1511295742364-917e70375dc3?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      title: "Founder Mode", 
      icon: Zap, 
      theme: "from-violet-600/20 via-purple-600/10 to-transparent", 
      border: "group-hover:border-violet-400/50", 
      glow: "bg-violet-400/20", 
      desc: "Building in public. Weekly deployments and MVP-shipping pods.",
      img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
    },
  ];

  return (
    <section className="py-24 md:py-40 relative z-10 overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
          <FadeIn className="max-w-xl">
            <span className="text-amber-500 font-mono text-xs uppercase tracking-[0.3em] font-bold mb-4 block">Selection</span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight mb-6">Choose your chapter.</h2>
            <p className="text-xl text-white/50 font-light leading-relaxed">
              Missions are curated by intense focuses. You aren't just joining an app; you're entering a 30-day crucible.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
             <Button to="/signup" variant="outline" className="group h-14 px-8 rounded-full border-white/10 hover:border-white/30 backdrop-blur-md">
               Browse All Missions
               <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
             </Button>
          </FadeIn>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {chapters.map((chapter, i) => {
            const Icon = chapter.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                <Link 
                  to="/signup"
                  className={`group block h-full relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#080808] p-10 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.8)] ${chapter.border}`}
                >
                  {/* Cinematic Background Visual */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-10 group-hover:opacity-30 transition-opacity duration-1000 scale-105 group-hover:scale-100" 
                      style={{ backgroundImage: `url(${chapter.img})` }} 
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${chapter.theme} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                    <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
                    <div className={`absolute -top-32 -right-32 w-64 h-64 rounded-full blur-[100px] ${chapter.glow} opacity-0 group-hover:opacity-100 transition-all duration-1000`} />
                    <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
                  </div>

                  {/* Glass Shine */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                    <div className="absolute top-0 left-[20%] w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-24">
                      <div className={`w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500 shadow-2xl`}>
                        <Icon className={`w-7 h-7 text-white`} />
                      </div>
                      <div className="flex flex-col items-end gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">
                        <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">30 Days</span>
                        <span className="bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">Elite Squad</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <h3 className="text-3xl font-display font-medium mb-4 tracking-tight group-hover:text-white transition-colors">{chapter.title}</h3>
                      <p className="text-white/40 text-lg mb-8 leading-relaxed font-light group-hover:text-white/60 transition-colors">{chapter.desc}</p>
                      
                      <div className="inline-flex items-center gap-3 py-3 px-6 rounded-full bg-white/5 border border-white/10 text-sm font-semibold text-white/40 group-hover:bg-white group-hover:text-black transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transform group-hover:scale-105">
                        Enter Mission 
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  );
};

const TimelineSection = () => {
  const steps = [
    { num: "01", title: "Select your life chapter", desc: "Choose your focus area: physical health, deep study, career, or recovery." },
    { num: "02", title: "Form your squad", desc: "We place you in a private pod of 4-8 peers in the same season as you." },
    { num: "03", title: "Prove the work", desc: "Upload daily proof. A photo, a note, a commit. Something that says you showed up." },
    { num: "04", title: "Maintain momentum", desc: "Your squad and AI coach notice patterns. If you slip, the systems catch you." },
    { num: "05", title: "Graduate to elite", desc: "Finish the 30 days. Unlock higher-tier missions and long-term discipline." },
  ];

  return (
    <section id="how-it-works" className="py-32 md:py-48 relative z-10 bg-[#020202] overflow-hidden border-y border-white/5">
      {/* Background Decorative Map Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 900" fill="none">
          <motion.path 
            d="M-50 100 Q 300 200 720 150 T 1490 200" 
            stroke="url(#map-line)" strokeWidth="1" strokeDasharray="10 15"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
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

      <div className="container mx-auto px-6 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto mb-24 md:mb-40 text-balance">
          <span className="text-white/30 font-mono text-xs uppercase tracking-[0.4em] font-bold mb-6 block">The Operations</span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight mb-8">
            From intention to habit in 30 days.
          </h2>
          <p className="text-xl text-white/40 font-light max-w-2xl mx-auto">
            A precise journey designed to replace erratic motivation with structural consistency.
          </p>
        </FadeIn>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical map-style path */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/[0.03] -translate-x-1/2 hidden md:block" />
          
          <div className="space-y-24 md:space-y-48">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={0.1}>
                <div className={`flex flex-col md:flex-row items-center gap-12 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`flex-1 w-full text-center ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} group`}>
                    <div className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-white/40 mb-6 uppercase tracking-widest tracking-[0.3em] font-bold transition-all group-hover:bg-white group-hover:text-black group-hover:border-white">
                      Phase {step.num}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-display font-medium mb-6 tracking-tight text-white/90 group-hover:translate-x-2 transition-transform duration-500 ease-out">{step.title}</h3>
                    <p className="text-lg text-white/40 leading-relaxed font-light">{step.desc}</p>
                  </div>
                  
                  {/* Map Node */}
                  <div className="relative z-10 flex-shrink-0 group">
                    <div className="w-24 h-24 rounded-full border-2 border-white/5 bg-[#050505] flex items-center justify-center transition-all duration-700 group-hover:border-white/40 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                       <span className="text-2xl font-mono text-white/10 group-hover:text-white/60 transition-colors">{step.num}</span>
                    </div>
                    {/* Animated Pulsing Ring */}
                    <div className="absolute inset-0 rounded-full bg-white/5 animate-ping opacity-20 pointer-events-none group-hover:opacity-40" />
                  </div>
                  
                  <div className="flex-1 hidden md:block" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PodExperience = () => {
  return (
    <section className="py-24 md:py-48 relative z-10 overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none opacity-40" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none opacity-40" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 lg:gap-32 items-center max-w-7xl mx-auto">
          
          <FadeIn>
            <span className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] font-bold mb-6 block">Environment</span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight mb-8 leading-tight">
              Not a feed.<br/>A private squad.
            </h2>
            <p className="text-xl text-white/50 mb-12 font-light leading-relaxed">
              We've removed everything that makes social media exhausting. No infinite scroll, no public counts, no performative posting.
            </p>
            
            <ul className="space-y-8 mb-12">
              {[
                { title: "Small private pods", desc: "Synchronous accountability with only 4–8 people." },
                { title: "No infinite scroll", desc: "Open, check-in, support your squad, and get back to life." },
                { title: "Proof-based social", desc: "The only currency is showing up and doing the work." },
              ].map((item, i) => (
                <li key={i} className="group flex items-start gap-5">
                  <div className="mt-1 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-all">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-white/90 mb-1">{item.title}</h4>
                    <p className="text-white/40 font-light">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>

            <Button to="/signup" variant="primary" className="h-16 px-10 rounded-full group">
              Explore Pod Wall 
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </FadeIn>

          {/* App UI Mockup - Upgraded */}
          <FadeIn direction="right" className="relative w-full max-w-sm mx-auto">
            {/* Phone Frame */}
            <div className="relative rounded-[3rem] border-[12px] border-[#111] ring-1 ring-white/20 bg-[#020202] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden aspect-[9/19] rotate-y-10-neg rotate-x-5 group hover:rotate-y-0 hover:rotate-x-0 transition-all duration-1000 ease-out perspective-1000">
               <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/40 pointer-events-none z-30" />
               
               {/* Screen Content */}
               <div className="absolute inset-0 flex flex-col pt-12 pb-24 h-full">
                 {/* App Header */}
                 <div className="px-6 pb-6 border-b border-white/5 flex justify-between items-center">
                    <div>
                      <h4 className="font-display font-medium text-lg leading-none mb-1">Morning Ritual</h4>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Week 2 • Day 12</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white/60" />
                    </div>
                 </div>

                 {/* Feed List */}
                 <div className="flex-1 overflow-hidden p-4 space-y-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-500 shadow-lg" />
                            <span className="text-xs font-semibold">Leon V.</span>
                         </div>
                         <span className="text-[10px] text-white/30">Just now</span>
                       </div>
                       <div className="aspect-square rounded-xl bg-white/5 border border-white/5 flex items-center justify-center relative overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1517836762468-4c941df31d7d?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="workout" />
                          <div className="relative z-10 w-12 h-12 rounded-full border border-white/20 backdrop-blur-xl flex items-center justify-center">
                             <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Daily Done</span>
                          <span className="text-[10px] font-bold text-white/40 bg-white/5 px-2 py-1 rounded">+12 Streak</span>
                       </div>
                    </div>
                    
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                          <Flame className="w-5 h-5 text-amber-500" />
                       </div>
                       <div>
                          <p className="text-xs font-bold text-amber-500">7-Day Squad Streak!</p>
                          <p className="text-[10px] text-white/40">Keep the momentum alive today.</p>
                       </div>
                    </div>
                 </div>
               </div>

               {/* App Navigation */}
               <div className="absolute bottom-0 inset-x-0 h-20 bg-black/80 backdrop-blur-3xl border-t border-white/10 flex justify-around items-center px-6 pb-2">
                  <motion.div whileTap={{ scale: 0.9 }}><Compass className="w-6 h-6 text-white/20" /></motion.div>
                  <motion.div whileTap={{ scale: 0.9 }}><Activity className="w-6 h-6 text-white" /></motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center -mt-8 border-4 border-[#111] shadow-[0_10px_20px_rgba(255,255,255,0.2)]"
                  >
                    <Plus className="w-6 h-6" />
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.9 }}><MessageSquare className="w-6 h-6 text-white/20" /></motion.div>
                  <motion.div whileTap={{ scale: 0.9 }} className="w-6 h-6 rounded-full border border-white/20 bg-indigo-500/20" />
               </div>
            </div>

            {/* Decorative Side Chips */}
            <motion.div 
              animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-20 top-1/4 bg-white/5 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-2xl z-40 hidden md:block"
            >
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Check className="w-5 h-5 text-emerald-400" /></div>
                 <div>
                    <span className="text-[10px] font-bold text-emerald-400 block tracking-widest">VERIFIED</span>
                    <span className="text-xs font-semibold text-white/90">Proof Accepted</span>
                 </div>
              </div>
            </motion.div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
};

const AICoachSection = () => {
  return (
    <section className="py-24 md:py-48 relative z-10 bg-[#020202]">
      {/* Cinematic Fog & Grid */}
      <div className="absolute inset-0 bg-grid-white opacity-[0.015]" />
      <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
          
          <FadeIn className="order-2 lg:order-1 relative">
             <div className="p-10 lg:p-14 rounded-[3rem] border border-white/5 bg-[#050505] shadow-[0_50px_100px_rgba(139,92,246,0.1)] relative overflow-hidden group hover:border-violet-500/30 transition-all duration-700">
               <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 blur-[100px] pointer-events-none group-hover:bg-violet-600/20 transition-all duration-1000" />
               <div className="flex items-center gap-5 mb-12">
                 <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                   <BrainCircuit className="w-7 h-7 text-violet-400" />
                 </div>
                 <div>
                   <h3 className="text-2xl font-display font-medium">Sidequest AI</h3>
                   <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Active Analysis</span>
                 </div>
               </div>

               <div className="space-y-6">
                 <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.05] rounded-tl-none max-w-[85%] group-hover:bg-white/[0.06] transition-colors">
                   <p className="text-base text-white/80 leading-relaxed font-light italic">
                     "You usually miss check-ins on Sundays. Want a lighter 5-minute plan for tonight to keep that 12-day streak alive?"
                   </p>
                 </div>
                 <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.05] rounded-tl-none max-w-[85%] ml-auto group-hover:bg-white/[0.06] transition-colors">
                    <p className="text-base text-white/80 leading-relaxed font-light italic">
                      "Your pod has reached 100% squad daily consistency. Leon and Sarah have already checked in today."
                    </p>
                 </div>
                 <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 rounded-tl-none max-w-[85%] relative overflow-hidden group-hover:bg-emerald-500/20 transition-all">
                   <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay" />
                   <p className="text-base text-emerald-100/90 leading-relaxed font-medium">
                     "You are not behind. You are only one 'proof' away from getting back on track."
                   </p>
                 </div>
               </div>
               
               {/* Decorative Radar Lines */}
               <div className="absolute bottom-[-100px] left-[-100px] w-64 h-64 border border-violet-500/10 rounded-full animate-ping opacity-20" />
             </div>
          </FadeIn>

          <FadeIn className="order-1 lg:order-2">
            <span className="text-violet-400 font-mono text-xs uppercase tracking-[0.4em] font-bold mb-6 block">Intelligence</span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight mb-8 leading-tight">
              An AI coach that feels the frequency.
            </h2>
            <p className="text-xl text-white/50 mb-10 font-light leading-relaxed">
              Supportive, calm, and highly perceptive. Sidequest AI doesn't nag; it spots behavioral patterns and offers the path of least resistance to success.
            </p>
            <ul className="space-y-6 text-lg text-white/60">
              {[
                'Pattern detection & slip prevention', 
                'Weekly momentum deep-dives', 
                'Subtle, non-judgmental recovery nudges', 
                'Personalized mission calibration'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-violet-400/40 group-hover:bg-violet-400 group-hover:scale-150 transition-all duration-300" />
                  <span className="font-light group-hover:text-white transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>

        </div>
      </div>
    </section>
  );
};

const SocialProofSection = () => {
  const archetypes = [
    { title: "The Sprinter", desc: "Studies intensely for 3 days, then disappears for a week.", label: "Needs consistency over intensity." },
    { title: "The Solo Founder", desc: "Has a massive vision but struggles with daily mundane execution.", label: "Needs a daily shipped proof." },
    { title: "The Rebuilder", desc: "Healing from heartbreak and trying to rediscover a routine.", label: "Needs supportive witnesses." },
    { title: "The Empty Gym-Goer", desc: "Can't find a reason to go when nobody notices they stayed home.", label: "Needs shared stakes." }
  ];

  return (
    <section className="py-24 md:py-48 relative z-10 bg-[#020202]">
      {/* Cinematic Map Backdrop for Social Proof */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden h-[300px] mt-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-grid-white opacity-[0.03] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <FadeIn className="text-center max-w-4xl mx-auto mb-24 text-balance">
          <span className="text-white/20 font-mono text-[10px] uppercase tracking-[0.5em] font-bold mb-6 block">Target Profiles</span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tight mb-8 leading-tight">
            Stop the "Day 1" loop.
          </h2>
          <p className="text-xl text-white/40 font-light max-w-2xl mx-auto">
            Sidequest identifies common friction points to help you finish what you and every other high-performer keep starting.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {archetypes.map((item, i) => (
            <FadeIn key={i} delay={0.1 * i}>
            <div className="group p-10 rounded-[2rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,255,255,0.02)] h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <Shield className="w-5 h-5 text-white/10" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-500/60 mb-6 block font-bold">{item.label}</span>
              <h3 className="text-2xl font-medium mb-4 font-display group-hover:text-white transition-colors">{item.title}</h3>
              <p className="text-white/40 italic font-light text-xl leading-relaxed">"{item.desc}"</p>
              
              <div className="mt-10 h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
            </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingSection = () => {
  return (
    <section className="py-16 md:py-32 relative z-10 bg-[#0A0A0A] border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03),_transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-6 leading-tight">
            Start free. Upgrade when the<br/>mission becomes serious.
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-center">
          
          {/* Basic */}
          <FadeIn delay={0.1}>
          <div className="p-8 lg:p-10 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
            <h3 className="text-lg font-medium text-white/80 mb-2">Basic Mission</h3>
            <div className="text-4xl lg:text-5xl font-display mb-6">$0</div>
            <ul className="space-y-4 mb-8 text-sm text-white/60 font-light">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-white/40"/> 1 active pod</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-white/40"/> Daily check-ins</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-white/40"/> Standard matching</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-white/40"/> Pod wall</li>
            </ul>
            <Button to="/signup" variant="outline" className="w-full">Join Basic</Button>
          </div>
          </FadeIn>

          {/* Premium */}
          <FadeIn delay={0.2} className="relative">
          <div className="p-8 lg:p-10 rounded-3xl border border-amber-500/30 bg-[#161005] relative overflow-hidden md:-mt-8 md:mb-8 shadow-[0_30px_60px_rgba(245,166,35,0.1)] hover:-translate-y-2 transition-transform duration-500">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-amber-500/10 blur-[80px]" />
            <h3 className="text-lg font-medium text-amber-400 mb-2 font-display">Premium</h3>
            <div className="text-5xl lg:text-6xl font-display mb-1 text-white">$12<span className="text-lg text-white/40 font-sans">/mo</span></div>
            <p className="text-xs text-white/40 mb-6 uppercase tracking-wider">Cancel anytime</p>
            <ul className="space-y-4 mb-8 text-sm text-white/80 font-light">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-amber-400"/> 3 active pods</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-amber-400"/> AI coach insights</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-amber-400"/> Advanced analytics</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-amber-400"/> Priority matching</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-amber-400"/> Graduation history</li>
            </ul>
            <Button to="/signup" variant="primary" className="w-full bg-amber-500 hover:bg-amber-400 text-[#050505] border-transparent shadow-[0_0_20px_rgba(245,166,35,0.3)] hover:shadow-[0_0_30px_rgba(245,166,35,0.5)]">Get Premium</Button>
          </div>
          </FadeIn>

          {/* Expert */}
          <FadeIn delay={0.3}>
          <div className="p-8 lg:p-10 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
            <h3 className="text-lg font-medium text-white/80 mb-2">Expert-Led Cohorts</h3>
            <div className="text-4xl lg:text-5xl font-display mb-6">$49<span className="text-lg text-white/40 font-sans">+</span></div>
            <ul className="space-y-4 mb-8 text-sm text-white/60 font-light">
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-white/40"/> Guided missions</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-white/40"/> Expert resources</li>
              <li className="flex items-center gap-3"><Check className="w-4 h-4 text-white/40"/> Premium hand-picked cohorts</li>
            </ul>
            <Button to="/signup" variant="outline" className="w-full">View Cohorts</Button>
          </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
};

const FinalCTA = () => {
  return (
    <section className="py-32 md:py-64 relative z-10 overflow-hidden bg-[#020202]">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <FadeIn className="max-w-4xl mx-auto">
          <span className="text-amber-500 font-mono text-sm uppercase tracking-[0.4em] font-bold mb-8 block">Final Orders</span>
          <h2 className="text-5xl md:text-7xl lg:text-9xl font-display font-medium tracking-tighter mb-12 leading-none text-balance">
            Your next 30 days start tonight.
          </h2>
          <p className="text-xl md:text-2xl text-white/50 mb-16 font-light max-w-2xl mx-auto leading-relaxed">
            Stop waiting for motivation. Build the structure that makes discipline inevitable. Join a pod, start your mission.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button to="/signup" className="h-20 px-12 rounded-full text-xl group w-full sm:w-auto shadow-[0_20px_50px_rgba(255,255,255,0.1)]">
              Begin Your Mission
              <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button to="/missions" variant="outline" className="h-20 px-12 rounded-full text-xl border-white/10 hover:border-white/30 backdrop-blur-md w-full sm:w-auto">
              View Quest Board
            </Button>
          </div>
          
          <p className="mt-12 text-sm font-mono text-white/20 uppercase tracking-[0.2em]">Next pod deployment in: <span className="text-white/60">04:22:15</span></p>
        </FadeIn>
      </div>
      
      {/* Mountain Silhouettes at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] opacity-10 pointer-events-none">
        <svg className="w-full h-full preserve-aspect-none" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="none">
          <path d="M0 300L240 180L480 250L720 100L960 220L1200 150L1440 300H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 relative z-10 border-t border-white/5 bg-[#020202]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-2xl tracking-tighter shadow-2xl">S</div>
               <span className="text-3xl font-display font-medium tracking-tight">Sidequest</span>
            </div>
            <p className="text-white/40 font-light text-lg max-w-sm leading-relaxed mb-8">
              A premium mission world for people who want to build identity through shared discipline.
            </p>
            <div className="flex gap-6">
               {['Twitter', 'Instagram', 'Discord', 'Threads'].map((social) => (
                 <a key={social} href="#" className="text-white/30 hover:text-white transition-colors text-sm font-medium tracking-wide uppercase">{social}</a>
               ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-8">Protocol</h4>
            <ul className="space-y-4">
              {['Chapters', 'App Experience', 'Quest Map', 'Founders'].map((item) => (
                <li key={item}><a href="#" className="text-white/40 hover:text-white transition-colors font-light">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-[0.2em] mb-8">Resources</h4>
            <ul className="space-y-4">
              {['The Reset', 'Mission Guide', 'Squad Rules', 'Privacy Protocol'].map((item) => (
                <li key={item}><a href="#" className="text-white/40 hover:text-white transition-colors font-light">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-white/20 text-xs font-mono uppercase tracking-widest">© 2026 MISSION CONTROL. ALL RIGHTS RESERVED.</p>
           <p className="text-white/20 text-xs font-mono uppercase tracking-widest">SIDEQUEST • CHAPTER 01 • V1.0.42</p>
        </div>
      </div>
    </footer>
  );
};

// -------------------------------------------------------------
// Main Landing Page Compose
// -------------------------------------------------------------

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] selection:bg-white/20 text-white font-sans overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <div id="chapters">
          <ChaptersSection />
        </div>
        <TimelineSection />
        <PodExperience />
        <AICoachSection />
        <SocialProofSection />
        <div id="pricing">
          <PricingSection />
        </div>
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
