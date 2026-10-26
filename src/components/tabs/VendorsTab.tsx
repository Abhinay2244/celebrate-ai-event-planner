import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';
import { EventPlan } from '../../types/planner';
import { VendorCardItem } from '../vendors/VendorCardItem';
import confetti from 'canvas-confetti';

export interface VendorsTabProps {
  plan: EventPlan;
  onUpdatePlan: (updatedPlan: EventPlan) => void;
}

/**
 * Partner Directory & Sourcing Tab.
 * Checklists critical vendors, contract lock-in progress, negotiation tips, and interview questions.
 */
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
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Contracts Finalized:
            </span>
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
        {plan.vendorChecklist.map((vendor, idx) => (
          <VendorCardItem
            key={vendor.id}
            vendor={vendor}
            isExpanded={expandedVendorId === vendor.id || (idx === 0 && expandedVendorId === null)}
            onToggleDone={toggleVendorDone}
            onToggleExpand={(id) => setExpandedVendorId(expandedVendorId === id ? '' : id)}
          />
        ))}
      </div>
    </div>
  );
};
