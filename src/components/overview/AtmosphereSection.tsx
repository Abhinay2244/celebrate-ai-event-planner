import React from 'react';
import { Palette } from 'lucide-react';
import { EventPlan, TabId } from '../../types/planner';
import { ColorSwatch } from '../ColorSwatch';

interface AtmosphereSectionProps {
  theme: NonNullable<EventPlan['personalizedIdeas']>['theme'];
  onNavigateTab: (tabId: TabId) => void;
}

/**
 * Signature visual palette and moodboard summary section in OverviewTab.
 */
export const AtmosphereSection: React.FC<AtmosphereSectionProps> = ({ theme, onNavigateTab }) => {
  if (!theme) return null;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold flex items-center gap-1.5">
            <Palette className="w-4 h-4" /> Signature Visual Palette & Mood
          </span>
          <h3 className="font-serif text-xl font-bold text-gray-900 dark:text-white mt-1">
            {theme.name}
          </h3>
        </div>
        <button
          onClick={() => onNavigateTab('ideas')}
          className="text-xs font-semibold text-rose-gold hover:underline self-start sm:self-auto cursor-pointer"
        >
          Explore Complete Scenography & Food →
        </button>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {theme.description}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        {theme.colorPalette.map((color, idx) => (
          <ColorSwatch key={color.hex + idx} color={color} index={idx} />
        ))}
      </div>
    </div>
  );
};
