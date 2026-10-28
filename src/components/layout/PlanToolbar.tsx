import React from 'react';
import { ArrowLeft, FolderOpen } from 'lucide-react';

interface PlanToolbarProps {
  planTitle: string;
  savedPlansCount: number;
  onNewPlan: () => void;
  onOpenSavedModal: () => void;
}

/**
 * Top toolbar for an active celebration plan with title landmark and navigation actions.
 */
export const PlanToolbar: React.FC<PlanToolbarProps> = ({
  planTitle,
  savedPlansCount,
  onNewPlan,
  onOpenSavedModal,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-subtle">
      <div className="flex items-center gap-3">
        <button
          onClick={onNewPlan}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-950 dark:hover:text-white px-3 py-1.5 rounded-xl border border-subtle bg-white/50 dark:bg-slate-800/50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>New Plan</span>
        </button>
        <div className="h-4 w-[1px] bg-subtle" />
        <h1 className="text-xs sm:text-sm text-rose-gold font-semibold truncate max-w-[200px] sm:max-w-xs font-serif">
          {planTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSavedModal}
          className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-200 hover:text-rose-gold px-3 py-1.5 rounded-xl border border-subtle min-h-[36px] cursor-pointer"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Saved Plans ({savedPlansCount})</span>
        </button>
      </div>
    </div>
  );
};
