# Celebrate AI 🎉
**GenAI-Powered Celebration & Event Planner for Weddings, Birthdays, and Community Gatherings**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Gemini_API-3.8_Flash-orange.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-green.svg)](https://vitest.dev/)

---

## 📖 1. Problem Statement
Planning celebrations—whether a 300-guest Royal Indian wedding in Udaipur, an 18th milestone birthday in Mumbai, or a 500-attendee eco-friendly community mela in Bengaluru—is notoriously fragmented, stressful, and prone to budget overruns. Hosts struggle with:
1. **Unrealistic & Vague Budgeting**: Generic planners fail to balance Indian market catering, decor, and photography costs to the exact rupee.
2. **Missing Vendor Due Diligence**: Hosts rarely know what critical questions to ask vendors (sound decibel curfews, power backup generators, cancellation clauses).
3. **Disconnected Timeline Roadmaps**: Milestone countdowns often lack actionable, day-to-day deliverables.
4. **Generic Invitations**: Creating tailored stationery drafts for WhatsApp, formal cards, and casual groups takes hours.

**Celebrate AI** solves this with an intelligent, end-to-end celebration strategist powered by Google's Gemini 3.8 Flash, strict Zod schema validation, and elegant interactive UI tooling.

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
1. **Overview**: Executive dossier with celebration title, tagline, per-guest spend metrics, color palette swatches, and quick exports.
2. **Budget Math**: Interactive Recharts donut pie chart with hover isolation, category breakdown progress bars, and cost-saving tips.
3. **Timeline**: Milestone countdown trail (from 8–12 weeks before down to the Day-of-Event) with interactive deliverable task checklists.
4. **Vendor Sourcing**: Tick-able vendor checklist with due diligence interview questions, negotiation tips, and contract lock-in tracking.
5. **Ideas & Gastronomy**: Visual moodboard palette with copyable hex values, scenography focal points, chef-curated 3-course menus, signature cocktails/mocktails, interactive activities, and DJ playlists.
6. **Invitations**: Multi-format stationery suite (Formal card, Casual message, and WhatsApp-ready broadcast with emojis) with one-click copy and celebratory confetti feedback.

### 💬 In-Context Chat Refinement Assistant
- Conversational assistant maintaining the full event dossier context.
- Refines plans on the fly: *"Make it 15% cheaper"*, *"Add outdoor rain backup"*, *"Make food 100% vegetarian & Jain friendly"*, *"Add Sangeet choreography to timeline"*.
- Automatically recalculates budget math and updates live UI state.

### 📄 Document Export & Local Storage
- **PDF Dossier**: Client-side PDF generation using `jsPDF` formatted with executive summaries, budget tables, timeline roadmaps, and stationery.
- **Local Storage Management**: Save, switch between, and manage multiple celebration plans with zero third-party databases.

### 🎨 Premium Design & Accessibility
- Palette: Deep Indigo, Rose Gold accents, and Warm Ivory background.
- Fonts: Playfair Display for elegant headings, Inter for high-legibility body copy.
- Dark & Light mode toggle with smooth theme transitions.
- Fully accessible (WCAG AA contrast, keyboard navigation, semantic HTML, ARIA tabs and logs, `prefers-reduced-motion` compliance).

---

## 🏛️ 3. Architecture

```
celebrate-ai/
├── server.ts              # Fullstack Express entry point (Dev & Production)
├── server/
│   ├── gemini.ts          # Server-side Gemini 3.8 Flash caller with retry logic
│   └── routes.ts          # Express API routes (/api/plan/*) with rate limiter & caching
├── src/
│   ├── types/
│   │   └── planner.ts     # Zod schemas & TypeScript types
│   ├── utils/
│   │   ├── budget.ts      # Budget normalization & INR currency formatting
│   │   ├── jsonRepair.ts  # Fallback JSON parsing for LLM output
│   │   └── pdfExport.ts   # jsPDF document generator
│   ├── services/
│   │   ├── api.ts         # Frontend API client (no secrets exposed)
│   │   └── storage.ts     # LocalStorage plan manager
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── PlannerForm.tsx
│   │   ├── SkeletonPlanLoader.tsx
│   │   ├── ChatAssistant.tsx
│   │   ├── SavedPlansModal.tsx
│   │   └── tabs/
│   │       ├── OverviewTab.tsx
│   │       ├── BudgetTab.tsx
│   │       ├── TimelineTab.tsx
│   │       ├── VendorsTab.tsx
│   │       ├── IdeasTab.tsx
│   │       └── InvitationTab.tsx
│   ├── App.tsx            # Main application shell
│   ├── index.css          # Tailwind CSS v4 & theme variables
│   └── main.tsx           # React DOM root
└── tests/
    ├── budget.test.ts     # Vitest tests for budget sum & INR formatting
    ├── schema.test.ts     # Vitest tests for Zod validation
    └── jsonRepair.test.ts # Vitest tests for JSON repair fallback
```

---

## 🛠️ 4. Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4
- **Backend**: Node.js, Express 4
- **GenAI**: Google GenAI SDK (`@google/genai`) with `gemini-3.8-flash`
- **Validation**: Zod
- **Data Visualization**: Recharts
- **PDF Generation**: jsPDF
- **Testing**: Vitest
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti

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
   GEMINI_API_KEY="AIzaSy..."
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

## 🔐 6. Environment Variables

| Variable | Description | Location |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key | Server-only (`process.env.GEMINI_API_KEY`) |
| `APP_URL` | Application base URL | Optional |
| `PORT` | Server listening port (default: 3000) | Server |

> **Security Note**: The Gemini API key is strictly accessed on the backend inside `server/gemini.ts`. It is **never** bundled or transmitted to the client browser.

---

## 🧪 7. Running Unit Tests

The test suite validates budget normalization, Zod schema constraints, and JSON repair fallback:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npx vitest
```

---

## 🤖 8. How GenAI Is Used

- **Model Selection**: Uses `gemini-3.8-flash`, optimized for fast, accurate structured reasoning and multilingual/cultural knowledge.
- **Server-Side Invocation**: All AI calls are dispatched via `@google/genai` on Node/Express with telemetry headers (`User-Agent: aistudio-build`).
- **Structured Schema Enforced**: Instructs the model using `responseMimeType: "application/json"`.
- **Fault-Tolerant Resilience**:
  - Implements exponential backoff retries.
  - In-memory request caching for identical inputs.
  - `extractAndParseJSON` handles markdown wrappers and trailing commas.
  - `normalizeBudget` guarantees that category items sum to the exact rupee value of the total budget.

---

## 🤝 9. Contribution Guidelines

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/NewFeature`)
3. Commit your Changes (`git commit -m 'Add some NewFeature'`)
4. Run Tests to ensure 100% pass rate (`npm test`)
5. Push to the Branch (`git push origin feature/NewFeature`)
6. Open a Pull Request

---

## 📄 10. License

This project is licensed under the Apache-2.0 License
