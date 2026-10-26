import React from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { PlannerInput, EventType } from '../types/planner';
import { usePlannerForm } from '../hooks/usePlannerForm';
import { CuratedPresetsBanner } from './planner/CuratedPresetsBanner';
import { EventTypeSelector } from './planner/EventTypeSelector';
import { KeyDetailsInputs } from './planner/KeyDetailsInputs';
import { BudgetSelector } from './planner/BudgetSelector';

export interface PlannerFormProps {
  onSubmit: (input: PlannerInput) => void;
  isLoading: boolean;
}

/**
 * Primary Celebration Planner Form.
 * Collects event nature, city, guest count, rupee budget, and vision for AI architecture.
 */
export const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, isLoading }) => {
  const {
    eventType,
    setEventType,
    title,
    setTitle,
    date,
    setDate,
    city,
    setCity,
    guestCount,
    setGuestCount,
    totalBudget,
    setTotalBudget,
    theme,
    setTheme,
    specialNotes,
    setSpecialNotes,
    errors,
    applyTemplate,
    handleSubmit,
  } = usePlannerForm({ onSubmit });

  const handleSelectEventType = (type: EventType) => {
    setEventType(type);
    if (type === 'wedding') {
      setTheme('Royal Rajputana with Modern Candlelit Elegance');
    } else if (type === 'birthday') {
      setTheme('Cyberpunk Neon Glow & Rooftop Lounge');
    } else {
      setTheme('Eco-Friendly Terracotta & Folk Artisan Village');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Template selector banner */}
      <CuratedPresetsBanner onSelectTemplate={applyTemplate} />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xl space-y-8"
      >
        {/* Section 1: Event Type */}
        <EventTypeSelector eventType={eventType} onSelectType={handleSelectEventType} />

        {/* Section 2: Key Details Grid */}
        <KeyDetailsInputs
          title={title}
          setTitle={setTitle}
          date={date}
          setDate={setDate}
          city={city}
          setCity={setCity}
          guestCount={guestCount}
          setGuestCount={setGuestCount}
          errors={errors}
        />

        {/* Section 3: Budget in INR */}
        <BudgetSelector
          totalBudget={totalBudget}
          onChangeBudget={setTotalBudget}
          error={errors.totalBudget}
        />

        {/* Section 4: Aesthetic Theme & Special Vision */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="event-theme"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
            >
              Stylistic Theme / Color Ambience <span className="text-rose-gold">*</span>
            </label>
            <input
              id="event-theme"
              type="text"
              required
              placeholder="e.g. Royal Ivory & Gold Sunset, Minimalist Botanical, Cyberpunk Neon"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white text-sm"
            />
            {errors.theme && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.theme}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="event-notes"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2"
            >
              Special Requirements & Preferences (Optional)
            </label>
            <textarea
              id="event-notes"
              rows={3}
              placeholder="e.g. Lake-facing sundowner vows, 100% vegetarian Rajasthani banquet, Sangeet live music, accessible wheelchair ramps..."
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white text-sm resize-none"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-2xl bg-indigo-950 hover:bg-indigo-900 dark:bg-rosegold-gradient text-white font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Architecting Your Celebration Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-rose-gold dark:text-white" />
                <span>Formulate Blueprint with Celebrate AI</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
