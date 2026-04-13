import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Target, Users, Zap, CheckCircle2, Lock, BrainCircuit, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent-amber/5 rounded-full blur-[150px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8">
                <span className="w-2 h-2 rounded-full bg-accent-amber animate-pulse" />
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wider">Now accepting Beta applications</span>
              </div>
              <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-6">
                Find your pod.<br />
                <span className="text-gradient-gold">Finish your mission.</span>
              </h1>
              <p className="text-lg md:text-xl text-text-secondary mb-10 leading-relaxed max-w-lg">
                A premium accountability platform for those ready to level up. Join a private 30-day mission pod with 4-8 peers going through the same life chapter.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-background font-medium text-base hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 group">
                  Join a Mission
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="#how-it-works" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 text-white border border-white/10 font-medium text-base hover:bg-white/10 transition-colors flex items-center justify-center">
                  How it Works
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative perspective-1000 hidden lg:block"
          >
            <div className="glass-card rounded-2xl p-2 shadow-2xl transform rotate-y-[-5deg] rotate-x-[5deg]">
              <img 
                src="https://picsum.photos/seed/dashboard/1200/800?blur=2" 
                alt="Dashboard Preview" 
                className="rounded-xl border border-white/10"
                referrerPolicy="no-referrer"
              />
              {/* Floating Elements */}
              <div className="absolute -left-12 top-24 glass-card p-4 rounded-xl flex items-center gap-4 shadow-xl glow-amber">
                <div className="w-10 h-10 rounded-full bg-accent-amber/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-accent-amber" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Pod Streak</p>
                  <p className="text-2xl font-serif text-accent-amber">12 Days</p>
                </div>
              </div>
              <div className="absolute -right-8 bottom-24 glass-card p-4 rounded-xl flex items-center gap-4 shadow-xl">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-8 h-8 rounded-full border-2 border-surface" alt="User" referrerPolicy="no-referrer" />
                  ))}
                </div>
                <p className="text-sm font-medium text-text-secondary">All checked in today</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Positioning */}
      <section className="py-24 border-y border-white/5 bg-surface/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Not a social feed. Not a dating app.</h2>
            <p className="text-text-secondary text-lg">
              Sidequest is built for structured belonging. We replaced infinite scrolling with daily proof, streaks, and supportive accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Small Private Pods", desc: "4-8 people per pod. Intimate, focused, and high-trust." },
              { icon: Target, title: "30-Day Missions", desc: "Structured timelines to build habits without overwhelming commitment." },
              { icon: Activity, title: "Daily Proof", desc: "Frictionless check-ins to keep the collective streak alive." }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
                <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">How it works</h2>
            <p className="text-text-secondary text-lg">
              A proven framework for building discipline through structured accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />
            
            {[
              { step: "01", title: "Choose Chapter", desc: "Select the specific mission you want to focus on for the next 30 days." },
              { step: "02", title: "Get Matched", desc: "We place you in a private pod with 4-7 peers in the same timezone." },
              { step: "03", title: "Daily Proof", desc: "Check in daily with optional photo proof to keep the pod streak alive." },
              { step: "04", title: "Graduate", desc: "Finish the 30 days together and unlock your next chapter." }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-surface border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                  <span className="font-serif text-xl text-primary">{item.step}</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-3">{item.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapters Section */}
      <section id="chapters" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Choose your chapter.</h2>
              <p className="text-text-secondary text-lg">
                We match you with peers who are in the exact same season of life. Same goals, same struggles, same timezone.
              </p>
            </div>
            <Link to="/chapters" className="text-primary hover:text-white transition-colors flex items-center gap-2 font-medium">
              View all chapters <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Fitness Discipline", color: "from-blue-500/20 to-cyan-500/20", border: "border-cyan-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]" },
              { title: "Study Grind", color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]" },
              { title: "Career Focus", color: "from-emerald-500/20 to-teal-500/20", border: "border-emerald-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]" },
              { title: "Breakup Recovery", color: "from-rose-500/20 to-pink-500/20", border: "border-rose-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(225,29,72,0.15)]" },
              { title: "Dopamine Detox", color: "from-purple-500/20 to-indigo-500/20", border: "border-purple-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]" },
              { title: "Sleep Reset", color: "from-slate-500/20 to-gray-500/20", border: "border-slate-500/20", glow: "group-hover:shadow-[0_0_30px_rgba(148,163,184,0.15)]" }
            ].map((chapter, i) => (
              <div key={i} className={cn("group relative p-8 rounded-2xl border bg-surface/50 transition-all duration-300 cursor-pointer overflow-hidden", chapter.border, chapter.glow)}>
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", chapter.color)} />
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif text-white mb-2">{chapter.title}</h3>
                  <p className="text-text-secondary text-sm mb-6">30 Days • 4-8 Members</p>
                  <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                    Explore Chapter <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Coach Section */}
      <section className="py-32 bg-surface border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="glass-card p-8 rounded-2xl border-white/10 relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-sm text-text-secondary mb-2">Weekly Recap</p>
                  <p className="text-white font-medium">Your pod is showing strong momentum. 3 members hit a 7-day streak. Keep pushing.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 ml-8">
                  <p className="text-sm text-text-secondary mb-2">Momentum Warning</p>
                  <p className="text-white font-medium">You usually struggle on weekends. Want to set a specific intention for Saturday?</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Intelligence that cares.</h2>
            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              Our AI Coach doesn't just track numbers. It detects patterns, warns you before momentum drops, and provides supportive nudges to keep the pod together.
            </p>
            <ul className="space-y-4">
              {[
                "Weekly pod recaps and insights",
                "Pattern detection for habit drop-offs",
                "Supportive recovery nudges",
                "Emotional tone analysis"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">A safe space to grow.</h2>
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                Vulnerability requires trust. Sidequest is built with emotional safety and strict moderation at its core.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Private Pods", desc: "Your check-ins and reflections are only visible to your 4-8 pod members." },
                  { title: "Respectful Culture", desc: "Zero tolerance for harassment, judgment, or unsolicited advice." },
                  { title: "Quiet Exits", desc: "Leave a pod at any time without notifications or awkwardness." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center shrink-0">
                      <Lock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">{item.title}</h4>
                      <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-3xl blur-2xl" />
              <div className="glass-card p-8 rounded-3xl border-white/10 relative z-10">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                  <Shield className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="text-xl font-medium text-white">Community Guidelines</h3>
                    <p className="text-sm text-text-secondary">Strictly enforced</p>
                  </div>
                </div>
                <p className="text-text-primary leading-relaxed italic">
                  "We are here to support, not to fix. We celebrate the wins and hold space for the struggles. We show up for ourselves, and by doing so, we show up for the pod."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 bg-surface/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">Invest in your discipline.</h2>
            <p className="text-text-secondary text-lg">
              Simple, transparent pricing. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="glass-card p-8 rounded-3xl border-white/5 flex flex-col">
              <h3 className="text-xl font-medium text-white mb-2">Basic Mission</h3>
              <p className="text-text-secondary text-sm mb-6">Perfect for getting started.</p>
              <div className="mb-8">
                <span className="text-4xl font-serif text-white">$0</span>
                <span className="text-text-secondary"> / forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-text-primary"><CheckCircle2 className="w-4 h-4 text-text-muted" /> 1 Active Pod</li>
                <li className="flex items-center gap-3 text-sm text-text-primary"><CheckCircle2 className="w-4 h-4 text-text-muted" /> Standard matching</li>
                <li className="flex items-center gap-3 text-sm text-text-primary"><CheckCircle2 className="w-4 h-4 text-text-muted" /> Daily check-ins</li>
              </ul>
              <Link to="/signup" className="w-full py-3 rounded-full bg-surface border border-white/10 text-white font-medium hover:bg-white/5 transition-colors text-center">
                Start Free
              </Link>
            </div>

            {/* Premium Tier */}
            <div className="glass-card p-8 rounded-3xl border-primary/30 relative flex flex-col shadow-[0_0_40px_rgba(212,175,55,0.1)] transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full bg-primary text-background text-xs font-bold uppercase tracking-wider">
                Most Popular
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Premium</h3>
              <p className="text-text-secondary text-sm mb-6">For serious commitment.</p>
              <div className="mb-8">
                <span className="text-4xl font-serif text-white">$12</span>
                <span className="text-text-secondary"> / month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="w-4 h-4 text-primary" /> Up to 3 Active Pods</li>
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="w-4 h-4 text-primary" /> Priority matching</li>
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="w-4 h-4 text-primary" /> AI Coach Insights</li>
                <li className="flex items-center gap-3 text-sm text-white"><CheckCircle2 className="w-4 h-4 text-primary" /> Advanced progress analytics</li>
              </ul>
              <Link to="/signup" className="w-full py-3 rounded-full bg-white text-background font-medium hover:bg-gray-100 transition-colors text-center">
                Get Premium
              </Link>
            </div>

            {/* Expert Tier */}
            <div className="glass-card p-8 rounded-3xl border-white/5 flex flex-col">
              <h3 className="text-xl font-medium text-white mb-2">Expert-Led</h3>
              <p className="text-text-secondary text-sm mb-6">Guided by professionals.</p>
              <div className="mb-8">
                <span className="text-4xl font-serif text-white">$49+</span>
                <span className="text-text-secondary"> / cohort</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3 text-sm text-text-primary"><CheckCircle2 className="w-4 h-4 text-text-muted" /> Everything in Premium</li>
                <li className="flex items-center gap-3 text-sm text-text-primary"><CheckCircle2 className="w-4 h-4 text-text-muted" /> Creator/Expert guidance</li>
                <li className="flex items-center gap-3 text-sm text-text-primary"><CheckCircle2 className="w-4 h-4 text-text-muted" /> Exclusive resources</li>
              </ul>
              <Link to="/discover" className="w-full py-3 rounded-full bg-surface border border-white/10 text-white font-medium hover:bg-white/5 transition-colors text-center">
                Browse Cohorts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-5xl md:text-7xl mb-8">Your next 30 days could change everything.</h2>
          <p className="text-xl text-text-secondary mb-12">
            Stop trying to do it alone. Join a pod of ambitious peers and build the discipline you need.
          </p>
          <Link to="/signup" className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-white text-background font-medium text-lg hover:bg-gray-100 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)]">
            Start Your Mission
          </Link>
        </div>
      </section>
    </div>
  );
}
