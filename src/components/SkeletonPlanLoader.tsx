import React, { useEffect, useState } from 'react';
import { Sparkles, Wine, Music, Utensils, CalendarCheck, ShieldCheck } from 'lucide-react';

const LOADING_STEPS = [
  { icon: Sparkles, text: 'Consulting celebration aesthetic database & vibe models...' },
  { icon: Utensils, text: 'Curating culinary courses, cocktails & banquet allocations...' },
  { icon: CalendarCheck, text: 'Calculating precise milestone countdowns & vendor timings...' },
  { icon: Music, text: 'Harmonizing sound, lighting cues & entertainment rosters...' },
  { icon: ShieldCheck, text: 'Validating exact rupee budget sum with Zod integrity checks...' },
];

/**
 * Animated accessible skeleton loader displayed while Gemini formulates celebration blueprints.
 */
export const SkeletonPlanLoader: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const currentStep = LOADING_STEPS[stepIndex];
  const StepIcon = currentStep.icon;

  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className="max-w-4xl mx-auto p-6 sm:p-12 space-y-8 glass-panel rounded-3xl text-center shadow-xl border border-subtle"
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16 rounded-2xl bg-rosegold-gradient flex items-center justify-center shadow-lg animate-bounce">
          <StepIcon className="w-8 h-8 text-white transition-all duration-500" />
          <span className="absolute -inset-1 rounded-2xl bg-rose-gold/30 blur-md -z-10 animate-pulse" />
        </div>

        <div className="space-y-1">
          <h2 className="font-serif text-2xl font-bold text-indigo-950 dark:text-white">
            Curating Your Celebration Blueprint
          </h2>
          <p className="text-sm text-rose-gold font-medium transition-all duration-300">
            {currentStep.text}
          </p>
        </div>
      </div>

      {/* Skeleton cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-left">
        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-subtle/50 space-y-3 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-md w-1/2" />
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded-lg w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-full" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-5/6" />
        </div>

        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-subtle/50 space-y-3 animate-pulse delay-100">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-md w-1/3" />
          <div className="h-28 w-28 mx-auto rounded-full bg-gray-200 dark:bg-slate-700" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-4/5 mx-auto" />
        </div>

        <div className="p-5 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-subtle/50 space-y-3 animate-pulse delay-200">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded-md w-2/3" />
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-full" />
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-5/6" />
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-md w-4/6" />
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
        <div className="h-full bg-rosegold-gradient animate-indeterminate" />
      </div>
    </div>
  );
};
