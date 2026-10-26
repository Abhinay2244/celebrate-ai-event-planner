import React from 'react';
import { Calendar, MapPin, Users, IndianRupee, Download, Copy, Check } from 'lucide-react';
import { EventPlan } from '../../types/planner';
import { formatINR } from '../../utils/budget';

interface HeroDossierCardProps {
  plan: EventPlan;
  copiedInvite: boolean;
  onCopyInvite: () => void;
  onExportPdf: () => void;
}

/**
 * Top hero dossier card in the Overview tab.
 * Presents event title, tagline, quick metrics, and export actions.
 */
export const HeroDossierCard: React.FC<HeroDossierCardProps> = ({
  plan,
  copiedInvite,
  onCopyInvite,
  onExportPdf,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-indigo-950 text-white p-6 sm:p-10 shadow-2xl border border-indigo-900/50">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-rose-gold/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-700/30 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs uppercase tracking-widest font-semibold text-rose-gold px-3 py-1 rounded-full bg-rose-gold/15 border border-rose-gold/30">
            {plan.input.eventType.toUpperCase()} BLUEPRINT
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onCopyInvite}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 cursor-pointer"
            >
              {copiedInvite ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copiedInvite ? 'Copied Invite' : 'Copy Invite'}</span>
            </button>
            <button
              onClick={onExportPdf}
              className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-rosegold-gradient text-white hover:opacity-95 transition-all shadow-md cursor-pointer"
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
              <p className="text-[10px] uppercase tracking-wider text-gray-300 font-medium">
                Location
              </p>
              <p className="text-xs sm:text-sm font-semibold text-white">{plan.input.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/15">
              <Users className="w-4 h-4 text-rose-gold" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-300 font-medium">
                Guest Count
              </p>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {plan.input.guestCount} Guests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/15">
              <IndianRupee className="w-4 h-4 text-rose-gold" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-300 font-medium">
                Total Budget
              </p>
              <p className="text-xs sm:text-sm font-semibold text-white">
                {formatINR(plan.totalBudgetCalculated)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
