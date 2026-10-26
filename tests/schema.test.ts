import { describe, it, expect } from 'vitest';
import { plannerInputSchema, eventPlanSchema } from '../src/types/planner';

describe('Zod Schema Validation', () => {
  it('validates correct planner input form data', () => {
    const validData = {
      eventType: 'wedding',
      title: 'Aarav & Maya Celestial Wedding',
      date: '2026-11-20',
      city: 'Udaipur',
      guestCount: 300,
      totalBudget: 2500000,
      theme: 'Royal Rajputana with Modern Candlelight Elegance',
      specialNotes: 'Pure vegetarian catering, sunset vows',
    };

    const parsed = plannerInputSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it('rejects invalid planner input with too low budget or missing city', () => {
    const invalidData = {
      eventType: 'wedding',
      date: '2026-11-20',
      city: '',
      guestCount: 3,
      totalBudget: 200,
      theme: '',
    };

    const parsed = plannerInputSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      expect(fieldErrors.city).toBeDefined();
      expect(fieldErrors.guestCount).toBeDefined();
      expect(fieldErrors.totalBudget).toBeDefined();
    }
  });

  it('validates a complete event plan schema structure', () => {
    const mockPlan = {
      id: 'plan-12345',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      input: {
        eventType: 'birthday',
        title: 'Samay 18th Milestone Soiree',
        date: '2026-12-15',
        city: 'Mumbai',
        guestCount: 75,
        totalBudget: 150000,
        theme: 'Cyberpunk Neon Glow',
        specialNotes: 'DJ with EDM and hiphop, mocktail bar',
      },
      summary: {
        title: 'Samay 18th Milestone Soiree',
        tagline: 'An electric night of music, neon aesthetics, and memorable celebrations',
        vibeSummary: 'High energy, youth-focused, visual grandeur',
        budgetSummary: '₹1.5 Lakh total with emphasis on sound and interactive mocktails',
        guestSummary: '75 close friends & family',
      },
      budgetBreakdown: [
        { category: 'Venue & Audio', amount: 60000, percentage: 40, description: 'Lounge booking' },
        {
          category: 'Food & Mocktails',
          amount: 45000,
          percentage: 30,
          description: 'Finger foods',
        },
        {
          category: 'Decor & Neon Lights',
          amount: 30000,
          percentage: 20,
          description: 'Neon signs',
        },
        { category: 'Photo & Favors', amount: 15000, percentage: 10, description: 'Polaroids' },
      ],
      totalBudgetCalculated: 150000,
      timeline: [
        {
          timeframe: '4 Weeks Before',
          title: 'Lock Venue & DJ',
          description: 'Confirm sound system and curfew rules',
          tasks: ['Visit lounge', 'Finalize DJ playlist', 'Pay advance'],
        },
      ],
      vendorChecklist: [
        {
          id: 'v-1',
          category: 'Music & Audio',
          vendorType: 'DJ & Sound Tech',
          whatToAsk: ['Do you have wireless mics?', 'Can we supply a custom Spotify playlist?'],
          tips: 'Ask for a test track 1 hour before doors open.',
          done: false,
        },
      ],
      personalizedIdeas: {
        theme: {
          name: 'Cyberpunk Neon Glow',
          description: 'Dark backdrop with radiant magenta, cyan, and gold neon',
          colorPalette: ['#0f172a', '#ec4899', '#06b6d4', '#eab308'],
        },
        decor: {
          concept: 'Futuristic lighting and metallic surfaces',
          focalPoints: ['Custom Neon Name Sign', 'LED illuminated photo wall'],
          diyTips: ['Glowstick wristbands for guests', 'UV reactive table runners'],
        },
        menu: {
          cuisineStyle: 'Modern Street Tapas & Sliders',
          signatureCourses: [
            {
              course: 'Tapas Bar',
              items: ['Crispy Lotus Stem in Sweet Chili', 'Truffle Mushroom Sliders'],
            },
          ],
          beverages: ['Electric Blue Lagoon', 'Smoked Guava Chili Cooler'],
        },
        activities: [
          {
            title: 'Neon Polaroid Guestbook',
            description: 'Guests take neon snaps and write messages with fluorescent gel pens',
            bestTiming: 'During welcome drinks',
          },
        ],
        music: {
          vibe: 'Modern EDM & Deep House build-up',
          recommendedGenres: ['Deep House', 'Afrobeat', 'Nu-Disco'],
          samplePlaylistsOrArtists: ['Disclosure', 'Peggy Gou', 'Lost Frequencies'],
        },
      },
      invitationText: {
        formal: 'Join us to celebrate Samay’s 18th Birthday.',
        casual: 'Get ready for an electric night! Celebrate Samay turning 18 with us.',
        whatsapp:
          '✨ You are invited to Samay’s 18th Neon Birthday Soiree! 📅 Dec 15 | 📍 Mumbai. RSVP now!',
      },
    };

    const parsed = eventPlanSchema.safeParse(mockPlan);
    expect(parsed.success).toBe(true);
  });
});
