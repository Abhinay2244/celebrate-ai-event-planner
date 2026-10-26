import { EventPlan, PlannerInput, RefineRequest } from '../../src/types/planner';

/**
 * Standard complete sample plan fixture for unit and component testing.
 */
export const SAMPLE_EVENT_PLAN: EventPlan = {
  id: 'plan-test-123',
  createdAt: '2026-10-24T10:00:00.000Z',
  updatedAt: '2026-10-24T10:00:00.000Z',
  input: {
    eventType: 'wedding',
    title: 'Diya & Kabir Grand Wedding',
    date: '2026-11-20',
    city: 'Udaipur',
    guestCount: 250,
    totalBudget: 2500000,
    theme: 'Royal Rajputana Heritage & Marigold Splendor',
    specialNotes: 'Require vegetarian Rajasthani thali options and folk music',
  },
  summary: {
    title: 'Diya & Kabir Grand Royal Wedding',
    tagline: 'An unforgettable regal celebration under starlit palaces',
    vibeSummary: 'Opulent, heritage-steeped, and celebratory',
    budgetSummary: '₹25,00,000 allocated with emphasis on heritage palace venue and royal dining',
    guestSummary: '250 guests accommodated with personalized hospitality',
  },
  budgetBreakdown: [
    {
      category: 'Venue & Palace Rental',
      amount: 1000000,
      percentage: 40,
      description: 'Exclusive heritage courtyard and lawns',
      tips: 'Negotiate bundled lighting and stage power backup',
    },
    {
      category: 'Royal Catering & Beverages',
      amount: 750000,
      percentage: 30,
      description: 'Multi-course Rajasthani thali & welcome refreshments',
      tips: 'Opt for seasonal dessert counters to curb per-plate surcharges',
    },
    {
      category: 'Decor & Marigold Floral Scenography',
      amount: 375000,
      percentage: 15,
      description: 'Intricate floral mandap and traditional brass lanterns',
      tips: 'Reuse afternoon phoolon ki chadar flowers for dinner centerpieces',
    },
    {
      category: 'Photography & Cinematic Film',
      amount: 200000,
      percentage: 8,
      description: '2-day coverage with drone footage and candid moments',
      tips: 'Agree on edited highlight reel delivery deadline upfront',
    },
    {
      category: 'Music, Folk Troupes & Sound',
      amount: 125000,
      percentage: 5,
      description: 'Traditional Manganiyar folk singers & evening DJ setup',
      tips: 'Confirm 10 PM sound curfew permissions with the local municipality',
    },
    {
      category: 'Stationery & Favors',
      amount: 50000,
      percentage: 2,
      description: 'Handcrafted scroll invitations and artisanal sweets',
      tips: 'Send WhatsApp digital cards to out-of-town guests to reduce print runs',
    },
  ],
  totalBudgetCalculated: 2500000,
  timeline: [
    {
      timeframe: '8 Weeks Before',
      title: 'Foundation & Venue Lock-in',
      description: 'Confirm palace contracts and send save-the-dates',
      tasks: ['Sign venue contract', 'Send digital save-the-dates', 'Draft room allocations'],
    },
    {
      timeframe: '4 Weeks Before',
      title: 'Tastings & Couture Lock-in',
      description: 'Finalize menu spreads and outfit trials',
      tasks: ['Food trial with chef', 'Confirm guest dietary needs', 'Book transport coaches'],
    },
    {
      timeframe: 'Day-of Event',
      title: 'Celebration Day',
      description: 'Seamless execution from sunset vows to reception feast',
      tasks: ['Baraat assembly at 4:30 PM', 'Mandap rituals at 5:30 PM', 'Royal dinner at 8:00 PM'],
    },
  ],
  vendorChecklist: [
    {
      id: 'vendor-1',
      category: 'Catering',
      vendorType: 'Royal Heritage Caterers',
      whatToAsk: [
        'Do you provide live traditional roti counters?',
        'Can you accommodate strict Jain diets?',
      ],
      tips: 'Request live food tasting 3 weeks prior.',
      done: true,
    },
    {
      id: 'vendor-2',
      category: 'Photography',
      vendorType: 'Candid Moments Studio',
      whatToAsk: ['How many shooters are on ground?', 'Are drone permits handled?'],
      tips: 'Specify golden-hour family portrait shotlist.',
      done: false,
    },
  ],
  personalizedIdeas: {
    theme: {
      name: 'Royal Rajputana Gold',
      description: 'Rich sunset tones of saffron, deep indigo, marigold, and antique brass.',
      colorPalette: [
        { name: 'Royal Gold', hex: '#D4AF37' },
        { name: 'Deep Indigo', hex: '#1B1E4B' },
        { name: 'Marigold Orange', hex: '#FF8C00' },
        { name: 'Ivory Silk', hex: '#FAF5EE' },
      ],
    },
    decor: {
      concept: 'Heritage palace courtyard illuminated with brass diyas and suspended florals',
      focalPoints: ['Carved stone mandap arch', 'Floating lotus pond with candles'],
      diyTips: ['Place marigold petals in brass urli bowls at reception entry'],
    },
    menu: {
      cuisineStyle: 'Regal Mewari & Pan-Indian Fine Dining',
      signatureCourses: [
        {
          course: 'Royal Welcome Snacks',
          items: ['Mini Pyaaz Kachoris', 'Smoked Paneer Tikka with Mint Coulis'],
        },
        {
          course: 'Grand Thali Main Course',
          items: ['Gatte Ki Sabzi', 'Dal Baati Churma', 'Ker Sangri', 'Missi Roti'],
        },
      ],
      beverages: ['Rose Sharbat with Chia', 'Spiced Kesariya Chai'],
    },
    activities: [
      {
        title: 'Folk Chari Dance & Dhol Circle',
        description: 'Interactive folk dance performance inviting guests into the celebration.',
        bestTiming: 'During high tea before the Baraat',
      },
    ],
    music: {
      vibe: 'Soulful Rajasthani acoustic transitioning into celebratory beats',
      recommendedGenres: ['Mewari Folk', 'Sufi Fusion', 'Modern Bollywood'],
      samplePlaylistsOrArtists: ['Desert Symphony Ensemble', 'Manganiyar Troupe'],
    },
  },
  invitationText: {
    formal:
      'Together with their families, Diya & Kabir request the honour of your presence at their royal wedding ceremony in Udaipur.',
    casual:
      "We're tying the knot in Udaipur! Join Diya & Kabir for two days of laughter, music, and celebration.",
    whatsapp:
      '✨ Diya & Kabir are getting married! ✨\n📍 Grand Heritage Palace, Udaipur\n📅 Nov 20, 2026\nRSVP to join the celebration! 🥂',
  },
};

/**
 * Minimal plan fixture testing robustness against empty/missing non-essential properties.
 */
export const MINIMAL_EVENT_PLAN: EventPlan = {
  id: 'plan-minimal-456',
  createdAt: '2026-10-24T10:00:00.000Z',
  updatedAt: '2026-10-24T10:00:00.000Z',
  input: {
    eventType: 'birthday',
    date: '2026-12-05',
    city: 'Goa',
    guestCount: 20,
    totalBudget: 50000,
    theme: 'Beach Bonfire',
    specialNotes: '',
  },
  summary: {
    title: 'Beachside Birthday Bonfire',
    tagline: 'Casual evening celebration',
    vibeSummary: 'Relaxed and breezy',
    budgetSummary: '₹50,000 minimal budget',
    guestSummary: '20 close friends',
  },
  budgetBreakdown: [
    {
      category: 'Venue & Drinks',
      amount: 50000,
      percentage: 100,
      description: 'Beach shack rental and grill snacks',
    },
  ],
  totalBudgetCalculated: 50000,
  timeline: [],
  vendorChecklist: [],
  personalizedIdeas: {
    theme: {
      name: 'Sunset Minimal',
      description: 'Warm sandy vibes',
      colorPalette: [],
    },
    decor: {
      concept: 'Fairy lights and floor cushions',
      focalPoints: [],
      diyTips: [],
    },
    menu: {
      cuisineStyle: 'Coastal BBQ',
      signatureCourses: [],
      beverages: [],
    },
    activities: [],
    music: {
      vibe: 'Chill lo-fi beats',
      recommendedGenres: [],
      samplePlaylistsOrArtists: [],
    },
  },
  invitationText: {
    formal: 'You are invited to the birthday bonfire in Goa.',
    casual: 'Come chill at the beach for my birthday!',
    whatsapp: '🎉 Birthday Bonfire in Goa! Dec 5.',
  },
};

export const SAMPLE_PLANNER_INPUT: PlannerInput = {
  eventType: 'community',
  title: 'Artisan Crafts Mela',
  date: '2026-12-15',
  city: 'Bengaluru',
  guestCount: 600,
  totalBudget: 400000,
  theme: 'Eco-Friendly Heritage Fair',
  specialNotes: 'Zero single-use plastic requirement',
};

export const SAMPLE_REFINE_REQUEST: RefineRequest = {
  plan: SAMPLE_EVENT_PLAN,
  message: 'Please make the catering 100% organic and eco-friendly.',
  history: [],
};
