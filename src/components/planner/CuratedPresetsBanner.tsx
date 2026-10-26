import React from 'react';
import { Wand2 } from 'lucide-react';
import { SAMPLE_TEMPLATES } from '../../hooks/usePlannerForm';

interface CuratedPresetsBannerProps {
  onSelectTemplate: (template: (typeof SAMPLE_TEMPLATES)[0]) => void;
}

/**
 * Top banner presenting quick-start curated celebration templates.
 */
export const CuratedPresetsBanner: React.FC<CuratedPresetsBannerProps> = ({ onSelectTemplate }) => {
  return (
    <div className="mb-6 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-subtle shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200">
          <Wand2 className="w-4 h-4 text-rose-gold" />
          <span>Quick Start with Curated Blueprints:</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectTemplate(tmpl)}
              className="text-xs px-3 py-1.5 min-h-[36px] rounded-lg border border-rose-gold/40 hover:bg-rose-gold/10 text-gray-800 dark:text-gray-100 font-medium transition-colors cursor-pointer"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
