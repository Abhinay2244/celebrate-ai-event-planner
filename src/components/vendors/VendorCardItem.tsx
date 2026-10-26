import React from 'react';
import { Square, CheckCircle2, ChevronDown, ChevronUp, Lightbulb, HelpCircle } from 'lucide-react';
import { VendorChecklistItem } from '../../types/planner';

interface VendorCardItemProps {
  vendor: VendorChecklistItem;
  isExpanded: boolean;
  onToggleDone: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

/**
 * Individual vendor checklist item with checkbox, due diligence accordion, and questions.
 */
export const VendorCardItem: React.FC<VendorCardItemProps> = ({
  vendor,
  isExpanded,
  onToggleDone,
  onToggleExpand,
}) => {
  return (
    <div
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
            onClick={() => onToggleDone(vendor.id)}
            aria-label={`Mark ${vendor.vendorType} as ${vendor.done ? 'pending' : 'completed'}`}
            className="mt-0.5 sm:mt-0 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-gold rounded-xl cursor-pointer"
          >
            {vendor.done ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
            ) : (
              <Square className="w-6 h-6 text-gray-500 hover:text-gray-700 dark:text-gray-400" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-rose-gold/15 text-rose-gold">
                {vendor.category}
              </span>
              {vendor.done && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                  Contract Locked
                </span>
              )}
            </div>
            <h3
              className={`font-serif font-bold text-lg sm:text-xl mt-1 ${
                vendor.done
                  ? 'line-through text-gray-500 dark:text-gray-400'
                  : 'text-gray-900 dark:text-white'
              }`}
            >
              {vendor.vendorType}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleExpand(vendor.id)}
          aria-expanded={isExpanded}
          className="flex items-center gap-1 text-xs font-semibold text-rose-gold hover:text-indigo-950 dark:hover:text-white px-3 py-1.5 rounded-xl border border-subtle min-h-[44px] cursor-pointer"
        >
          <span className="hidden sm:inline">
            {isExpanded ? 'Hide Questions' : 'Due Diligence'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Accordion Content */}
      {isExpanded && (
        <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-subtle/50 space-y-4">
          {/* Pro Tip */}
          {vendor.tips && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-950 dark:text-amber-100">
                  Negotiation & Quality Tip:
                </p>
                <p className="mt-0.5 leading-relaxed">{vendor.tips}</p>
              </div>
            </div>
          )}

          {/* Key Questions to Ask */}
          {vendor.whatToAsk && vendor.whatToAsk.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
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
};
