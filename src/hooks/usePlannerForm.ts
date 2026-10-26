import { useState, FormEvent } from 'react';
import { EventType, PlannerInput, plannerInputSchema } from '../types/planner';
import { PLANNER_CONSTRAINTS } from '../constants/index.ts';

/**
 * Curated example presets for one-click plan population.
 */
export const SAMPLE_TEMPLATES: Array<{
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
      specialNotes:
        'Lake-facing sundowner vows, pure vegetarian traditional & continental fusion banquet, Sangeet choreography stage.',
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
      specialNotes:
        'Live DJ, artisanal mocktail & cocktail bar, neon photo-booth, finger food tapas.',
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
      specialNotes:
        'Local craft stalls, acoustic stage, zero-waste biodegradable packaging, wheelchair access.',
    },
  },
];

interface UsePlannerFormProps {
  onSubmit: (input: PlannerInput) => void;
}

/**
 * Custom hook encapsulating planner form state, template loading, and zod validation.
 */
export function usePlannerForm({ onSubmit }: UsePlannerFormProps) {
  const [eventType, setEventType] = useState<EventType>('wedding');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 45);
    return d.toISOString().split('T')[0];
  });
  const [city, setCity] = useState('Udaipur');
  const [guestCount, setGuestCount] = useState<number>(PLANNER_CONSTRAINTS.DEFAULT_GUEST_COUNT);
  const [totalBudget, setTotalBudget] = useState<number>(PLANNER_CONSTRAINTS.DEFAULT_BUDGET_INR);
  const [theme, setTheme] = useState('Royal Heritage with Modern Floral Elegance');
  const [specialNotes, setSpecialNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const applyTemplate = (template: (typeof SAMPLE_TEMPLATES)[0]) => {
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

  const handleSubmit = (e: FormEvent) => {
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

  return {
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
  };
}
