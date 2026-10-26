import React from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

interface CityDestinationInputProps {
  city: string;
  setCity: (val: string) => void;
  error?: string;
}

const CITY_PRESETS = ['Udaipur', 'Jaipur', 'Mumbai', 'Goa', 'Bengaluru', 'Delhi NCR'] as const;

/**
 * Host City / Destination input field with preset quick-selection buttons.
 */
export const CityDestinationInput: React.FC<CityDestinationInputProps> = ({
  city,
  setCity,
  error,
}) => {
  return (
    <div>
      <label
        htmlFor="event-city"
        className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
      >
        Host City / Destination <span className="text-rose-gold">*</span>
      </label>
      <div className="relative">
        <input
          id="event-city"
          type="text"
          required
          placeholder="e.g. Udaipur, Goa, Mumbai"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white text-sm"
        />
        <MapPin className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
      </div>
      <div className="flex gap-1.5 mt-2.5 flex-wrap">
        {CITY_PRESETS.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setCity(c)}
            className="text-xs px-2.5 py-1.5 min-h-[36px] rounded-lg bg-black/5 dark:bg-white/10 text-gray-800 dark:text-gray-100 font-medium hover:text-rose-gold hover:border-rose-gold border border-transparent transition-colors cursor-pointer"
          >
            {c}
          </button>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};
