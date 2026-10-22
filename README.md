# Celebrate AI 🎉
**GenAI-Powered Celebration & Event Planner for Weddings, Birthdays, and Community Gatherings**
   🔗 **Live demo:** https://celebrate-ai.ai.studio

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Gemini_API-Flash-orange.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-green.svg)](https://vitest.dev/)

---

## 📖 1. Problem Statement
Planning celebrations—whether a 300-guest Royal Indian wedding in Udaipur, an 18th milestone birthday in Mumbai, or a 500-attendee eco-friendly community mela in Bengaluru—is notoriously fragmented, stressful, and prone to budget overruns. Hosts struggle with:
1. **Unrealistic & Vague Budgeting**: Generic planners fail to balance Indian market catering, decor, and photography costs to the exact rupee.
2. **Missing Vendor Due Diligence**: Hosts rarely know what critical questions to ask vendors (sound decibel curfews, power backup generators, cancellation clauses).
3. **Disconnected Timeline Roadmaps**: Milestone countdowns often lack actionable, day-to-day deliverables.
4. **Generic Invitations**: Creating tailored stationery drafts for WhatsApp, formal cards, and casual groups takes hours.

**Celebrate AI** solves this with an intelligent, end-to-end celebration strategist powered by Google's Gemini Flash model, strict Zod schema validation, and elegant interactive UI tooling.

---

## ✨ 2. Core Features

### 📋 Precision Planner Form
- **Occasion Types**: Specialized blueprints for Weddings, Milestone Birthdays, and Community Galas/Festivals.
- **Smart INR Budgeting**: Real-time Indian Rupee (₹) formatting with Lakh/Crore notation (e.g. ₹15,00,000 / ₹15 Lakh) and quick allocation presets.
- **Pre-Built Blueprints**: Instant sample templates (Udaipur Royal Wedding, Cyberpunk Birthday, Bengaluru Artisan Mela).

### 🛡️ Strict JSON & Mathematical Budget Integrity
- **Zod Validated**: Gemini responses conform to strict schemas with zero hallucinations.
- **Mathematical Exactness**: Categories are normalized so the sum of category allocations equals **100% and the exact rupee budget**.

### 📑 6 Interactive Results Tabs
1. **Overview**: Executive dossier with celebration title, tagline, per-guest spend metrics, 48x48 color palette swatches with hex copy, and quick exports.
2. **Budget Math**: Interactive Recharts donut pie chart with hover isolation, category breakdown progress bars, and cost-saving tips.
3. **Timeline**: Milestone countdown trail (from 8–12 weeks before down to the Day-of-Event) with interactive deliverable task checklists.
4. **Vendor Sourcing**: Tick-able vendor checklist with due diligence interview questions, negotiation tips, and contract lock-in tracking.
5. **Ideas & Gastronomy**: Visual moodboard palette with copyable hex values, scenography focal points, chef-curated 3-course menus, signature cocktails/mocktails, interactive activities, and DJ playlists.
6. **Invitations**: Multi-format stationery suite (Formal card, Casual message, and WhatsApp-ready broadcast with emojis), 3 instant style templates (Classic, Modern, Minimal), and high-resolution PNG image download via `html-to-image`.

### 💬 In-Context Chat Refinement Assistant
- Conversational assistant maintaining the full event dossier context.
- Refines plans on the fly: *"Make it 15% cheaper"*, *"Add outdoor rain backup"*, *"Make food 100% vegetarian & Jain friendly"*, *"Add Sangeet choreography to timeline"*.
- Automatically recalculates budget math and updates live UI state.
- Keyboard accessible with Escape key dismiss.

### 📄 Document Export & Local Storage
- **PDF Dossier**: Client-side PDF generation using lazy-loaded `jsPDF` formatted with executive summaries, budget tables, timeline roadmaps, and stationery.
- **High-Res PNG Export**: Client-side invitation card rendering with `html-to-image`.
- **Local Storage Management**: Save, switch between, and manage multiple celebration plans with inline confirmation delete (sandbox-safe).

---

## 🏛️ 3. Architecture

```
celebrate-ai/
├── server.ts              # Fullstack Express entry point (Dev & Production)
├── server/
│   ├── gemini.ts          # Server-side Gemini caller with retry & responseSchema
│   └── routes.ts          # Express API routes (/api/plan/*, /api/health) with Helmet & CORS
├── src/
│   ├── types/
│   │   └── planner.ts     # Zod schemas & TypeScript types
│   ├── utils/
│   │   ├── budget.ts      # Budget normalization & INR currency formatting
│   │   ├── color.ts       # Hex normalization & palette validation
│   │   ├── jsonRepair.ts  # Fallback JSON parsing for LLM output
│   │   └── pdfExport.ts   # Lazy-loaded jsPDF document generator
│   ├── services/
│   │   ├── api.ts         # Frontend API client (no secrets exposed)
│   │   └── storage.ts     # LocalStorage plan manager
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── PlannerForm.tsx
│   │   ├── SkeletonPlanLoader.tsx
│   │   ├── ChatAssistant.tsx
│   │   ├── SavedPlansModal.tsx
│   │   ├── ColorSwatch.tsx
│   │   └── tabs/
│   │       ├── OverviewTab.tsx
│   │       ├── BudgetTab.tsx
│   │       ├── TimelineTab.tsx
│   │       ├── VendorsTab.tsx
│   │       ├── IdeasTab.tsx
│   │       └── InvitationTab.tsx
│   ├── App.tsx            # Main application shell with error recovery & Retry
│   ├── index.css          # Tailwind CSS v4 & theme variables
│   └── main.tsx           # React DOM root
└── tests/
    ├── budget.test.ts          # Vitest tests for budget sum & INR formatting
    ├── schema.test.ts          # Vitest tests for Zod validation
    ├── color.test.ts           # Vitest tests for hex normalization
    ├── jsonRepair.test.ts      # Vitest tests for JSON repair fallback
    ├── inputValidation.test.ts # Vitest tests for planner inputs
    └── apiRoutes.test.ts       # Vitest tests for API error diagnostics
```

---

## 🛠️ 4. Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4
- **Backend**: Node.js, Express 4, Helmet, CORS
- **GenAI**: Google GenAI SDK (`@google/genai`) with Gemini Flash
- **Validation**: Zod
- **Data Visualization**: Recharts
- **Export Tools**: jsPDF (lazy-loaded), html-to-image (lazy-loaded)
- **Testing**: Vitest
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Animation**: Motion (Framer Motion v12)

---

## 🚀 5. Setup & Installation

### Prerequisites
- Node.js >= 18.x
- npm >= 9.x
- Gemini API Key ([Google AI Studio](https://aistudio.google.com/))

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Abhinay2244/celebrate-ai-event-planner.git
   cd celebrate-ai-event-planner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Run in Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔐 6. Environment Variables & Security

| Variable | Description | Location |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key | Server-only (`process.env.GEMINI_API_KEY`) |
| `APP_URL` | Application base URL | Optional |
| `PORT` | Server listening port (default: 3000) | Server |

### Security Measures:
- **Zero Frontend Leakage**: The Gemini API key is strictly accessed on the backend inside `server/gemini.ts`. It is **never** bundled or transmitted to the client browser.
- **Input Validation & Sanitization**: All incoming requests are strictly validated with Zod schemas with character and value bounds.
- **Security Headers**: Uses `helmet` configured for safe sandbox/iframe integration (`X-Content-Type-Options: nosniff`, Referrer Policy, etc.).
- **Rate Limiting**: In-memory IP-based sliding window rate limiter prevents API abuse.
- **Error Shielding**: Errors returned to the client never expose internal stack traces or database internals.
- **XSS Prevention**: React's native JSX escaping is used everywhere; `dangerouslySetInnerHTML` is never used.

---

## ♿ 7. Accessibility (WCAG AA Compliance)

- **Semantic Landmarks**: Clear structural `<header>`, `<main>`, `<nav>`, and `<footer>` elements.
- **Heading Hierarchy**: Exactly one `<h1>` per view, followed by ordered `<h2>` and `<h3>` tags.
- **Form Inputs**: Every input and textarea has an associated `<label>` element with descriptive text.
- **Keyboard Navigation**:
  - Full tab traversal across all form controls, tab lists, and action buttons.
  - Modals and chat drawers support `Escape` key to close.
- **Live Regions**: `aria-live="polite"` on loaders and `aria-live="assertive"` on error alerts.
- **Touch Targets**: Minimum 44px tap targets for mobile usability.
- **Motion Sensitivity**: Respects `prefers-reduced-motion` to disable animations for sensitive users.
- **Color Contrast**: Compliant with WCAG AA guidelines in both light and dark modes.

---

## 🧪 8. Running Unit Tests

The test suite validates budget normalization, hex color normalization, Zod schema constraints, input bounds, and API diagnostics:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npx vitest
```

---

## 🤖 9. How GenAI Is Used

- **Model Selection**: Uses Gemini Flash, optimized for fast, accurate structured reasoning and cultural event nuances.
- **Server-Side Invocation**: All AI calls are dispatched via `@google/genai` on Node/Express with telemetry headers (`User-Agent: aistudio-build`).
- **Structured Schema Enforcement**: Uses `responseMimeType: "application/json"` and strict `responseSchema` to guarantee consistent formatting.
- **Fault-Tolerant Resilience**:
  - Max 1 retry with exponential backoff.
  - In-memory request caching for identical inputs.
  - `extractAndParseJSON` handles markdown wrappers and trailing commas.
  - `normalizeBudget` guarantees that category items sum to the exact rupee value of the total budget.

---

## ⚠️ 10. Known Limitations

- **Network Dependency**: Generating and refining event blueprints requires an active internet connection to communicate with Google's Gemini API.
- **Client-Side Export**: PDF and PNG exports are generated in the browser; very large plans or unusual browser extensions may occasionally affect canvas rasterization.
- **Local Storage Scope**: Saved celebration blueprints are stored in the user's browser `localStorage` and are not synced across multiple separate devices.

---

## 📄 11. License

This project is licensed under the Apache-2.0 License
