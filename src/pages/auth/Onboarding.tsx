import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const chapters = [
  "Fitness Discipline", "Study Grind", "Career Focus",
  "Breakup Recovery", "Dopamine Detox", "Sleep Reset"
];

const timezones = [
  { label: "Pacific Time (PT)", value: "America/Los_Angeles" },
  { label: "Eastern Time (ET)", value: "America/New_York" },
  { label: "Greenwich Mean Time (GMT)", value: "UTC" },
  { label: "Central European Time (CET)", value: "Europe/Paris" },
  { label: "India Standard Time (IST)", value: "Asia/Kolkata" },
  { label: "Singapore Time (SGT)", value: "Asia/Singapore" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [goalStatement, setGoalStatement] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from('users')
      .update({
        life_chapter: selectedChapter,
        goal_statement: goalStatement,
        timezone: timezone,
        is_onboarded: true,
      })
      .eq('id', user.id);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    navigate('/app');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="font-serif text-4xl text-white mb-4">Choose your chapter</h2>
                  <p className="text-text-secondary text-lg">What mission are you embarking on for the next 30 days?</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {chapters.map((chapter) => (
                    <button
                      key={chapter}
                      onClick={() => setSelectedChapter(chapter)}
                      className={cn(
                        "p-6 rounded-2xl border text-left transition-all duration-200",
                        selectedChapter === chapter
                          ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(212,175,55,0.15)]"
                          : "bg-surface border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{chapter}</span>
                        {selectedChapter === chapter && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="font-serif text-4xl text-white mb-4">Define your goal</h2>
                  <p className="text-text-secondary text-lg">What does success look like at the end of 30 days?</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
                      Specific Goal
                    </label>
                    <textarea
                      value={goalStatement}
                      onChange={(e) => setGoalStatement(e.target.value)}
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all min-h-[120px] resize-none"
                      placeholder="e.g., I will go to the gym 4 times a week and track my macros daily."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2 uppercase tracking-wider">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-surface border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all appearance-none"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>{tz.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(212,175,55,0.2)]">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-serif text-4xl text-white mb-4">Mission Ready</h2>
                <p className="text-text-secondary text-lg max-w-md mx-auto">
                  We're matching you with 4-7 other peers who are starting their {selectedChapter} chapter today.
                </p>
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                )}
                <div className="glass-card p-6 rounded-2xl max-w-sm mx-auto mt-8 text-left">
                  <p className="text-sm text-text-secondary mb-1">Your Chapter</p>
                  <p className="font-medium text-white mb-4">{selectedChapter || 'Fitness Discipline'}</p>
                  <p className="text-sm text-text-secondary mb-1">Your Goal</p>
                  <p className="font-medium text-white mb-4">{goalStatement || '—'}</p>
                  <p className="text-sm text-text-secondary mb-1">Duration</p>
                  <p className="font-medium text-white">30 Days</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/5">
            <button
              onClick={handleBack}
              className={cn(
                "px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2",
                step === 1 ? "opacity-0 pointer-events-none" : "text-text-secondary hover:text-white hover:bg-white/5"
              )}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={(step === 1 && !selectedChapter) || saving}
              className="px-8 py-3 rounded-full bg-white text-background font-medium hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : step === 3 ? 'Enter Mission Control' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
