import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { normalizePaletteColor } from '../utils/color';

export interface ColorSwatchProps {
  color: unknown;
  index: number;
}

/**
 * Interactive color palette swatch with inline style background, hex text, and click-to-copy.
 */
export const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, index }) => {
  const [copied, setCopied] = useState(false);
  const normalized = normalizePaletteColor(color, index);

  const handleCopy = () => {
    navigator.clipboard.writeText(normalized.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy colour ${normalized.name}: ${normalized.hex}`}
      title={`Click to copy ${normalized.hex}`}
      className="min-h-[44px] flex items-center gap-3 p-2.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-subtle hover:border-rose-gold/60 transition-all text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-gold focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 cursor-pointer"
    >
      <span className="sr-only" aria-live="polite">
        {copied ? `Copied ${normalized.hex} to clipboard` : ''}
      </span>
      {/* 48x48 rounded circle with visible border and inline style backgroundColor */}
      <div
        className="w-12 h-12 rounded-full shrink-0 border-2 border-white dark:border-slate-700 shadow-md transition-transform group-hover:scale-105"
        style={{ backgroundColor: normalized.hex }}
      />
      <div className="min-w-0 pr-1">
        <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
          {normalized.name}
        </p>
        <p className="text-xs font-mono font-medium text-gray-600 dark:text-gray-300">
          {normalized.hex}
        </p>
        <div className="text-[10px] text-gray-400 group-hover:text-rose-gold flex items-center gap-0.5 mt-0.5">
          {copied ? (
            <span className="text-emerald-500 font-semibold flex items-center gap-0.5">
              <Check className="w-3 h-3" /> Copied
            </span>
          ) : (
            <span className="flex items-center gap-0.5">
              <Copy className="w-3 h-3" /> Click to copy
            </span>
          )}
        </div>
      </div>
    </button>
  );
};
