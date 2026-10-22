import React, { useState } from 'react';
import { Calendar, MapPin, Users, IndianRupee, Sparkles, Download, Copy, Check, Palette, Clock, CheckCircle2 } from 'lucide-react';
import { EventPlan } from '../../types/planner';
import { formatINR, calculatePerGuest } from '../../utils/budget';
import { exportPlanToPdf } from '../../utils/pdfExport';
import { ColorSwatch } from '../ColorSwatch';
import confetti from 'canvas-confetti';

interface OverviewTabProps {
  plan: EventPlan;
  onNavigateTab: (tabId: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ plan, onNavigateTab }) => {
  const [copiedInvite, setCopiedInvite] = useState(false);
  const perGuest = calculatePerGuest(plan.totalBudgetCalculated, plan.input.guestCount);
  const completedVendors = plan.vendorChecklist.filter((v) => v.done).length;
  const totalVendors = plan.vendorChecklist.length;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(plan.invitationText.formal);
    setCopiedInvite(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const handleExportPdf = () => {
    exportPlanToPdf(plan);
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Dossier Card */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-950 text-white p-6 sm:p-10 shadow-2xl border border-indigo-900/50">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-gold/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-700/30 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-widest font-semibold text-rose-gold px-3 py-1 rounded-full bg-rose-gold/15 border border-rose-gold/30">
              {plan.input.eventType.toUpperCase()} BLUEPRINT
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyInvite}
                className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/15"
              >
                {copiedInvite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedInvite ? 'Copied Invite' : 'Copy Invite'}</span>
              </button>
              <button
                onClick={handleExportPdf}
                className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl bg-rosegold-gradient text-white hover:opacity-95 transition-all shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white">
              {plan.summary.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-200 max-w-2xl font-light">
              {plan.summary.tagline}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                <Calendar className="w-4 h-4 text-rose-gold" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-300 font-medium">Date</p>
                <p className="text-xs sm:text-sm font-semibold text-white">{plan.input.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                <MapPin className="w-4 h-4 text-rose-gold" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-300 font-medium">Location</p>
                <p className="text-xs sm:text-sm font-semibold text-white">{plan.input.city}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                <Users className="w-4 h-4 text-rose-gold" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-300 font-medium">Guest Count</p>
                <p className="text-xs sm:text-sm font-semibold text-white">{plan.input.guestCount} Guests</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 border border-white/15">
                <IndianRupee className="w-4 h-4 text-rose-gold" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-300 font-medium">Total Budget</p>
                <p className="text-xs sm:text-sm font-semibold text-white">{formatINR(plan.totalBudgetCalculated)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Budget Health */}
        <div className="glass-panel p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-gold/15 text-rose-gold">
                <IndianRupee className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Budget Strategy</h3>
            </div>
            <button
              onClick={() => onNavigateTab('budget')}
              className="text-xs font-semibold text-rose-gold hover:underline cursor-pointer"
            >
              View Breakdown →
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Per Guest Spend:</span>
              <span className="text-base font-semibold text-gray-900 dark:text-white">{formatINR(perGuest)}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Major Allocation:</span>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                {plan.budgetBreakdown[0]?.category} ({plan.budgetBreakdown[0]?.percentage}%)
              </span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 pt-1 border-t border-subtle">
              {plan.summary.budgetSummary}
            </p>
          </div>
        </div>

        {/* Card 2: Timeline Status */}
        <div className="glass-panel p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Roadmap Milestones</h3>
            </div>
            <button
              onClick={() => onNavigateTab('timeline')}
              className="text-xs font-semibold text-rose-gold hover:underline cursor-pointer"
            >
              Timeline →
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Countdown Stages:</span>
              <span className="text-base font-semibold text-gray-900 dark:text-white">{plan.timeline.length} Milestones</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Next Action:</span>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate max-w-[170px]">
                {plan.timeline[0]?.title}
              </span>
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 pt-1 border-t border-subtle">
              Timeframe: {plan.timeline[0]?.timeframe} down to Day of Event.
            </p>
          </div>
        </div>

        {/* Card 3: Vendor Readiness */}
        <div className="glass-panel p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">Vendor Checklist</h3>
            </div>
            <button
              onClick={() => onNavigateTab('vendors')}
              className="text-xs font-semibold text-rose-gold hover:underline cursor-pointer"
            >
              Review Team →
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Contract Readiness:</span>
              <span className="text-base font-semibold text-gray-900 dark:text-white">
                {completedVendors} / {totalVendors} Locked
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${totalVendors ? (completedVendors / totalVendors) * 100 : 0}%` }}
              />
            </div>
            <p className="text-xs text-gray-700 dark:text-gray-300 pt-1">
              Includes savvy questions to ask & market negotiation tips.
            </p>
          </div>
        </div>
      </div>

      {/* Theme Moodboard & Color Palette Highlight */}
      {plan.personalizedIdeas?.theme && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold flex items-center gap-1.5">
                <Palette className="w-4 h-4" /> Signature Visual Palette & Mood
              </span>
              <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mt-1">
                {plan.personalizedIdeas.theme.name}
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('ideas')}
              className="text-xs font-semibold text-rose-gold hover:underline self-start sm:self-auto"
            >
              Explore Full Ideas & Menu →
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300">
            {plan.personalizedIdeas.theme.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {plan.personalizedIdeas.theme.colorPalette.map((color, idx) => (
              <ColorSwatch key={idx} color={color} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
