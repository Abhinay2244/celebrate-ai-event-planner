# Celebrate AI 🎉
**GenAI-Powered Celebration & Event Planner for Weddings, Birthdays, and Community Gatherings**

🔗 **Live Demo:** [https://celebrate-ai.ai.studio](https://celebrate-ai.ai.studio)  
📦 **GitHub Repository:** [https://github.com/Abhinay2244/celebrate-ai-event-planner.git](https://github.com/Abhinay2244/celebrate-ai-event-planner.git)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Gemini_API-Flash-orange.svg)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-green.svg)](https://vitest.dev/)
[![Security](https://img.shields.io/badge/Security-Hardened-success.svg)](SECURITY.md)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

---

## 📖 1. Problem Statement
Planning milestone celebrations—whether a 300-guest Royal Indian wedding in Udaipur, an 18th milestone birthday in Mumbai, or a 500-attendee eco-friendly community gala in Bengaluru—is notoriously fragmented, stressful, and prone to budget overruns. Hosts struggle with:
1. **Unrealistic & Vague Budgeting**: Generic planners fail to balance catering, decor, and photography to the exact rupee or reflect Indian market price points.
2. **Missing Vendor Due Diligence**: Hosts rarely know what critical questions to ask vendors (curfews, power backup generators, cancellation clauses, overtime fees).
3. **Disconnected Timeline Roadmaps**: Milestone countdowns often lack actionable, day-to-day deliverables and time-stamped run-of-show schedules.
4. **Generic Invitations**: Creating tailored stationery drafts for WhatsApp broadcasts, formal cards, and casual groups takes hours of manual copywriting.

**Celebrate AI** solves this with an intelligent, end-to-end celebration strategist powered by Google's Gemini Flash model, strict Zod schema validation, mathematical budget normalization, and an interactive, accessible UI.

---

## ✨ 2. Core Features

### 📋 Precision Planner Form
- **Occasion Types**: Specialized blueprints for Weddings, Milestone Birthdays, and Community Galas/Festivals.
- **Smart INR Budgeting**: Real-time Indian Rupee (₹) formatting with Lakh/Crore notation (e.g., ₹15,00,000 / ₹15 Lakh) and quick allocation presets.
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
- Keyboard accessible with Escape key dismiss and focus trapping.

### 📄 Document Export & Local Storage
- **PDF Dossier**: Client-side PDF generation using lazy-loaded `jsPDF` formatted with executive summaries, budget tables, timeline roadmaps, and stationery.
- **High-Res PNG Export**: Client-side invitation card rendering with `html-to-image`.
- **Local Storage Management**: Save, switch between, and manage multiple celebration plans with inline confirmation delete (sandbox-safe).

---

## 🏛️ 3. Architecture & Modular Folder Structure

Celebrate AI uses a clean, decoupled full-stack architecture:
- **Backend Service (`server.ts` & `server/`)**: Express 4 server hosting REST API endpoints under `/api/*`, protected by Helmet security headers, strict CORS origin filtering with 403 rejection, in-memory IP fixed-window rate limiting with periodic sweeping, Request ID correlation, and request body size caps. In development, Vite dev middleware is mounted directly on Express (`"dev": "tsx server.ts"`).
- **Controller & Middleware Layer (`server/controllers/`, `server/middleware/`)**: Modular architecture with dedicated controllers, Zod query validation, asynchronous route wrappers, and a centralized `finalErrorHandler` formatting consistent client responses.
- **GenAI Orchestration Layer (`server/gemini.ts`, `server/prompts.ts`, `server/schemas.ts`)**: Integrates `@google/genai` with Gemini Flash, enforcing structured JSON schemas, prompt injection delimiters (`<USER_EVENT_DATA>`), and non-printable control character sanitization (`sanitizeModelText`).
- **Data Normalization Layer (`server/planNormalizer.ts`, `server/planCache.ts`)**: In-memory LRU caching, response categorization reconciliation, rounded numbers, categorized vendors, and exact budget sum balance.
- **Frontend SPA (`src/`)**: React 19 single-page app styled with Tailwind CSS v4, organized into dedicated presentational components, composed custom hooks, and centralized constants.

```
celebrate-ai/
├── LICENSE                         # Apache-2.0 License
├── SECURITY.md                     # Security policies, key handling, and validation
├── README.md                       # Documentation, architecture, and guides
├── server.ts                       # Fullstack Express entry point (Dev & Production)
├── server/
│   ├── controllers/
│   │   └── planController.ts       # Health check, plan generation, and refinement controllers
│   ├── middleware/
│   │   ├── asyncHandler.ts         # Async Express error forwarding wrapper
│   │   ├── cors.ts                 # Strict CORS allowlist with 403 AppError rejection
│   │   ├── errorHandler.ts         # Centralized error handler & body parser validation
│   │   ├── rateLimiter.ts          # Fixed-window IP rate limiter with periodic cleanup
│   │   ├── requestId.ts            # Client regex validation and correlation ID generation
│   │   └── validateRequest.ts      # Zod route query schema and parameter bounds middleware
│   ├── types/
│   │   └── express.d.ts            # Express Request.id augmentation
│   ├── gemini.ts                   # Gemini SDK client initialization & execution
│   ├── prompts.ts                  # Prompt templates with injection boundary tags
│   ├── schemas.ts                  # Zod & GenAI structured JSON schemas
│   ├── sanitizer.ts                # Control character stripping & secret log redaction
│   ├── planCache.ts                # In-memory LRU plan cache with TTL
│   ├── planNormalizer.ts           # Plan validation and rupee budget math reconciliation
│   ├── routes.ts                   # Express API router mounting middleware and controllers
│   └── errors.ts                   # Server AppError class and HTTP error categorization
├── src/
│   ├── constants/
│   │   └── index.ts                # Centralized limits, keys, routes, palettes, presets
│   ├── types/
│   │   └── planner.ts              # Zod schemas, TypeScript types, and DTO contracts
│   ├── hooks/
│   │   ├── useEventPlan.ts         # Composite hook coordinating theme, plans, and actions
│   │   ├── useTheme.ts             # Theme mode toggling and document root synchronization
│   │   ├── useSavedPlans.ts        # LocalStorage plan persistence and CRUD operations
│   │   ├── usePlanGeneration.ts    # Plan generation API lifecycle and confetti triggers
│   │   ├── usePlannerForm.ts       # Form input states, preset fillers, validation
│   │   ├── useChatRefinement.ts    # Assistant messages, live updates, error state
│   │   └── useInvitationActions.ts # Stationery copy and PNG dynamic export
│   ├── utils/
│   │   ├── budget.ts               # Rupee math normalization & currency formatting
│   │   ├── color.ts                # Hex code normalization & palette validation
│   │   ├── errorHandler.ts         # User-facing client error normalization
│   │   ├── jsonRepair.ts           # Fallback JSON parsing for LLM output
│   │   ├── pdfExport.ts            # Client-side jsPDF document generator
│   │   └── pdfSections.ts          # PDF tables, roadmaps, and section builders
│   ├── services/
│   │   ├── api.ts                  # Frontend API client (no secrets exposed)
│   │   └── storage.ts              # LocalStorage plan manager with safe fallback
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation bar, brand logo, theme toggle
│   │   ├── PlannerForm.tsx         # Main celebration configuration orchestrator
│   │   ├── ChatAssistant.tsx       # Conversational refinement assistant drawer
│   │   ├── SavedPlansModal.tsx     # Modal managing saved celebration blueprints
│   │   ├── ColorSwatch.tsx         # Interactive color swatch with copy feedback
│   │   ├── SkeletonPlanLoader.tsx  # Animated skeleton loader during plan synthesis
│   │   ├── planner/                # Focused subcomponents for PlannerForm
│   │   ├── chat/                   # Focused subcomponents for ChatAssistant
│   │   ├── layout/                 # Layout landmarks (TabBar, HeroBanner, Footer)
│   │   ├── saved/                  # Saved plan cards with delete confirmation
│   │   ├── overview/               # Overview tab cards and atmosphere widgets
│   │   ├── budget/                 # Recharts donut chart and category breakdowns
│   │   ├── vendors/                # Due diligence cards and interview checklists
│   │   ├── ideas/                  # Scenography, menu, cocktail, and music sections
│   │   ├── invitation/             # Card templates (Classic, Modern, Minimal)
│   │   └── tabs/                   # 6 Root tab container views
│   ├── App.tsx                     # Top-level shell coordinating form & tab navigation
│   ├── index.css                   # Tailwind CSS v4 imports and theme variables
│   └── main.tsx                    # React DOM entry point
└── tests/
    ├── fixtures/
    │   └── samplePlan.ts           # Shared mock fixtures (rich and minimal plans)
    ├── setup.ts                    # Vitest environment setup, DOM cleanup, custom matchers
    ├── server/
    │   ├── gemini.test.ts          # Gemini SDK client mock & connection tests
    │   ├── planNormalizer.test.ts  # Normalization rules & budget reconciliation
    │   └── sanitizer.test.ts       # Control character stripping & log redaction
    ├── services/
    │   ├── api.test.ts             # API client timeouts, retry logic, error handling
    │   └── storage.test.ts         # LocalStorage CRUD, quota handling, safety
    ├── utils/
    │   ├── errorHandler.test.ts    # Friendly error messaging and retry flags
    │   └── pdfExport.test.ts       # jsPDF export test for rich and sparse plans
    ├── components/
    │   ├── PlannerForm.test.tsx    # Form validation & submission tests
    │   ├── Tabs.test.tsx           # Full render tests for all 6 tabs
    │   ├── ChatAssistant.test.tsx  # Refinement interaction and user reply tests
    │   └── SavedPlansModal.test.tsx# Modal open/close, switching, delete checks
    ├── budget.test.ts              # Rupee rounding, zero guests, crore scaling
    ├── color.test.ts               # Hex normalization & shorthand expansion
    ├── jsonRepair.test.ts          # Truncated JSON recovery & markdown stripping
    ├── inputValidation.test.ts     # Boundary limits and string validation
    ├── schema.test.ts              # Zod schema validation
    ├── apiRoutes.test.ts           # Status code mapping and diagnostics
    └── server.test.ts              # Supertest integration tests (headers, CORS, 429)
```

---

## 💻 4. NPM Scripts Reference

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `tsx server.ts` | Start full-stack development server on port 3000 with Vite middleware |
| `npm run build` | `vite build` | Compile optimized production client assets into `dist/` |
| `npm run start` | `tsx server.ts` | Run production server serving static assets and API routes |
| `npm test` | `vitest run` | Execute all Vitest unit, component, API, and accessibility tests |
| `npm run test:coverage`| `vitest run --coverage` | Generate code coverage metrics via v8 provider |
| `npm run typecheck` | `tsc --noEmit` | Run strict TypeScript compiler verification |
| `npm run lint` | `tsc --noEmit` | Validate type correctness, syntax, and import integrity |
| `npm run format` | `prettier --write ...` | Format all TypeScript and TSX source files |
| `npm run format:check`| `prettier --check ...` | Check code formatting compliance with Prettier |
| `npm run clean` | `rm -rf dist server.js`| Remove build artifacts and temporary outputs |

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

## 🧪 6. Testing & Quality Verification

Celebrate AI features a comprehensive automated test suite consisting of **21 test files and 143 automated tests** spanning accessibility audits, keyboard navigation, React Testing Library component tests, Supertest fullstack API tests, and edge-case math/sanitization tests.

### Running Tests
```bash
# Run all 143 Vitest unit, component, accessibility, and integration tests
npm test

# Run code coverage report with v8 (aiming for >= 80% on core code)
npm run test:coverage

# Run TypeScript strict type verification
npm run typecheck

# Run linter verification
npm run lint

# Check code formatting with Prettier
npm run format:check
```

---

## 🔐 7. Security Architecture

Detailed documentation is available in [SECURITY.md](SECURITY.md). Key security mechanisms include:

- **Server-Side Key Isolation**: `GEMINI_API_KEY` is loaded strictly on the server (`process.env.GEMINI_API_KEY`) and is never transmitted or bundled into client code.
- **Log Redaction**: `sanitizeLogData()` scrubs API keys (`AIza...`), Authorization Bearer headers, passwords, and sensitive keys from server output. Full raw prompt payloads are never logged.
- **Rate Limiting**: Sliding-window in-memory limiter restricts clients to **30 requests per minute** per IP on `/api/plan/*` routes, returning HTTP 429 when exceeded.
- **Request Body Capping**: Express JSON body size is limited to `250kb`, protecting against denial-of-service memory exhaustion.
- **Input Validation**: All route bodies, query parameters, and URL parameters are validated against strict Zod schemas with character length bounds.
- **Control Character Stripping**: `sanitizeModelText()` strips non-printable control characters (`[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]`) from all model inputs.
- **Prompt Injection Defense**: Untrusted user inputs are wrapped in structured XML delimiters (`<USER_EVENT_DATA>`, `<USER_REFINEMENT_REQUEST>`) accompanied by security directives instructing the model to treat content strictly as raw data.
- **HTTP Security Headers**: `helmet` applies `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and DNS prefetch controls, while setting `frameguard: false` for AI Studio preview container compatibility.
- **CORS Allowlist**: Strict origin checking permits trusted local and cloud domains while rejecting untrusted cross-origin requests.
- **Error Shielding**: Generic error responses with unique correlation IDs (`X-Request-Id`) prevent stack trace and system leakage.
- **Vulnerability-Free**: `npm audit` reports **0 vulnerabilities**.

---

## ♿ 8. Accessibility (WCAG AA Compliance)

- **Semantic Landmarks**: Clear structural `<header>`, `<main id="main">` with `aria-busy` indicator during generation, `<nav>`, and `<footer>` elements, plus a top-level skip-to-content link (`href="#main"`).
- **Monotonic Heading Hierarchy**: Strict progression (`<h1>` $\rightarrow$ `<h2>` $\rightarrow$ `<h3>`) across all views without skipping levels.
- **Form Accessibility**: Every input and textarea includes an explicit visible `<label htmlFor="...">`, linked error messages via `aria-describedby`, and dynamic `aria-invalid` state.
- **Full Keyboard Navigation**:
  - **Tabs**: Arrow key navigation (`ArrowRight`, `ArrowLeft`), `Home`, and `End` support with proper `tabIndex` management (`0` on active tab, `-1` on others).
  - **Modals & Drawers**: Focus traps keep focus inside `SavedPlansModal` and `ChatAssistant` during `Tab`/`Shift+Tab`, `Escape` key dismissal, and focus restoration to the trigger element on close.
  - **Radiogroups & Checklists**: Accessible `role="radiogroup"` / `role="radio"` switchers and `role="checkbox"` checklists with live `aria-checked` states.
- **Screen Reader Text Alternatives**: Recharts budget donut chart includes a descriptive `aria-label` summary and an accessible screen-reader data table (`<table className="sr-only">`).
- **Live Regions**: Polite live regions for chat message logs and skeleton loaders; assertive alerts for errors.
- **Touch Targets**: Minimum 44px tap targets (`min-h-[44px] min-w-[44px]`) across interactive buttons, chips, and controls.
- **Motion Sensitivity**: Respects `prefers-reduced-motion: reduce` in CSS and canvas confetti animations.
- **Contrast Ratios**: Verified $\ge$ 4.5:1 for body copy and $\ge$ 3:1 for graphical controls in both light and dark modes.

---

## ⚠️ 9. Known Limitations

- **Network Dependency**: Generating and refining event blueprints requires an active internet connection to communicate with Google's Gemini API.
- **Client-Side Export**: PDF and PNG exports are generated in the browser; very large plans or unusual browser extensions may occasionally affect canvas rasterization.
- **Local Storage Scope**: Saved celebration blueprints are stored in the user's browser `localStorage` and are not synced across multiple separate devices.

---

## 📄 10. License

This project is licensed under the [Apache-2.0 License](LICENSE).
