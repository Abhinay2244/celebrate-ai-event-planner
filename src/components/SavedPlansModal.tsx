import React, { useState } from 'react';
import { X, Trash2, Calendar, MapPin, IndianRupee, Users, Sparkles, FolderOpen, ArrowRight, AlertTriangle } from 'lucide-react';
import { EventPlan } from '../types/planner';
import { formatINR } from '../utils/budget';

interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: EventPlan[];
  activePlanId: string | null;
  onSelectPlan: (plan: EventPlan) => void;
  onDeletePlan: (id: string) => void;
  onNewPlan: () => void;
}

export const SavedPlansModal: React.FC<SavedPlansModalProps> = ({
  isOpen,
  onClose,
  savedPlans,
  activePlanId,
  onSelectPlan,
  onDeletePlan,
  onNewPlan,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="saved-plans-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="w-full max-w-2xl glass-dropdown rounded-3xl border border-subtle shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-subtle pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-gold/15 text-rose-gold">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="saved-plans-title" className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Saved Celebration Blueprints
              </h2>
              <p className="text-xs text-gray-500">
                Stored privately in your browser's local storage ({savedPlans.length} plans)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close saved plans modal"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plans List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {savedPlans.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Sparkles className="w-8 h-8 text-rose-gold mx-auto" />
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                No saved celebrations yet
              </p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Create your first wedding, birthday, or community gathering blueprint to have it saved here automatically.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNewPlan();
                }}
                className="mt-2 text-xs px-4 py-2 rounded-xl bg-indigo-950 dark:bg-rose-gold text-white font-medium"
              >
                + Plan New Event
              </button>
            </div>
          ) : (
            savedPlans.map((plan) => {
              const isActive = plan.id === activePlanId;
              const isConfirmingDelete = confirmDeleteId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'border-rose-gold bg-rose-gold/10 dark:bg-rose-gold/15 shadow-sm'
                      : 'border-subtle hover:border-gray-300 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-800/50'
                  }`}
                >
                  <div
                    onClick={() => {
                      onSelectPlan(plan);
                      onClose();
                    }}
                    className="cursor-pointer space-y-1.5 flex-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                        {plan.input.eventType}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold text-rose-gold px-2 py-0.5 rounded bg-rose-gold/20">
                          Active Plan
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-base text-gray-900 dark:text-white">
                      {plan.summary.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-gold" /> {plan.input.city}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-rose-gold" /> {plan.input.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-rose-gold" /> {formatINR(plan.totalBudgetCalculated)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!isConfirmingDelete && (
                      <button
                        onClick={() => {
                          onSelectPlan(plan);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950 text-white dark:bg-slate-700 hover:opacity-90 flex items-center gap-1"
                      >
                        <span>Load</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}

                    {/* Inline Delete Confirmation that never gets blocked by iframe sandbox */}
                    {isConfirmingDelete ? (
                      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-red-500/10 border border-red-500/30 text-xs animate-fadeIn">
                        <span className="text-[11px] font-medium text-red-600 dark:text-red-400 pl-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Delete?
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePlan(plan.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-[11px] shadow-xs transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteId(null);
                          }}
                          className="px-2 py-1 rounded-lg bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 text-[11px] transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(plan.id);
                        }}
                        aria-label={`Delete ${plan.summary.title}`}
                        title="Delete celebration plan"
                        className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-subtle">
          <button
            onClick={() => {
              onClose();
              onNewPlan();
            }}
            className="text-xs px-4 py-2 rounded-xl bg-indigo-950 dark:bg-rose-gold text-white font-medium hover:opacity-90"
          >
            + Create New Celebration
          </button>
        </div>
      </div>
    </div>
  );
};
