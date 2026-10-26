import React, { useState, useEffect } from 'react';
import { X, Sparkles, FolderOpen } from 'lucide-react';
import { EventPlan } from '../types/planner';
import { SavedPlanCard } from './saved/SavedPlanCard';

export interface SavedPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: EventPlan[];
  activePlanId: string | null;
  onSelectPlan: (plan: EventPlan) => void;
  onDeletePlan: (id: string) => void;
  onNewPlan: () => void;
}

/**
 * Modal dialog displaying all locally saved celebration blueprints.
 * Enables loading existing plans or permanently deleting blueprints.
 */
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

  useEffect(() => {
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
              <h2
                id="saved-plans-title"
                className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
              >
                Saved Celebration Blueprints
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Stored privately in your browser's local storage ({savedPlans.length} plans)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close saved plans modal"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-gold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plans List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {savedPlans.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Sparkles className="w-8 h-8 text-rose-gold mx-auto" />
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                No saved celebrations yet
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
                Create your first wedding, birthday, or community gathering blueprint to have it
                saved here automatically.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNewPlan();
                }}
                className="mt-2 text-xs min-h-[44px] px-4 py-2 rounded-xl bg-indigo-950 dark:bg-rose-gold text-white font-semibold cursor-pointer"
              >
                + Plan New Event
              </button>
            </div>
          ) : (
            savedPlans.map((plan) => (
              <SavedPlanCard
                key={plan.id}
                plan={plan}
                isActive={plan.id === activePlanId}
                isConfirmingDelete={confirmDeleteId === plan.id}
                onSelect={() => {
                  onSelectPlan(plan);
                  onClose();
                }}
                onRequestDelete={() => setConfirmDeleteId(plan.id)}
                onConfirmDelete={() => {
                  onDeletePlan(plan.id);
                  setConfirmDeleteId(null);
                }}
                onCancelDelete={() => setConfirmDeleteId(null)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-subtle">
          <button
            onClick={() => {
              onClose();
              onNewPlan();
            }}
            className="text-xs px-4 py-2 min-h-[40px] rounded-xl bg-indigo-950 dark:bg-rose-gold text-white font-medium hover:opacity-90 cursor-pointer"
          >
            + Create New Celebration
          </button>
        </div>
      </div>
    </div>
  );
};
