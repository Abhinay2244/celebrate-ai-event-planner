import { describe, it, expect } from 'vitest';
import { plannerInputSchema, refineRequestSchema } from '../src/types/planner';

describe('Planner Input Schema Validation', () => {
  it('accepts valid wedding input', () => {
    const input = {
      eventType: 'wedding',
      title: 'Aarav & Maya Royal Wedding',
      date: '2026-11-28',
      city: 'Udaipur',
      guestCount: 300,
      totalBudget: 3500000,
      theme: 'Royal Rajputana Elegance',
      specialNotes: 'Lake view vows and vegetarian banquet',
    };

    const result = plannerInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.eventType).toBe('wedding');
      expect(result.data.guestCount).toBe(300);
      expect(result.data.totalBudget).toBe(3500000);
    }
  });

  it('accepts valid birthday input with default specialNotes', () => {
    const input = {
      eventType: 'birthday',
      date: '2026-12-19',
      city: 'Mumbai',
      guestCount: 50,
      totalBudget: 150000,
      theme: 'Neon Glow Rooftop',
    };

    const result = plannerInputSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.specialNotes).toBe('');
    }
  });

  it('accepts valid community festival input', () => {
    const input = {
      eventType: 'community',
      title: 'Bengaluru Heritage Mela',
      date: '2026-10-15',
      city: 'Bengaluru',
      guestCount: 500,
      totalBudget: 600000,
      theme: 'Artisan Folk Mela',
    };

    const result = plannerInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('rejects budget below minimum 5000 INR', () => {
    const input = {
      eventType: 'wedding',
      date: '2026-11-28',
      city: 'Goa',
      guestCount: 100,
      totalBudget: 2000,
      theme: 'Beach Sundowner',
    };

    const result = plannerInputSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least ₹5,000');
    }
  });

  it('rejects guest count below 5', () => {
    const input = {
      eventType: 'birthday',
      date: '2026-12-19',
      city: 'Delhi',
      guestCount: 2,
      totalBudget: 50000,
      theme: 'Cozy Dinner',
    };

    const result = plannerInputSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('at least 5');
    }
  });

  it('rejects invalid event type', () => {
    const input = {
      eventType: 'concert', // not in enum
      date: '2026-12-19',
      city: 'Delhi',
      guestCount: 100,
      totalBudget: 50000,
      theme: 'Live Music',
    };

    const result = plannerInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('Refine Request Schema Validation', () => {
  const samplePlan: any = {
    id: 'plan-123',
    createdAt: '2026-10-21T00:00:00.000Z',
    updatedAt: '2026-10-21T00:00:00.000Z',
    input: {
      eventType: 'wedding',
      date: '2026-11-28',
      city: 'Udaipur',
      guestCount: 200,
      totalBudget: 1500000,
      theme: 'Royal Rajputana',
      specialNotes: '',
    },
    summary: {
      title: 'Royal Udaipur Wedding',
      tagline: 'Lakeside grandeur',
      vibeSummary: 'Opulent and intimate',
      budgetSummary: 'Well balanced',
      guestSummary: '200 guests',
    },
    budgetBreakdown: [
      { category: 'Venue', amount: 600000, percentage: 40, description: 'Lakeside palace' },
      { category: 'Catering', amount: 900000, percentage: 60, description: 'Royal banquet' },
    ],
    totalBudgetCalculated: 1500000,
    timeline: [
      { timeframe: '6 Months Out', title: 'Book Venue', description: 'Lock palace date', tasks: ['Deposit'] },
    ],
    vendorChecklist: [
      { id: 'v1', category: 'Venue', vendorType: 'Palace', whatToAsk: ['Capacity?'], tips: 'Inspect power backup', done: false },
    ],
    personalizedIdeas: {
      theme: { name: 'Royal Ivory', description: 'Grand style', colorPalette: ['#1B1E4B', '#B76E79'] },
      decor: { concept: 'Marigold floral', focalPoints: ['Mandap'], diyTips: ['Fairy lights'] },
      menu: { cuisineStyle: 'Rajasthani', signatureCourses: [{ course: 'Dinner', items: ['Dal Baati'] }], beverages: ['Chaas'] },
      activities: [{ title: 'Folk Dance', description: 'Live performance', bestTiming: 'Sangeet' }],
      music: { vibe: 'Traditional folk', recommendedGenres: ['Sufi'], samplePlaylistsOrArtists: ['Mame Khan'] },
    },
    invitationText: {
      formal: 'You are invited',
      casual: 'Join our wedding',
      whatsapp: 'Wedding alert!',
    },
  };

  it('accepts valid refine request', () => {
    const req = {
      plan: samplePlan,
      message: 'Make it 10% cheaper and add rain backup',
    };

    const result = refineRequestSchema.safeParse(req);
    expect(result.success).toBe(true);
  });

  it('rejects empty refine message', () => {
    const req = {
      plan: samplePlan,
      message: '   ',
    };

    const result = refineRequestSchema.safeParse(req);
    expect(result.success).toBe(false);
  });
});
