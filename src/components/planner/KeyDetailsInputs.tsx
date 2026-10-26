import React from 'react';
import { Calendar, AlertCircle } from 'lucide-react';
import { CityDestinationInput } from './CityDestinationInput';
import { GuestCountInput } from './GuestCountInput';

interface KeyDetailsInputsProps {
  title: string;
  setTitle: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  guestCount: number;
  setGuestCount: (val: number) => void;
  errors: Record<string, string>;
}

/**
 * Key details form section: Title, Date, City, and Guest Count with presets.
 */
export const KeyDetailsInputs: React.FC<KeyDetailsInputsProps> = ({
  title,
  setTitle,
  date,
  setDate,
  city,
  setCity,
  guestCount,
  setGuestCount,
  errors,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Title / Occasion */}
      <div>
        <label
          htmlFor="event-title"
          className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
        >
          Celebration Name / Honoree
        </label>
        <input
          id="event-title"
          type="text"
          placeholder="e.g. Diya & Kabir Grand Wedding"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white text-sm"
        />
        {errors.title && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.title}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <label
          htmlFor="event-date"
          className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
        >
          Event Date <span className="text-rose-gold">*</span>
        </label>
        <div className="relative">
          <input
            id="event-date"
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white text-sm cursor-pointer"
          />
          <Calendar className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
        </div>
        {errors.date && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.date}
          </p>
        )}
      </div>

      {/* City / Destination */}
      <CityDestinationInput city={city} setCity={setCity} error={errors.city} />

      {/* Guest Count */}
      <GuestCountInput
        guestCount={guestCount}
        setGuestCount={setGuestCount}
        error={errors.guestCount}
      />
    </div>
  );
};
