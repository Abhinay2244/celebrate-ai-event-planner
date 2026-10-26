import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { normalizeClientError } from '../../utils/errorHandler';

interface ErrorAlertProps {
  error: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

/**
 * Accessible error notification banner with friendly guidance and retry action.
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onRetry, onDismiss }) => {
  const normalized = normalizeClientError(error);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mb-8 p-5 sm:p-6 rounded-3xl bg-red-500/10 border-2 border-red-500/30 text-red-900 dark:text-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400 shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-semibold text-sm sm:text-base text-red-950 dark:text-red-100">
            {normalized.title}
          </h2>
          <p className="text-xs sm:text-sm mt-1 leading-relaxed text-red-800 dark:text-red-300 max-w-2xl">
            {normalized.message}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        {onRetry && normalized.canRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-gray-700 dark:text-gray-200 border border-subtle text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-rose-gold cursor-pointer"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
