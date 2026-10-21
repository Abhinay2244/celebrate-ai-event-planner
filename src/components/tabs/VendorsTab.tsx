import React, { useState } from 'react';
import { CheckSquare, Square, HelpCircle, Lightbulb, CheckCircle2, ChevronDown, ChevronUp, UserCheck, ShieldCheck } from 'lucide-react';
import { EventPlan, VendorChecklistItem } from '../../types/planner';
import confetti from 'canvas-confetti';

interface VendorsTabProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({ plan, onUpdatePlan }) => {
  const [expandedVendorId, setExpandedVendorId] = useState<string | null>(null);

  const toggleVendorDone = (vendorId: string) => {
    const updatedChecklist = plan.vendorChecklist.map((item) => {
      if (item.id === vendorId) {
        const nextDone = !item.done;
        if (nextDone) {
          confetti({ particleCount: 20, spread: 50, origin: { y: 0.8 } });
        }
        return { ...item, done: nextDone };
      }
      return item;
    });

    onUpdatePlan({
      ...plan,
      vendorChecklist: updatedChecklist,
      updatedAt: new Date().toISOString(),
    });
  };

  const completedCount = plan.vendorChecklist.filter((v) => v.done).length;
  const totalVendors = plan.vendorChecklist.length;
  const percentComplete = totalVendors > 0 ? Math.round((completedCount / totalVendors) * 100) : 0;

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header & Lock-in Progress */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm border border-subtle space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> Partner Directory & Sourcing
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
              Vendor Checklist & Due Diligence
            </h2>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-white/60 dark:bg-slate-800/60 px-4 py-2 rounded-2xl border border-subtle">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Contracts Finalized:</span>
            <span className="text-sm font-bold text-rose-gold">
              {completedCount} / {totalVendors} ({percentComplete}%)
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>

      {/* Vendor Cards List */}
      <div className="space-y-4">
        {plan.vendorChecklist.map((vendor, idx) => {
          const isExpanded = expandedVendorId === vendor.id || (idx === 0 && expandedVendorId === null);

          return (
            <div
              key={vendor.id}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden ${
                vendor.done
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'glass-panel border-subtle hover:border-rose-gold/40'
              }`}
            >
              {/* Vendor Card Header */}
              <div className="p-5 sm:p-6 flex items-start sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleVendorDone(vendor.id)}
                    aria-label={`Mark ${vendor.vendorType} as ${vendor.done ? 'pending' : 'completed'}`}
                    className="mt-0.5 sm:mt-0 p-1 text-gray-400 hover:text-emerald-500 transition-colors focus:outline-none"
                  >
                    {vendor.done ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Square className="w-6 h-6 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-rose-gold/15 text-rose-gold">
                        {vendor.category}
                      </span>
                      {vendor.done && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                          Contract Locked
                        </span>
                      )}
                    </div>
                    <h3 className={`font-serif font-bold text-lg sm:text-xl mt-1 ${vendor.done ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                      {vendor.vendorType}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedVendorId(isExpanded ? '' : vendor.id)}
                  aria-expanded={isExpanded}
                  className="flex items-center gap-1 text-xs font-semibold text-rose-gold hover:text-indigo-950 dark:hover:text-white px-3 py-1.5 rounded-xl border border-subtle/50"
                >
                  <span className="hidden sm:inline">{isExpanded ? 'Hide Questions' : 'Due Diligence'}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-subtle/50 space-y-4">
                  {/* Pro Tip */}
                  {vendor.tips && (
                    <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-200 text-xs">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-900 dark:text-amber-100">Negotiation & Quality Tip:</p>
                        <p className="mt-0.5 leading-relaxed">{vendor.tips}</p>
                      </div>
                    </div>
                  )}

                  {/* Key Questions to Ask */}
                  {vendor.whatToAsk && vendor.whatToAsk.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-rose-gold" />
                        Crucial Interview Questions to Ask Before Signing:
                      </p>
                      <ul className="space-y-1.5">
                        {vendor.whatToAsk.map((q, qIdx) => (
                          <li
                            key={qIdx}
                            className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 bg-white/50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-subtle/40 flex items-start gap-2"
                          >
                            <span className="text-rose-gold font-bold">Q{qIdx + 1}:</span>
                            <span className="leading-snug">{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
