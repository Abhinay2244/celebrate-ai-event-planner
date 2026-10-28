# Celebrate AI 🎉
**GenAI-Powered Celebration & Event Planner for Weddings, Birthdays, and Community Gatherings**
🔗 **Live demo:** https://celebrate-ai.ai.studio

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Gemini_API-Flash-orange.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-green.svg)](https://vitest.dev/)
[![Prettier](https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg)](https://prettier.io/)

---

## 📖 1. Problem Statement
Planning celebrations—whether a 300-guest Royal Indian wedding in Udaipur, an 18th milestone birthday in Mumbai, or a 500-attendee eco-friendly community mela in Bengaluru—is notoriously fragmented, stressful, and prone to budget overruns. Hosts struggle with:
1. **Unrealistic & Vague Budgeting**: Generic planners fail to balance Indian market catering, decor, and photography costs to the exact rupee.
2. **Missing Vendor Due Diligence**: Hosts rarely know what critical questions to ask vendors (sound decibel curfews, power backup generators, cancellation clauses).
3. **Disconnected Timeline Roadmaps**: Milestone countdowns often lack actionable, day-to-day deliverables.
4. **Generic Invitations**: Creating tailored stationery drafts for WhatsApp, formal cards, and casual groups takes hours.

**Celebrate AI** solves this with an intelligent, end-to-end celebration strategist powered by Google's Gemini Flash model, strict Zod schema validation, mathematical budget normalization, and elegant interactive UI tooling.

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

## 🏛️ 3. Architecture & Modular Folder Structure

```
celebrate-ai/
├── server.ts                       # Fullstack Express entry point (Dev & Production)
├── server/
│   ├── gemini.ts                   # Gemini client initialization & plan execution (<150 lines)
│   ├── schemas.ts                  # Compact structured JSON schemas for GenAI responses
│   ├── prompts.ts                  # Prompt generation helpers for planner & chat refinement
│   ├── planNormalizer.ts           # Server-side plan sanitization and budget/vendor normalization
│   ├── routes.ts                   # Express API routes (/api/plan/*, /api/health) with Helmet & CORS
│   └── errors.ts                   # Server-side AppError class and error categorizer
├── src/
│   ├── constants/
│   │   └── index.ts                # Centralized limits, keys, routes, palettes, and presets
│   ├── types/
│   │   └── planner.ts              # Zod schemas, TypeScript contracts, and DTO types
│   ├── hooks/
│   │   ├── useEventPlan.ts         # Active plan lifecycle, saved storage syncing, and tab state
│   │   ├── usePlannerForm.ts       # Form input states, preset fillers, and validation
│   │   ├── useChatRefinement.ts    # Chat message exchange, loading, and plan updates
│   │   └── useInvitationActions.ts # Stationery copy and dynamic PNG image export
│   ├── utils/
│   │   ├── budget.ts               # Budget normalization & INR currency formatting
│   │   ├── color.ts                # Hex normalization & palette validation
│   │   ├── errorHandler.ts         # Normalized client-side error handling
│   │   ├── jsonRepair.ts           # Fallback JSON parsing for LLM output
│   │   ├── pdfExport.ts            # Lazy-loaded jsPDF document generator orchestrator
│   │   └── pdfSections.ts          # PDF page layouts, tables, and section builders
│   ├── services/
│   │   ├── api.ts                  # Frontend API client (no secrets exposed)
│   │   └── storage.ts              # LocalStorage plan manager with safe fallback
│   ├── components/
│   │   ├── Navbar.tsx              # Top bar with logo, theme toggle, and saved plans trigger
│   │   ├── PlannerForm.tsx         # Main celebration configuration orchestrator
│   │   ├── ChatAssistant.tsx       # Floating conversational refinement assistant
│   │   ├── SavedPlansModal.tsx     # Modal managing saved celebration blueprints
│   │   ├── ColorSwatch.tsx         # Interactive color swatch with copy feedback
│   │   ├── SkeletonPlanLoader.tsx  # Animated skeleton loader during plan generation
│   │   ├── planner/                # Focused subcomponents for PlannerForm
│   │   │   ├── CuratedPresetsBanner.tsx
│   │   │   ├── EventTypeSelector.tsx
│   │   │   ├── BudgetSelector.tsx
│   │   │   ├── KeyDetailsInputs.tsx
│   │   │   ├── CityDestinationInput.tsx
│   │   │   └── GuestCountInput.tsx
│   │   ├── chat/                   # Subcomponents for ChatAssistant
│   │   │   ├── ChatMessageList.tsx
│   │   │   ├── ChatQuickPrompts.tsx
│   │   │   └── ChatInputForm.tsx
│   │   ├── layout/                 # Layout landmarks & structural components
│   │   │   ├── ErrorAlert.tsx
│   │   │   ├── TabBar.tsx
│   │   │   ├── PlanHeroBanner.tsx
│   │   │   └── AppFooter.tsx
│   │   ├── saved/
│   │   │   └── SavedPlanCard.tsx   # Individual blueprint card with delete confirmation
│   │   ├── overview/
│   │   │   ├── HeroDossierCard.tsx
│   │   │   ├── SnapshotCards.tsx
│   │   │   └── AtmosphereSection.tsx
│   │   ├── budget/
│   │   │   └── BudgetCategoryItem.tsx
│   │   ├── vendors/
│   │   │   └── VendorCardItem.tsx
│   │   ├── ideas/
│   │   │   ├── ThemeDecorSection.tsx
│   │   │   ├── MenuSection.tsx
│   │   │   └── EntertainmentSection.tsx
│   │   ├── invitation/
│   │   │   ├── InvitationOrnaments.tsx
│   │   │   ├── InvitationToolbar.tsx
│   │   │   ├── RawTextDrawer.tsx
│   │   │   ├── ClassicCard.tsx
│   │   │   ├── WeddingInvitationCard.tsx
│   │   │   ├── BirthdayInvitationCard.tsx
│   │   │   ├── CommunityInvitationCard.tsx
│   │   │   ├── ModernCard.tsx
│   │   │   └── MinimalCard.tsx
│   │   └── tabs/
│   │       ├── OverviewTab.tsx
│   │       ├── BudgetTab.tsx
│   │       ├── TimelineTab.tsx
│   │       ├── VendorsTab.tsx
│   │       ├── IdeasTab.tsx
│   │       └── InvitationTab.tsx
│   ├── App.tsx                     # Top-level shell coordinating form & tab navigation
│   ├── index.css                   # Tailwind CSS v4 imports and theme definitions
│   └── main.tsx                    # React DOM entry point
└── tests/
    ├── fixtures/
    │   └── samplePlan.ts           # Centralized mock fixtures (rich and minimal plans, inputs, refine requests)
    ├── setup.ts                    # Vitest environment setup, DOM cleanup, matchMedia/canvas-confetti mocks
    ├── budget.test.ts              # Vitest tests for budget rounding, zero guests, huge budgets, fallback allocations
    ├── color.test.ts               # Vitest tests for hex normalization, shorthand colors, invalid formats
    ├── jsonRepair.test.ts          # Vitest tests for JSON repair, truncated JSON, markdown stripping
    ├── inputValidation.test.ts     # Vitest tests for planner inputs and boundary limits
    ├── schema.test.ts              # Vitest tests for Zod schema validation
    ├── apiRoutes.test.ts           # Vitest tests for API error diagnostics and status code mapping
    ├── server.test.ts              # Supertest integration tests for Express API (/api/plan, /api/plan/refine, 400, 429)
    ├── server/
    │   ├── gemini.test.ts          # Gemini SDK client mock, connection testing, plan generation and refinement
    │   └── planNormalizer.test.ts  # Normalization rules, vendor categorization, budget math reconciliation
    ├── services/
    │   ├── api.test.ts             # Client API service unit tests (timeouts, retry logic, abort controllers)
    │   └── storage.test.ts         # Browser localStorage CRUD, quota handling, corrupted state resilience
    ├── utils/
    │   ├── errorHandler.test.ts    # Client error normalization, friendly messaging, retry flags
    │   └── pdfExport.test.ts       # jsPDF dossier generator test with full and minimal plans
    └── components/
        ├── PlannerForm.test.tsx    # React Testing Library form input validation & submission tests
        ├── Tabs.test.tsx           # Full render & missing optional fields tests for all 6 tabs
        ├── ChatAssistant.test.tsx  # Interactive conversational refinement and user reply rendering
        └── SavedPlansModal.test.tsx # Modal state, plan switching, empty state, and delete confirmations
```

---

## 📐 4. Code Quality & Architectural Conventions

The codebase adheres to strict engineering principles:

1. **Size Limits & Modularity**:
   - Every file is under **200 lines**.
   - Every React component is under **150 lines**.
   - UI sections and repeated logic are extracted into dedicated child components and custom React hooks (`src/hooks/`).

2. **TypeScript Strictness**:
   - `"strict": true` enabled in `tsconfig.json`.
   - **Zero `any` types**: Fully typed domain models and Zod inferred contracts.
   - **Zero non-null assertions (`!`)**: Explicit guard statements and null checks.

3. **Centralized Constants**:
   - All magic numbers and strings (e.g., storage keys, input bounds, network timeouts, API endpoints, accent colors) are consolidated in `src/constants/index.ts`.

4. **Unified Error Handling**:
   - **Server**: Handled via `AppError` and `toAppError()` (`server/errors.ts`), normalizing network drops, 429 quota exhaustion, timeouts, and validation failures without exposing stack traces.
   - **Client**: Normalized via `normalizeClientError()` (`src/utils/errorHandler.ts`), transforming network anomalies and HTTP errors into clear user-friendly error banners with actionable Retry controls.

5. **Code Style & Formatting**:
   - Prettier configured in `.prettierrc` (single quotes, 2 spaces, trailing commas).
   - `.editorconfig` enforcing consistent UTF-8 encoding and LF line endings.
   - Standard JSDoc annotations across all exported functions, hooks, and components.

---

## 🛠️ 5. Tech Stack

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

## 🚀 6. Setup & Installation

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

## 🔐 7. Environment Variables & Security

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

## ♿ 8. Accessibility (WCAG AA Compliance)

- **Semantic Landmarks**: Clear structural `<header>`, `<main id="main">` with `aria-busy` indicator during generation, `<nav>`, and `<footer>` elements, plus a top-level skip-to-content link (`href="#main"`).
- **Heading Hierarchy**: Strict monotonic heading progression (`<h1>` -> `<h2>` -> `<h3>`) across all views without skipping heading levels.
- **Form Field Accessibility**:
  - Every input and textarea has an explicit visible `<label htmlFor="...">`.
  - Error messages linked directly via `aria-describedby="[field]-error"`.
  - Dynamic `aria-invalid` state applied when validation criteria are unsatisfied.
- **Full Keyboard Navigation**:
  - **Tabs**: Full arrow key navigation (`ArrowRight`, `ArrowLeft`), `Home`, and `End` support with proper `tabIndex` management (`0` on active tab, `-1` on others).
  - **Modals & Drawers**: Focus trap trapping focus inside `SavedPlansModal` and `ChatAssistant` during `Tab` and `Shift+Tab`, `Escape` key dismissal, and automatic focus restoration to the trigger element upon closing.
  - **Radiogroups**: `EventTypeSelector` and `InvitationToolbar` switchers feature `role="radiogroup"` / `role="radio"` with arrow-key switching.
  - **Checklists**: Deliverable milestone tasks and vendor cards feature `role="checkbox"` and live `aria-checked` status toggles.
  - **Color Swatches**: Clickable swatches support keyboard activation, visible focus rings, and screen-reader copy announcements.
- **Screen Reader Text Alternatives**:
  - Recharts budget donut chart includes a descriptive `aria-label` summary and an accessible screen-reader data table (`<table className="sr-only">`).
  - Color swatches include screen-reader-only live feedback on clipboard copy.
- **Live Regions & Progress**: `aria-live="polite"` on chat message logs and skeleton loaders, `aria-live="assertive"` on error alerts, and `aria-busy` during plan synthesis.
- **Touch Targets**: Minimum 44px tap targets (`min-h-[44px] min-w-[44px]`) across all interactive buttons, chips, and switches.
- **Motion Sensitivity & Responsive Zoom**:
  - Full `prefers-reduced-motion: reduce` support in CSS and canvas confetti animations.
  - Verified at 200% zoom and 360px viewport width without horizontal scrollbars or clipped content.
- **Color Contrast**: Compliant with WCAG AA guidelines (4.5:1 text, 3:1 graphical elements) in both light and dark themes.

---

## 🧪 9. Quality Verification & Testing

Celebrate AI features an automated test suite comprising **20 test files and 133 automated tests** spanning vitest-axe accessibility audits, keyboard navigation, React Testing Library UI component tests, Supertest fullstack API tests, edge-case math/sanitization tests, and Gemini SDK mock tests.

### Test Commands

```bash
# Run all 133 Vitest unit, component, accessibility, and integration tests
npm test

# Run code coverage report with v8 (aiming for >= 80% on core code)
npm run test:coverage

# Run TypeScript strict type verification
npm run typecheck

# Run ESLint validation
npm run lint

# Check code formatting with Prettier
npm run format:check

# Auto-format all files
npm run format

# Production build verification
npm run build
```

### Test Suites Overview

1. **React UI Component Tests (`tests/components/`)**:
   - `PlannerForm.test.tsx`: Validates form interactions, required fields, guest count and budget boundary checks, custom inputs, and submission triggers.
   - `Tabs.test.tsx`: Validates rendering and resilience across all 6 tabs (`OverviewTab`, `BudgetTab`, `TimelineTab`, `VendorsTab`, `IdeasTab`, `InvitationTab`) under both complete rich mock data and minimal plans with missing optional fields.
   - `ChatAssistant.test.tsx`: Tests opening the chat drawer, typing and sending a refinement prompt, loading indicator presence, and receiving/rendering assistant responses with plan updates.
   - `SavedPlansModal.test.tsx`: Tests modal open/close, list rendering, active plan switching, empty state, and delete confirmation dialogs.

2. **Fullstack Supertest Server Tests (`tests/server.test.ts` & `tests/server/`)**:
   - `POST /api/plan` & `/api/plan/generate`: Validates 200 responses with normalized plans for valid inputs.
   - Input validation (400): Catches missing required fields, out-of-range budgets, and invalid types.
   - Sliding window rate limiting (429): Asserts rate limit trigger upon exceeding quota within window.
   - Gemini API failure shielding: Asserts friendly error messages and appropriate HTTP error statuses (401, 404, 429, 503) without leaking internal stacks.
   - Gemini SDK client tests (`gemini.test.ts`): Thoroughly mocks `@google/genai` to guarantee tests never make live network calls or consume API quotas.

3. **Edge-Case Utilities & Resilience Tests (`tests/`)**:
   - `budget.test.ts`: Rounding reconciliation down to the exact rupee, 0 guests per-person fallbacks, 10-crore budget scaling, and fallback percentage distributions.
   - `color.test.ts`: Hex normalization, 3-digit shorthand expansion (`#abc` to `#aabbcc`), missing `#` prefix, leading/trailing whitespace, and fallback index wrap-around.
   - `jsonRepair.test.ts`: Markdown stripping (` ```json `), trailing comma repair, unclosed strings and brackets truncation recovery, and fallback objects.

4. **Services & Document Export Tests**:
   - `services/api.test.ts`: Tests network timeout simulation, automatic retry logic, AbortControllers, and error parsing.
   - `services/storage.test.ts`: Tests localStorage quota handling, corrupt JSON safety, CRUD lifecycle, and plan deduplication.
   - `utils/pdfExport.test.ts`: Tests full client-side jsPDF dossier generation for rich and sparse event plans.

### Code Coverage Metrics

The codebase maintains **>80% test coverage** across all core business logic folders:

| Directory | Scope | Statements | Branches | Functions | Lines |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `server/` | Express routes, Gemini client, normalizer, errors | **93.1%** | **75.0%** | **88.9%** | **94.4%** |
| `src/services/` | API client & localStorage persistence | **86.4%** | **62.5%** | **84.6%** | **87.7%** |
| `src/utils/` | Budget math, color, error handling, JSON repair, PDF | **90.5%** | **75.7%** | **92.9%** | **90.6%** |
| **All Monitored Files** | **Total Project Core** | **90.4%** | **74.0%** | **89.7%** | **91.1%** |

Shared mock structures, realistic celebration plans, and edge-case inputs are centralized in `tests/fixtures/samplePlan.ts`.

---

## 🤖 10. How GenAI Is Used

- **Model Selection**: Uses Gemini Flash, optimized for fast, accurate structured reasoning and cultural event nuances.
- **Server-Side Invocation**: All AI calls are dispatched via `@google/genai` on Node/Express with telemetry headers (`User-Agent: aistudio-build`).
- **Structured Schema Enforcement**: Uses `responseMimeType: "application/json"` and strict `responseSchema` to guarantee consistent formatting.
- **Fault-Tolerant Resilience**:
  - Max 1 retry with exponential backoff.
  - In-memory request caching for identical inputs.
  - `extractAndParseJSON` handles markdown wrappers and trailing commas.
  - `normalizeBudget` guarantees that category items sum to the exact rupee value of the total budget.

---

## ⚠️ 11. Known Limitations

- **Network Dependency**: Generating and refining event blueprints requires an active internet connection to communicate with Google's Gemini API.
- **Client-Side Export**: PDF and PNG exports are generated in the browser; very large plans or unusual browser extensions may occasionally affect canvas rasterization.
- **Local Storage Scope**: Saved celebration blueprints are stored in the user's browser `localStorage` and are not synced across multiple separate devices.

---

## 📄 12. License

This project is licensed under the Apache-2.0 License.
