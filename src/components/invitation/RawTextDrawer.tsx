import React from 'react';
import { Mail, Copy, Check } from 'lucide-react';

interface RawTextDrawerProps {
  currentContent: string;
  textFormat: string;
  copied: boolean;
  onCopyText: () => void;
}

/**
 * Bottom drawer for previewing and copying raw invitation draft text.
 */
export const RawTextDrawer: React.FC<RawTextDrawerProps> = ({
  currentContent,
  textFormat,
  copied,
  onCopyText,
}) => {
  return (
    <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-subtle space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-rose-gold" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            Raw Invitation Text ({textFormat.toUpperCase()} DRAFT)
          </h3>
        </div>
        <button
          onClick={onCopyText}
          className="text-xs font-semibold text-rose-gold hover:underline flex items-center gap-1 cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-mono whitespace-pre-line bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-subtle/40 leading-relaxed">
        {currentContent}
      </p>
    </div>
  );
};
