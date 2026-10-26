import React from 'react';
import { Palette, Sparkles } from 'lucide-react';
import { EventPlan } from '../../types/planner';
import { ColorSwatch } from '../ColorSwatch';

interface ThemeDecorSectionProps {
  theme: NonNullable<EventPlan['personalizedIdeas']>['theme'];
  decor: NonNullable<EventPlan['personalizedIdeas']>['decor'];
}

/**
 * Visual styling, palette swatches, and decor scenography section.
 */
export const ThemeDecorSection: React.FC<ThemeDecorSectionProps> = ({ theme, decor }) => {
  return (
    <div className="space-y-8">
      {/* 1. Theme & Color Atmosphere */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm border border-subtle space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-gold/15 text-rose-gold">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold">
              Visual Direction
            </span>
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
              {theme.name}
            </h2>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {theme.description}
        </p>

        {/* Color swatches */}
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Curated Color Palette (Click swatch to copy hex code):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {theme.colorPalette.map((color, idx) => (
              <ColorSwatch key={idx} color={color} index={idx} />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Decor & Spatial Scenography */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm border border-subtle space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold">
              Scenography & Floral Architecture
            </span>
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
              Decor Concept & Focal Zones
            </h2>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{decor.concept}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Focal Points */}
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-subtle space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-white flex items-center gap-1.5">
              <span>🌟 Primary Focal Installations:</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
              {decor.focalPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-gold font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DIY / High-Impact Tips */}
          <div className="p-4 rounded-2xl bg-rose-gold/10 border border-rose-gold/20 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-gold flex items-center gap-1.5">
              <span>💡 Smart Budget & High-Impact Hacks:</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-200">
              {decor.diyTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-gold font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
