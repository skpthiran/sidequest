import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Shield, Compass, Flame, Users, BookOpen, 
  Briefcase, HeartCrack, MoonStar, Code, Activity, Sparkles, 
  MessageSquare, CircleDashed, CheckCircle2, ChevronRight, X,
  BrainCircuit, Check, TrendingUp, Plus
} from 'lucide-react';

// -------------------------------------------------------------
// Shared / UI Components
// -------------------------------------------------------------

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
    {[...Array(30)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 3 + 1 + 'px',
          height: Math.random() * 3 + 1 + 'px',
          background: 'rgba(255, 255, 255, 0.4)',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
        }}
        animate={{
          y: [0, -150 - Math.random() * 100],
          opacity: [0, Math.random() * 0.4 + 0.1, 0],
        }}
        transition={{
          duration: Math.random() * 15 + 10,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 10,
        }}
      />
    ))}
  </div>
);

const Button = ({ children, to, variant = 'primary', className = '' }: any) => {
  const base = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 pointer-events-auto";
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 hover:scale-[1.04] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] px-6 py-3 border border-white/10",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/10 hover:border-white/40 hover:scale-[1.02] px-6 py-3",
    ghost: "bg-transparent text-white/70 hover:text-white hover:bg-white/10 hover:scale-[1.02] px-4 py-2",
  };
  
  if (to) {
    return (
      <Link to={to} className={`${base} ${variants[variant as keyof typeof variants]} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button className={`${base} ${variants[variant as keyof typeof variants]} ${className}`}>
      {children}
    </button>
  );
};

// -------------------------------------------------------------
// Landing Page Sections
// -------------------------------------------------------------

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-[#050505]/70 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex items-center justify-between pointer-events-none">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group pointer-events-auto">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Compass className="w-5 h-5 text-white/90" />
          </div>
          <span className="font-display font-medium tracking-tight text-xl text-white">Sidequest</span>
        </Link>

        {/* Center Nav (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1 backdrop-blur-md pointer-events-auto">
          <Button variant="ghost" className="text-sm">Missions</Button>
          <Button variant="ghost" className="text-sm">How it works</Button>
          <Button variant="ghost" className="text-sm">AI Coach</Button>
          <Button variant="ghost" className="text-sm">Pricing</Button>
        </nav>

        {/* Right Nav */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link to="/login" className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors">
            Sign In
          </Link>
          <Button to="/signup" variant="primary" className="text-sm py-2 px-5">
            Enter Sidequest
          </Button>
        </div>
      </div>
    </header>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center pt-24 overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-violet-600/20 to-cyan-500/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_0)] bg-[size:3px_3px] opacity-[0.08] pointer-events-none" />
        {/* Subtle Map lines or grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_10%,transparent_100%)] pointer-events-none" />
        <BackgroundParticles />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center mt-12 lg:mt-0">
        
        {/* Left Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6 text-xs font-medium uppercase tracking-wider text-white/70">
            <span className="w-2 h-2 rounded-full bg-emerald-400 object-pulse" />
            Pod intakes open for May
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-medium leading-[1.05] tracking-tight mb-8">
            Your next 30 days shouldn't be survived alone.
          </h1>
          <p className="text-lg sm:text-xl text-white/60 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
            Join a private mission pod of 4–8 people in the same chapter of life. 
            Check in daily, build momentum, and finish what you keep starting.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Button to="/signup" variant="primary" className="w-full sm:w-auto h-14 text-base px-8 group">
              Start Your Mission
              <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button to="#how-it-works" variant="outline" className="w-full sm:w-auto h-14 text-base px-8">
              See How Pods Work
            </Button>
          </div>
        </motion.div>

        {/* Right Dashboard Mockup */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-lg justify-self-center lg:justify-self-end mt-12 lg:mt-0 perspective-1000"
        >
          {/* Main Floating Card */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="relative bg-[#0A0F1C]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden transform rotate-y-[-5deg] rotate-x-[5deg]"
          >
            {/* Inner Glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-medium text-lg tracking-tight">Project Shipping</h3>
                <p className="text-white/40 text-sm">Target: 30 Days</p>
              </div>
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-[#0A0F1C] bg-gradient-to-br from-indigo-400 to-cyan-400`} style={{ filter: `hue-rotate(${i * 45}deg)`}} />
                ))}
              </div>
            </div>

            {/* Check-in UI */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Daily Proof Uploaded</p>
                    <p className="text-xs text-white/50">2 hours ago</p>
                  </div>
                </div>
                <Flame className="w-5 h-5 text-amber-500" />
              </div>

              {/* Progress track */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-white/60">Pod Momentum</span>
                  <span className="text-emerald-400 font-medium">87%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 w-[87%] rounded-full" />
                </div>
              </div>
            </div>
            
            {/* Mini overlay chips */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-8 top-12 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl flex items-center gap-3 shadow-xl"
            >
               <div className="w-2 h-2 rounded-full bg-amber-400" />
               <span className="text-xs font-medium whitespace-nowrap">Day 12 / 30</span>
            </motion.div>

            <motion.div 
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute -left-12 bottom-12 bg-white/10 backdrop-blur-md border border-white/20 p-3 flex items-center gap-3 rounded-2xl shadow-xl"
            >
               <BrainCircuit className="w-4 h-4 text-violet-400" />
               <span className="text-xs font-medium whitespace-nowrap">Weekend risk detected</span>
            </motion.div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ProblemSection = () => {
  return (
    <section className="py-16 md:py-32 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-6 leading-tight">
            Discipline breaks<br/>when you disappear.
          </h2>
          <p className="text-xl text-white/50 leading-relaxed font-light">
            Most people don't fail because they're weak. They fail because <br className="hidden sm:block"/>
            nobody notices when they slowly stop showing up.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Alone Panel */}
          <FadeIn delay={0.1} className="h-full">
          <div className="rounded-[2.5rem] p-10 lg:p-12 border border-white/5 bg-[#0A0F1C]/30 backdrop-blur-sm grayscale opacity-70 hover:opacity-100 transition-all duration-500 overflow-hidden relative h-full hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
            <div className="absolute top-0 right-0 p-8 opacity-20"><Users className="w-24 h-24 stroke-1" /></div>
            <h3 className="text-3xl font-display mb-4 text-white">Alone</h3>
            <p className="text-white/40 text-lg mb-12">No structure. No witness.<br/>No return path.</p>
            
            <div className="space-y-4 opacity-50">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-6 h-6 rounded-full border border-white/20 flex-shrink-0" />
                  <div className="h-2 bg-white/10 rounded-full w-full max-w-[120px]" />
                </div>
              ))}
            </div>
          </div>
          </FadeIn>

          {/* Pod Panel */}
          <FadeIn delay={0.2} className="h-full">
          <div className="rounded-[2.5rem] p-10 lg:p-12 border border-amber-500/20 bg-gradient-to-b from-[#0A0F1C]/80 to-[#1A130A]/80 backdrop-blur-sm relative overflow-hidden group shadow-[0_20px_40px_rgba(245,166,35,0.05)] hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(245,166,35,0.1)] transition-all duration-500 h-full">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,166,35,0.25),_transparent_60%)] opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute top-0 right-0 p-8 text-amber-500/20 group-hover:scale-110 transition-transform duration-700 ease-out"><Flame className="w-24 h-24 stroke-1" /></div>
            
            <h3 className="text-3xl font-display mb-4 text-amber-50 relative z-10">In a Pod</h3>
            <p className="text-amber-100/60 text-lg mb-12 relative z-10">Daily proof. Shared momentum.<br/>People who expect you back.</p>
            
            <div className="space-y-4 relative z-10">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-6 h-6 rounded-full border border-amber-500/40 bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-amber-400" />
                  </div>
                  <div className="h-2 bg-gradient-to-r from-amber-500/40 to-transparent rounded-full w-full max-w-[160px]" />
                </div>
              ))}
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
    { title: "Fitness Discipline", icon: Flame, theme: "from-amber-600/20 to-orange-900/40", border: "group-hover:border-amber-500/50", glow: "bg-amber-500/20", desc: "Show up daily. Sweat daily." },
    { title: "Study Grind", icon: BookOpen, theme: "from-cyan-600/20 to-blue-900/40", border: "group-hover:border-cyan-500/50", glow: "bg-cyan-500/20", desc: "Focus blocks and daily progress." },
    { title: "Career Focus", icon: Briefcase, theme: "from-emerald-600/20 to-green-900/40", border: "group-hover:border-emerald-500/50", glow: "bg-emerald-500/20", desc: "Applications, interviews, upskilling." },
    { title: "Breakup Recovery", icon: HeartCrack, theme: "from-rose-600/20 to-red-900/40", border: "group-hover:border-rose-500/50", glow: "bg-rose-500/20", desc: "Rebuilding self-worth, step by step." },
    { title: "Sleep Reset", icon: MoonStar, theme: "from-indigo-600/20 to-slate-900/40", border: "group-hover:border-indigo-500/50", glow: "bg-indigo-500/20", desc: "Lights out. Early mornings." },
    { title: "Founder Mode", icon: Code, theme: "from-violet-600/20 to-purple-900/40", border: "group-hover:border-violet-500/50", glow: "bg-violet-500/20", desc: "Ship features, daily execution." },
  ];

  return (
    <section className="py-16 md:py-32 relative z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-24 text-balance">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-6 leading-tight">
            Choose the chapter<br className="hidden md:block"/> you're entering.
          </h2>
          <p className="text-xl text-white/50 font-light">
            Sidequest matches you with people living the same season, not random strangers.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {chapters.map((chapter, i) => {
            const Icon = chapter.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="h-full"
              >
                <Link 
                  to="/signup"
                  className={`group block h-full relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#080808] p-8 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${chapter.border}`}
                >
                  {/* Subtle Inner Pattern & Glow Effects */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${chapter.theme} opacity-0 group-hover:opacity-60 transition-opacity duration-700`} />
                  <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] ${chapter.glow} opacity-0 group-hover:opacity-100 transition-all duration-700`} />
                  <div className="absolute inset-0 ring-1 ring-white/10 rounded-[2rem] pointer-events-none group-hover:ring-white/20 transition-all duration-500" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-12">
                      <div className={`w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center bg-white/5 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon className={`w-6 h-6 text-white`} />
                      </div>
                      <div className="flex gap-2 text-[10px] font-semibold tracking-wider uppercase text-white/40">
                        <span className="bg-white/5 px-2 py-1 rounded-full backdrop-blur-md">30 Days</span>
                        <span className="bg-white/5 px-2 py-1 rounded-full backdrop-blur-md">4-8 Ppl</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <h3 className="text-2xl font-display font-medium mb-3">{chapter.title}</h3>
                      <p className="text-white/50 text-sm mb-6">{chapter.desc}</p>
                      
                      <div className="flex items-center text-sm font-medium text-white/40 group-hover:text-white transition-colors">
                        Enter Mission 
                        <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
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
    { num: "01", title: "Pick your mission", desc: "Select your life chapter: health, career, sleep, or study." },
    { num: "02", title: "Get matched", desc: "We place you in a private pod of like-minded peers." },
    { num: "03", title: "Check in daily", desc: "Upload a photo or note to prove you did the work." },
    { num: "04", title: "AI spots patterns", desc: "Your dedicated coach notices if you slip and nudges you back." },
    { num: "05", title: "Graduate", desc: "Finish the 30 days. Review the journey. Start the next chapter." },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-40 relative z-10 bg-[#0A0A0A] border-y border-white/5 overflow-hidden">
       <div className="absolute inset-0 opacity-20 pointer-events-none">
         <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-[120px] rounded-full mix-blend-screen" />
      </div>
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-32 text-balance">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-6 leading-tight">
            From intention to identity<br className="hidden sm:block"/> in 30 days.
          </h2>
        </FadeIn>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical connecting line */}
          <div className="absolute left-8 lg:left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2 hidden md:block" />

          <div className="space-y-16 lg:space-y-32">
            {steps.map((step, i) => (
              <FadeIn key={i} delay={0.1}>
              <div className={`flex flex-col lg:flex-row items-center gap-8 ${i % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={`flex-1 text-left ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} w-full lg:w-auto overflow-hidden`}>
                  <div className="inline-block p-1 border border-white/10 rounded-full bg-white/5 mb-4 text-xs font-mono text-white/50 backdrop-blur-sm">
                    STEP {step.num}
                  </div>
                  <h3 className="text-2xl font-display mb-3">{step.title}</h3>
                  <p className="text-white/50 leading-relaxed">{step.desc}</p>
                </div>
                
                <div className="w-16 h-16 rounded-full border-4 border-[#020202] bg-[#0A0F1C] flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(255,255,255,0.05)] mx-auto lg:mx-0 flex-shrink-0 transition-transform duration-500 hover:scale-110">
                  <div className="w-3 h-3 bg-white/40 rounded-full" />
                </div>
                
                <div className="flex-1 hidden lg:block" />
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
    <section className="py-16 md:py-40 relative z-10 overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center max-w-6xl mx-auto">
          
          <FadeIn>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-6 leading-tight">
              Not a feed.<br/>A private squad.
            </h2>
            <ul className="space-y-6 mb-10 text-lg text-white/60 font-light">
              <li className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0"><Check className="w-3 h-3 text-white" /></div>
                <span><strong>Small private pods.</strong> No public visibility, no performative posting. Just 4–8 people.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0"><Check className="w-3 h-3 text-white" /></div>
                <span><strong>No infinite scroll.</strong> Open the app, check in, support your pod, and leave.</span>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 w-6 h-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0"><Check className="w-3 h-3 text-white" /></div>
                <span><strong>Built for showing up.</strong> The focus is on consistency, not aesthetic updates.</span>
              </li>
            </ul>
            <Button to="/signup" variant="outline" className="text-sm border-white/10 rounded-full group hover:border-emerald-500/30">
              Explore the Pod Wall 
              <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-emerald-400" />
            </Button>
          </FadeIn>

          {/* App UI Mockup */}
          <FadeIn delay={0.2} className="relative w-full max-w-sm mx-auto perspective-1000">
          <div className="relative rounded-[2.5rem] border-[4px] border-[#222] ring-[4px] ring-[#111] bg-[#0A0F1C] shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden aspect-[9/19] transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-[0deg] hover:rotate-x-[0deg] transition-transform duration-700 ease-out">
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-10" />
             {/* Dynamic Notch */}
             <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
               <div className="w-32 h-6 bg-[#111] rounded-b-xl" />
             </div>
             
             {/* UI Header */}
             <div className="pt-12 pb-4 px-6 border-b border-white/5 bg-white/5 backdrop-blur-md">
               <div className="flex justify-between items-center mb-4">
                 <h4 className="font-display font-medium text-lg">Pod Alpha</h4>
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Users className="w-4 h-4" /></div>
               </div>
               <div className="flex gap-2 overflow-hidden">
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className={`w-10 h-10 rounded-full border-2 border-[#0A0F1C] bg-gradient-to-br from-gray-700 to-gray-500 flex-shrink-0 ${i > 2 ? 'opacity-40 grayscale' : ''}`} style={{ filter: `hue-rotate(${i * 60}deg)`}} />
                 ))}
               </div>
             </div>

             {/* UI Feed */}
             <div className="p-4 space-y-4 h-full bg-[#050505]">
                {/* Post 1 */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded-full bg-blue-500" />
                       <span className="text-sm font-medium">Sarah M.</span>
                    </div>
                    <span className="text-xs text-white/40">2m ago</span>
                  </div>
                  <div className="h-32 rounded-xl bg-white/5 border border-white/5 mb-3 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-white/20" />
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Daily Proof</span>
                     <button className="text-xs text-white/60 hover:text-white px-3 py-1 bg-white/5 rounded-full flex gap-1 items-center"><Plus className="w-3 h-3"/> Encourage</button>
                  </div>
                </div>
                
                {/* Status Update */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 p-1 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                       <TrendingUp className="w-4 h-4"/>
                     </div>
                     <p className="text-sm text-white/80">Pod streak reached <strong>5 days</strong>. Keep going.</p>
                  </div>
                </div>

             </div>

             {/* UI Tab Bar */}
             <div className="absolute bottom-0 inset-x-0 h-20 bg-white/5 backdrop-blur-xl border-t border-white/10 flex justify-between items-center px-8 pb-4">
                <Compass className="w-6 h-6 text-white/40" />
                <Activity className="w-6 h-6 text-white" />
                <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center -mt-6 border-4 border-[#0A0F1C]"><Plus className="w-6 h-6" /></div>
                <MessageSquare className="w-6 h-6 text-white/40" />
                <div className="w-6 h-6 rounded-full bg-white/20" />
             </div>
          </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
};

const AICoachSection = () => {
  return (
    <section className="py-16 md:py-32 relative z-10 bg-[#020202]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          <FadeIn className="order-2 lg:order-1 relative">
             <div className="p-8 rounded-3xl border border-white/5 bg-[#050505] shadow-[0_20px_50px_rgba(139,92,246,0.1)] relative overflow-hidden group hover:border-violet-500/20 transition-all duration-500">
               <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-violet-600/10 blur-[80px] pointer-events-none group-hover:bg-violet-600/20 transition-all duration-700" />
               <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                   <BrainCircuit className="w-6 h-6 text-violet-400" />
                 </div>
                 <h3 className="text-xl font-medium font-display">Sidequest AI</h3>
               </div>

               <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.05] rounded-tl-none max-w-[90%]">
                   <p className="text-sm text-white/80 leading-relaxed">
                     You usually miss check-ins on Sundays. Want a lighter plan for today to keep the streak alive?
                   </p>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.05] rounded-tl-none max-w-[90%]">
                   <p className="text-sm text-white/80 leading-relaxed">
                     Your pod has 87% weekly consistency. You're the final check-in needed today.
                   </p>
                 </div>
                 <div className="p-4 rounded-2xl bg-white/[0.04] border border-emerald-500/20 rounded-tl-none max-w-[90%] relative overflow-hidden">
                   <div className="absolute inset-0 bg-emerald-500/5 mix-blend-overlay" />
                   <p className="text-sm text-emerald-100/90 leading-relaxed">
                     You are not behind. Restart today with one small proof.
                   </p>
                 </div>
               </div>
             </div>
          </FadeIn>

          <FadeIn className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-6 leading-tight">
              An AI coach that notices when momentum drops.
            </h2>
            <p className="text-lg text-white/60 mb-8 font-light">
              Supportive, calm, and emotionally intelligent. Not a robotic reminder, but a guide that understands behavioral patterns.
            </p>
            <ul className="space-y-4 text-white/70">
              {['Pattern detection & slip prevention', 'Weekly momentum recaps', 'Subtle recovery nudges', 'Personalized mission suggestions'].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                  {item}
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
    <section className="py-16 md:py-32 relative z-10">
      <div className="container mx-auto px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-16 md:mb-24 text-balance">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium tracking-tight mb-6 leading-tight">
            Built for people who are tired of restarting.
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {archetypes.map((item, i) => (
            <FadeIn key={i} delay={0.1 * i}>
            <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,255,255,0.02)] h-full">
              <span className="text-xs font-mono uppercase tracking-wider text-white/40 mb-4 block">{item.label}</span>
              <h3 className="text-xl font-medium mb-3 font-display">{item.title}</h3>
              <p className="text-white/50 italic font-light">"{item.desc}"</p>
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

const CTASection = () => {
  return (
    <section className="pt-24 pb-40 relative z-10 overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-t from-amber-500/10 to-transparent blur-[100px]" />
         <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-[50vh] bg-gradient-to-t from-amber-400/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <FadeIn>
          <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 shadow-[0_0_60px_rgba(245,166,35,0.2)]">
            <Shield className="w-8 h-8 text-amber-400 drop-shadow-[0_0_15px_rgba(245,166,35,0.8)]" />
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-medium tracking-tight mb-8 text-balance max-w-4xl mx-auto leading-tight">
            Thirty days from now, you'll either have another excuse — or a finished mission.
          </h2>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto font-light">
            Enter a pod. Show up daily. Let people witness your comeback.
          </p>
          <Button to="/signup" variant="primary" className="h-16 px-12 text-lg group bg-white hover:bg-gray-200">
            Start Your Mission
            <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </FadeIn>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/5 relative z-10 bg-[#050505]">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-white/40" />
          <span className="font-display font-medium text-white/60">Sidequest</span>
        </div>
        <p className="text-white/40 text-center md:text-left">
          Private accountability pods for people entering their next chapter.
        </p>
        <div className="flex gap-4">
          <Link to="#" className="text-white/40 hover:text-white transition-colors">Twitter</Link>
          <Link to="#" className="text-white/40 hover:text-white transition-colors">Terms</Link>
          <Link to="#" className="text-white/40 hover:text-white transition-colors">Privacy</Link>
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
        <ChaptersSection />
        <TimelineSection />
        <PodExperience />
        <AICoachSection />
        <SocialProofSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
