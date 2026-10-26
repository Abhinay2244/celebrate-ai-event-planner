import { Type } from '@google/genai';

/**
 * Strict, compact JSON response schema for Gemini generation.
 * Enforces structured event plan output with maximum speed and reliability.
 */
export const CELEBRATION_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        tagline: { type: Type.STRING },
        vibeSummary: { type: Type.STRING },
        budgetSummary: { type: Type.STRING },
        guestSummary: { type: Type.STRING },
      },
      required: ['title', 'tagline', 'vibeSummary', 'budgetSummary', 'guestSummary'],
    },
    budgetBreakdown: {
      type: Type.ARRAY,
      description: 'Maximum 6 core categories summing to the total budget',
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          percentage: { type: Type.NUMBER },
          description: { type: Type.STRING },
          tips: { type: Type.STRING },
        },
        required: ['category', 'amount', 'percentage', 'description'],
      },
    },
    timeline: {
      type: Type.ARRAY,
      description: 'Maximum 6 milestone countdown phases',
      items: {
        type: Type.OBJECT,
        properties: {
          timeframe: { type: Type.STRING },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          tasks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: ['timeframe', 'title', 'description', 'tasks'],
      },
    },
    vendorChecklist: {
      type: Type.ARRAY,
      description: 'Maximum 5 priority vendor partners',
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING },
          vendorType: { type: Type.STRING },
          whatToAsk: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          tips: { type: Type.STRING },
          done: { type: Type.BOOLEAN },
        },
        required: ['category', 'vendorType', 'whatToAsk', 'tips'],
      },
    },
    personalizedIdeas: {
      type: Type.OBJECT,
      properties: {
        theme: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            colorPalette: {
              type: Type.ARRAY,
              description: '4 distinct palette colours for the celebration',
              items: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: 'Descriptive colour name e.g. Royal Indigo',
                  },
                  hex: {
                    type: Type.STRING,
                    description: '6-digit hex colour code starting with #',
                  },
                },
                required: ['name', 'hex'],
              },
            },
          },
          required: ['name', 'description', 'colorPalette'],
        },
        decor: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING },
            focalPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            diyTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['concept', 'focalPoints', 'diyTips'],
        },
        menu: {
          type: Type.OBJECT,
          properties: {
            cuisineStyle: { type: Type.STRING },
            signatureCourses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  course: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['course', 'items'],
              },
            },
            beverages: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['cuisineStyle', 'signatureCourses', 'beverages'],
        },
        activities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              bestTiming: { type: Type.STRING },
            },
            required: ['title', 'description', 'bestTiming'],
          },
        },
        music: {
          type: Type.OBJECT,
          properties: {
            vibe: { type: Type.STRING },
            recommendedGenres: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            samplePlaylistsOrArtists: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['vibe', 'recommendedGenres', 'samplePlaylistsOrArtists'],
        },
      },
      required: ['theme', 'decor', 'menu', 'activities', 'music'],
    },
    invitationText: {
      type: Type.OBJECT,
      properties: {
        formal: { type: Type.STRING },
        casual: { type: Type.STRING },
        whatsapp: { type: Type.STRING },
      },
      required: ['formal', 'casual', 'whatsapp'],
    },
  },
  required: [
    'summary',
    'budgetBreakdown',
    'timeline',
    'vendorChecklist',
    'personalizedIdeas',
    'invitationText',
  ],
};

/**
 * Schema for chat refinement response containing text message and updated plan.
 */
export const REFINE_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reply: { type: Type.STRING },
    updatedPlan: CELEBRATION_PLAN_SCHEMA,
  },
  required: ['reply', 'updatedPlan'],
};
