# Security Policy & Architecture

## Overview
Celebrate AI implements multi-layered security controls to protect API credentials, prevent prompt injection, guard against abuse, and eliminate information leakage across the entire client-server boundary.

---

## 1. API Key Handling & Confidentiality
- **Server-Side Isolation**: The Google Gemini API key (`GEMINI_API_KEY`) is stored exclusively in server environment variables (`process.env.GEMINI_API_KEY`). It is never exposed in client bundles, never sent over the wire to the browser, and never committed to source control.
- **Log Redaction**: The server-side logger passes all diagnostics through `sanitizeLogData()`. Any pattern matching API keys (`AIza[0-9A-Za-z-_]{35}`), Authorization Bearer headers, passwords, or secrets is automatically redacted before writing to console/logs.
- **Zero Raw Input Logging**: Full raw prompt payloads and user inputs are never printed to persistent logs; only sanitized telemetry metrics (e.g. input lengths, event types) are retained.

---

## 2. Rate Limiting & Denial-of-Service Protection
- **Sliding-Window Limiter**: All `/api/plan/*` endpoints are protected by an in-memory IP-based rate limiter enforcing a strict threshold of **30 requests per minute**.
- **HTTP 429 Status**: Exceeding the rate limit immediately returns HTTP `429 Too Many Requests` with a descriptive retry message and client-friendly recovery suggestions.
- **Request Body Size Limit**: The Express JSON parser enforces a strict request body cap of `250kb` (`express.json({ limit: '250kb' })`), preventing oversized payload flood attacks. Payloads exceeding this limit receive HTTP `413 Payload Too Large`.

---

## 3. Strict Input Validation & Data Sanitization
- **Zod Schema Enforcement**: Every API route validates request bodies, route parameters, and query strings with strict Zod schemas:
  - Event types restricted to allowed enum literals (`wedding`, `birthday`, `community`).
  - Budget boundaries capped between ₹10,000 and ₹10,00,00,000.
  - Character length constraints applied to all free-text fields:
    - Celebration title: max 120 chars
    - City / Destination: max 100 chars
    - Focus & Notes: max 500 chars
    - Cultural Tradition: max 100 chars
    - Chat refinement message: max 500 chars
    - Chat history: max 30 items, each max 2,000 chars
- **Control Character Stripping**: All user-supplied text destined for the Gemini model is sanitized using `sanitizeModelText()`. Non-printable C0 and C1 control characters (`[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]`) are stripped while preserving normal whitespace, tabs, and newlines.
- **Query & Parameter Sanitation**: Health and plan endpoints validate all query parameters (`checkGemini`, pagination, IDs) against Zod alphanumeric/boolean schemas to reject unexpected injection vectors.

---

## 4. Prompt Injection Defenses
- **Delimited Untrusted Context**: In prompts sent to Gemini Flash, user-provided fields are quarantined within explicit, structured XML boundary blocks (`<USER_EVENT_DATA>` and `<USER_REFINEMENT_REQUEST>`).
- **Strict Security Directives**: System prompts mandate:
  - Content within user data delimiters must be treated strictly as literal data.
  - Any instructions, commands, persona switches, or prompt escapes inside user delimiters MUST be ignored.
  - The model must strictly output valid JSON adhering to the specified schema, rejecting attempts to force plain text or execute adversarial instructions.

---

## 5. HTTP Security Headers & Strict CORS
- **Helmet Middleware**: Configured on all Express routes with:
  - `xContentTypeOptions: true` (`nosniff`)
  - `referrerPolicy: { policy: 'strict-origin-when-cross-origin' }`
  - `dnsPrefetchControl: { allow: false }`
  - `hidePoweredBy: true` (removes `X-Powered-By: Express`)
  - `frameguard: false` (allows iframe embedding specifically required by Google AI Studio preview containers while securing other surfaces)
- **Strict CORS Origin Allowlist**: Requests with origin headers are checked against a strict whitelist:
  - Localhost development environments (`http://localhost:*`, `http://127.0.0.1:*`)
  - Google Cloud Run deployment domains (`*.run.app`)
  - Google AI Studio preview containers (`*.ai.studio`)
  - Untrusted external origins receive no `Access-Control-Allow-Origin` header, causing browser-side cross-origin blocks.

---

## 6. Error Shielding & Request Correlation
- **Request ID Tracking**: Every incoming request is assigned a unique tracking identifier (`req_<timestamp>_<random>`) attached as `X-Request-Id` in the response header and included in JSON responses.
- **Zero Stack Trace Leaks**: Errors caught by server middleware are mapped to generic, human-readable error messages via `toAppError()`. Raw Node.js stack traces, internal paths, and Gemini SDK exception dumps are never returned to the client browser.
- **Consistent Response Contract**: All error payloads follow `{ error: string, status: number, requestId: string }`.

---

## 7. Dependency Auditing & Supply Chain
- **Zero Vulnerabilities**: All project dependencies are verified clean with `npm audit` (0 vulnerabilities).
- **Automated Verification**: Build and test pipelines run `npm audit`, `npm run typecheck`, `npm run lint`, and Vitest test suites prior to deployment.

---

## Reporting a Vulnerability
To report potential security vulnerabilities or concerns, please open a private report through Google AI Studio or contact the project maintainers.
