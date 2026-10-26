import React from 'react';
import { PartyPopper, Music } from 'lucide-react';
import { EventPlan } from '../../types/planner';

interface EntertainmentSectionProps {
  activities: NonNullable<EventPlan['personalizedIdeas']>['activities'];
  music: NonNullable<EventPlan['personalizedIdeas']>['music'];
}

/**
 * Guest activities, interactive entertainment, and sonic architecture section.
 */
export const EntertainmentSection: React.FC<EntertainmentSectionProps> = ({
  activities,
  music,
}) => {
  return (
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
          {activities.map((act, aIdx) => (
            <div
              key={aIdx}
              className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-subtle space-y-1"
            >
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
              Music & Atmosphere ({music.vibe})
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-subtle space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Recommended Genres:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {music.recommendedGenres.map((g, gIdx) => (
                <span
                  key={gIdx}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                >
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
              {music.samplePlaylistsOrArtists.map((artist, artIdx) => (
                <span
                  key={artIdx}
                  className="text-xs px-2.5 py-0.5 rounded-md bg-rose-gold/15 text-rose-gold font-medium"
                >
                  🎵 {artist}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
