import React, { useState } from 'react';
import { Sparkles, Calendar, MapPin, Users, HeartHandshake, Cake, Users2, IndianRupee, AlertCircle, Wand2 } from 'lucide-react';
import { EventType, PlannerInput, plannerInputSchema } from '../types/planner';
import { formatINR } from '../utils/budget';

interface PlannerFormProps {
  onSubmit: (input: PlannerInput) => void;
  isLoading: boolean;
}

const SAMPLE_TEMPLATES: Array<{
  label: string;
  data: PlannerInput;
}> = [
  {
    label: '✨ Udaipur Royal Wedding (₹35L, 300 guests)',
    data: {
      eventType: 'wedding',
      title: 'Aarav & Maya Lakeside Wedding',
      date: '2026-11-28',
      city: 'Udaipur',
      guestCount: 300,
      totalBudget: 3500000,
      theme: 'Royal Rajputana with Modern Candlelit Elegance',
      specialNotes: 'Lake-facing sundowner vows, pure vegetarian traditional & continental fusion banquet, Sangeet choreography stage.',
    },
  },
  {
    label: '🎂 Neon Milestone Birthday (₹2.5L, 80 guests)',
    data: {
      eventType: 'birthday',
      title: 'Samay’s 21st Euphoria Night',
      date: '2026-12-19',
      city: 'Mumbai',
      guestCount: 80,
      totalBudget: 250000,
      theme: 'Cyberpunk Neon Glow & Rooftop Lounge',
      specialNotes: 'Live DJ, artisanal mocktail & cocktail bar, neon photo-booth, finger food tapas.',
    },
  },
  {
    label: '🎪 Community Heritage Festival (₹6L, 500 guests)',
    data: {
      eventType: 'community',
      title: 'Bengaluru Autumn Arts & Food Mela',
      date: '2026-10-15',
      city: 'Bengaluru',
      guestCount: 500,
      totalBudget: 600000,
      theme: 'Eco-Friendly Terracotta & Folk Artisan Village',
      specialNotes: 'Local craft stalls, acoustic stage, zero-waste biodegradable packaging, wheelchair access.',
    },
  },
];

export const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, isLoading }) => {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [city, setCity] = useState('Udaipur');
  const [guestCount, setGuestCount] = useState<number>(200);
  const [totalBudget, setTotalBudget] = useState<number>(1500000);
  const [theme, setTheme] = useState('Royal Heritage with Modern Floral Elegance');
  const [specialNotes, setSpecialNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const applyTemplate = (template: typeof SAMPLE_TEMPLATES[0]) => {
    setEventType(template.data.eventType);
    setTitle(template.data.title || '');
    setDate(template.data.date);
    setCity(template.data.city);
    setGuestCount(template.data.guestCount);
    setTotalBudget(template.data.totalBudget);
    setTheme(template.data.theme);
    setSpecialNotes(template.data.specialNotes || '');
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const candidateData = {
      eventType,
      title: title.trim() || undefined,
      date,
      city: city.trim(),
      guestCount: Number(guestCount),
      totalBudget: Number(totalBudget),
      theme: theme.trim(),
      specialNotes: specialNotes.trim(),
    };

    const result = plannerInputSchema.safeParse(candidateData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const fieldName = String(err.path[0] || 'general');
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Template selector banner */}
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
                onClick={() => applyTemplate(tmpl)}
                className="text-xs px-3 py-1.5 min-h-[36px] rounded-lg border border-rose-gold/40 hover:bg-rose-gold/10 text-gray-800 dark:text-gray-100 font-medium transition-colors cursor-pointer"
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="glass-panel rounded-3xl p-6 sm:p-10 shadow-xl space-y-8"
      >
        {/* Section 1: Event Type */}
        <div>
          <h3 className="block text-sm font-semibold tracking-wide text-gray-900 dark:text-white uppercase mb-3">
            1. Select Event Nature
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { type: 'wedding', label: 'Wedding', desc: 'Sangeet, Vows & Receptions', icon: HeartHandshake },
              { type: 'birthday', label: 'Milestone Birthday', desc: '1st, 18th, 21st, 50th Galas', icon: Cake },
              { type: 'community', label: 'Community & Gala', desc: 'Festivals, Meetups & Fundraisers', icon: Users2 },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = eventType === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setEventType(item.type as EventType);
                    if (item.type === 'wedding') {
                      setTheme('Royal Rajputana with Modern Candlelit Elegance');
                    } else if (item.type === 'birthday') {
                      setTheme('Cyberpunk Neon Glow & Rooftop Lounge');
                    } else {
                      setTheme('Eco-Friendly Terracotta & Folk Artisan Village');
                    }
                  }}
                  className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'border-rose-gold bg-rose-gold/10 dark:bg-rose-gold/15 shadow-md'
                      : 'border-transparent bg-white/60 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-rose-gold' : 'text-gray-600 dark:text-gray-400'}`} />
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-gold ring-4 ring-rose-gold/20" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-base">{item.label}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Key Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Title / Occasion */}
          <div>
            <label htmlFor="event-title" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
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
            {errors.title && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.title}</p>}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="event-date" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Event Date <span className="text-rose-gold">*</span>
            </label>
            <div className="relative">
              <input
                id="event-date"
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white text-sm"
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            {errors.date && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.date}</p>}
          </div>

          {/* City / Destination */}
          <div>
            <label htmlFor="event-city" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              City / Destination <span className="text-rose-gold">*</span>
            </label>
            <div className="relative">
              <input
                id="event-city"
                type="text"
                required
                placeholder="e.g. Mumbai, Udaipur, Goa, Delhi, Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white text-sm"
              />
              <MapPin className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            <div className="flex gap-2 mt-2.5 flex-wrap">
              {['Udaipur', 'Goa', 'Mumbai', 'Delhi', 'Jaipur', 'Bengaluru'].map((c) => (
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
            {errors.city && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.city}</p>}
          </div>

          {/* Guest Count */}
          <div>
            <label htmlFor="event-guests" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Guest Count <span className="text-rose-gold">*</span>
            </label>
            <div className="relative">
              <input
                id="event-guests"
                type="number"
                min={5}
                max={50000}
                required
                value={guestCount}
                onChange={(e) => setGuestCount(Math.max(5, parseInt(e.target.value) || 5))}
                className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white text-sm"
              />
              <Users className="w-4 h-4 text-gray-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            <div className="flex gap-2 mt-2.5 flex-wrap">
              {[50, 100, 200, 350, 600, 1000].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setGuestCount(num)}
                  className="text-xs px-2.5 py-1.5 min-h-[36px] rounded-lg bg-black/5 dark:bg-white/10 text-gray-800 dark:text-gray-100 font-medium hover:text-rose-gold hover:border-rose-gold border border-transparent transition-colors cursor-pointer"
                >
                  {num}
                </button>
              ))}
            </div>
            {errors.guestCount && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.guestCount}</p>}
          </div>
        </div>

        {/* Section 3: Budget in INR */}
        <div className="p-5 rounded-2xl bg-amber-500/5 border border-rose-gold/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
            <label htmlFor="event-budget" className="text-xs font-semibold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-rose-gold" />
              Total Budget in INR (₹) <span className="text-rose-gold">*</span>
            </label>
            <span className="text-base sm:text-lg font-serif font-bold text-rose-gold">
              {formatINR(totalBudget)} <span className="text-xs font-sans text-gray-600 dark:text-gray-400 font-normal">({formatINR(totalBudget, true)})</span>
            </span>
          </div>

          <div className="relative">
            <input
              id="event-budget"
              type="number"
              min={5000}
              max={100000000}
              step={10000}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Math.max(5000, parseInt(e.target.value) || 5000))}
              className="w-full px-4 py-3 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white font-mono text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 mt-3 items-center">
            <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Quick allocations:</span>
            {[
              { label: '₹1.5 Lakh', val: 150000 },
              { label: '₹5 Lakh', val: 500000 },
              { label: '₹12 Lakh', val: 1200000 },
              { label: '₹25 Lakh', val: 2500000 },
              { label: '₹50 Lakh', val: 5000000 },
              { label: '₹1 Crore', val: 10000000 },
            ].map((p) => (
              <button
                type="button"
                key={p.label}
                onClick={() => setTotalBudget(p.val)}
                className="text-xs px-3 py-1.5 min-h-[36px] rounded-lg border border-subtle bg-white/80 dark:bg-slate-800/90 hover:border-rose-gold text-gray-800 dark:text-gray-100 font-medium transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
          {errors.totalBudget && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.totalBudget}</p>}
        </div>

        {/* Section 4: Theme / Vibe & Special Notes */}
        <div className="space-y-4">
          <div>
            <label htmlFor="event-theme" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Theme / Aesthetics / Vibe <span className="text-rose-gold">*</span>
            </label>
            <input
              id="event-theme"
              type="text"
              required
              placeholder="e.g. Vintage Tuscan Sun, Bollywood Grandeur, Minimalist Glasshouse, Boho Sundowner"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/70 dark:bg-slate-800/80 border border-subtle focus:outline-none focus:ring-2 focus:ring-rose-gold text-gray-900 dark:text-white text-sm"
            />
            {errors.theme && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.theme}</p>}
          </div>

          <div>
            <label htmlFor="event-notes" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              Special Notes & Cultural Traditions (Optional)
            </label>
            <textarea
              id="event-notes"
              rows={3}
              placeholder="e.g. Need Jain food options, outdoor garden ceremony with rain backup, fireworks permission, pet friendly."
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
            className="w-full py-4 px-6 rounded-2xl bg-indigo-950 dark:bg-rosegold-gradient text-white font-medium text-base shadow-lg hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group focus:outline-none focus:ring-4 focus:ring-rose-gold/30"
          >
            <Sparkles className="w-5 h-5 text-rose-gold dark:text-white group-hover:rotate-12 transition-transform" />
            <span>Generate Celebration Blueprint</span>
          </button>
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2.5">
            Powered by Gemini 3.8 Flash • Strict Zod-validated budget math & vendor intelligence
          </p>
        </div>
      </form>
    </div>
  );
};
