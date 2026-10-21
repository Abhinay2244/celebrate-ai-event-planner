import React from 'react';
import { Palette, Utensils, Music, Sparkles, GlassWater, Wine, PartyPopper } from 'lucide-react';
import { EventPlan } from '../../types/planner';
import { ColorSwatch } from '../ColorSwatch';

interface IdeasTabProps {
  plan: EventPlan;
}

export const IdeasTab: React.FC<IdeasTabProps> = ({ plan }) => {
  const ideas = plan.personalizedIdeas;

  if (!ideas) {
    return <div className="p-8 text-center text-gray-500">No personalized ideas available.</div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
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
              {ideas.theme.name}
            </h2>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {ideas.theme.description}
        </p>

        {/* Color swatches */}
        <div className="pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Curated Color Palette (Click swatch to copy hex code):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ideas.theme.colorPalette.map((color, idx) => (
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

        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {ideas.decor.concept}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Focal Points */}
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-subtle space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-white flex items-center gap-1.5">
              <span>🌟 Primary Focal Installations:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              {ideas.decor.focalPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-gold font-bold">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DIY / High-Impact Tips */}
          <div className="p-4 rounded-2xl bg-rose-gold/10 border border-rose-gold/20 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-gold flex items-center gap-1.5">
              <span>💡 Smart Budget & High-Impact Hacks:</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-200">
              {ideas.decor.diyTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-gold font-bold">✓</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Culinary Curation & Bar Menu */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-sm border border-subtle space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-gold/15 text-rose-gold">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold">
              Gastronomy & Beverage Pairings
            </span>
            <h2 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
              Catering Blueprint ({ideas.menu.cuisineStyle})
            </h2>
          </div>
        </div>

        {/* Signature courses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {ideas.menu.signatureCourses.map((course, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-subtle space-y-2.5"
            >
              <h4 className="font-serif font-bold text-sm text-indigo-950 dark:text-white border-b border-subtle pb-1.5 flex items-center gap-1.5">
                <Wine className="w-3.5 h-3.5 text-rose-gold" />
                <span>{course.course}</span>
              </h4>
              <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-300">
                {course.items.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-1.5">
                    <span className="text-rose-gold">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Beverages */}
        {ideas.menu.beverages && ideas.menu.beverages.length > 0 && (
          <div className="p-4 rounded-2xl bg-indigo-950 text-white space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-gold flex items-center gap-1.5">
              <GlassWater className="w-3.5 h-3.5" /> Signature Mocktails & Spirits:
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {ideas.menu.beverages.map((bev, bIdx) => (
                <span
                  key={bIdx}
                  className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20 text-gray-200"
                >
                  {bev}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Activities & Music */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interactive Activities */}
        <div className="glass-panel p-6 rounded-3xl shadow-sm border border-subtle space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold">
                Engagement
              </span>
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                Guest Experience & Activities
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            {ideas.activities.map((act, aIdx) => (
              <div key={aIdx} className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-subtle space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-gray-900 dark:text-white">{act.title}</h4>
                  <span className="text-[10px] text-rose-gold font-medium px-2 py-0.5 rounded-md bg-rose-gold/10">
                    {act.bestTiming}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">{act.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Music & Sound Atmosphere */}
        <div className="glass-panel p-6 rounded-3xl shadow-sm border border-subtle space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-gold">
                Sonic Architecture
              </span>
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white">
                Music & Atmosphere ({ideas.music.vibe})
              </h3>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-subtle space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Recommended Genres:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ideas.music.recommendedGenres.map((g, gIdx) => (
                  <span key={gIdx} className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-subtle space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Artist & Playlist References:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ideas.music.samplePlaylistsOrArtists.map((artist, artIdx) => (
                  <span key={artIdx} className="text-xs px-2.5 py-0.5 rounded-md bg-rose-gold/15 text-rose-gold font-medium">
                    🎵 {artist}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
