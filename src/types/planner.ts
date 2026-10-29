import { z } from 'zod';

export type EventType = 'wedding' | 'birthday' | 'community';

export type TabId = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas' | 'invitation';

export const plannerInputSchema = z.object({
  eventType: z.enum(['wedding', 'birthday', 'community']),
  title: z.string().trim().max(100).optional(),
  date: z.string().min(1, 'Date is required'),
  city: z.string().trim().min(2, 'City is required').max(100),
  guestCount: z
    .number()
    .int()
    .min(5, 'Guest count must be at least 5')
    .max(50000, 'Guest count max is 50,000'),
  totalBudget: z
    .number()
    .min(5000, 'Budget must be at least ₹5,000')
    .max(100000000, 'Budget max is ₹10 Crore'),
  theme: z.string().trim().min(2, 'Theme or vibe is required').max(200),
  specialNotes: z.string().trim().max(1000).optional().default(''),
});

export type PlannerInput = z.infer<typeof plannerInputSchema>;

export const budgetItemSchema = z.object({
  category: z.string().min(1),
  amount: z.number().nonnegative(),
  percentage: z.number().min(0).max(100),
  description: z.string(),
  tips: z.string().optional(),
});

export type BudgetItem = z.infer<typeof budgetItemSchema>;

export const timelineMilestoneSchema = z.object({
  timeframe: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  tasks: z.array(z.string()),
});

export type TimelineMilestone = z.infer<typeof timelineMilestoneSchema>;

export const vendorChecklistItemSchema = z.object({
  id: z.string(),
  category: z.string(),
  vendorType: z.string(),
  whatToAsk: z.array(z.string()),
  tips: z.string(),
  estimatedCost: z.number().optional(),
  done: z.boolean().default(false),
});

export type VendorChecklistItem = z.infer<typeof vendorChecklistItemSchema>;

export const paletteColorSchema = z.object({
  name: z.string().default('Accent'),
  hex: z.string(),
});

export type PaletteColor = z.infer<typeof paletteColorSchema>;

export const personalizedIdeasSchema = z.object({
  theme: z.object({
    name: z.string(),
    description: z.string(),
    colorPalette: z.array(
      z.union([
        z.object({
          name: z.string().optional().default('Accent'),
          hex: z.string(),
        }),
        z.string().transform((val) => ({
          name: val.startsWith('#') ? 'Accent' : val,
          hex: val,
        })),
      ])
    ),
  }),
  decor: z.object({
    concept: z.string(),
    focalPoints: z.array(z.string()),
    diyTips: z.array(z.string()),
  }),
  menu: z.object({
    cuisineStyle: z.string(),
    signatureCourses: z.array(
      z.object({
        course: z.string(),
        items: z.array(z.string()),
      })
    ),
    beverages: z.array(z.string()),
  }),
  activities: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      bestTiming: z.string(),
    })
  ),
  music: z.object({
    vibe: z.string(),
    recommendedGenres: z.array(z.string()),
    samplePlaylistsOrArtists: z.array(z.string()),
  }),
});

export type PersonalizedIdeas = z.infer<typeof personalizedIdeasSchema>;

export const invitationTextSchema = z.object({
  formal: z.string(),
  casual: z.string(),
  whatsapp: z.string(),
});

export type InvitationText = z.infer<typeof invitationTextSchema>;

export const eventPlanSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  input: plannerInputSchema,
  summary: z.object({
    title: z.string(),
    tagline: z.string(),
    vibeSummary: z.string(),
    budgetSummary: z.string(),
    guestSummary: z.string(),
  }),
  budgetBreakdown: z.array(budgetItemSchema),
  totalBudgetCalculated: z.number(),
  timeline: z.array(timelineMilestoneSchema),
  vendorChecklist: z.array(vendorChecklistItemSchema),
  personalizedIdeas: personalizedIdeasSchema,
  invitationText: invitationTextSchema,
});

export type EventPlan = z.infer<typeof eventPlanSchema>;

export const refineRequestSchema = z.object({
  plan: eventPlanSchema,
  message: z.string().trim().min(2, 'Message must be at least 2 characters').max(1000),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      })
    )
    .max(30)
    .optional()
    .default([]),
});

export type RefineRequest = z.infer<typeof refineRequestSchema>;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  appliedChanges?: boolean;
}
