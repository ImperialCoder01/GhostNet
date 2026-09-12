# GhostNet AI Audit

**Repository:** `https://github.com/ImperialCoder01/GhostNet`  
**Audit Date:** September 12, 2026  
**Auditor:** Antigravity Autonomous Inspector  

---

## Build Status

- **npm test:** **PASS** (20/20 tests pass across 5 test suites; duration ~75ms)
- **npm run build:** **PASS** (Vite v6.4.2 builds in ~4.5s; all vendor chunks under 460 kB; zero warnings)
- **npm run lint:** **PASS** (ESLint completed with 0 errors and 0 warnings)
- **npm run typecheck:** **PASS** (`tsc -p ./jsconfig.json` completed with 0 errors)

---

## Feature Status

### Feature 1 — Explainable Risk Scoring with Reason Codes
- **State:** **Implemented**
- **Architecture & Implementation:**
  - Standard dictionary created in `src/lib/reasonCodes.js` with 10 fixed reason codes: `URGENCY_LANGUAGE`, `IMPERSONATES_BRAND`, `REQUESTS_OTP`, `LOOKALIKE_DOMAIN`, `PUNYCODE_DOMAIN`, `NEWLY_REGISTERED_DOMAIN`, `REQUESTS_PAYMENT`, `KNOWN_MALICIOUS_DOMAIN`, `SUSPICIOUS_ATTACHMENT_QR`, and `GENERIC_GREETING`.
  - Defensive extraction implemented in `safeParseVerdict()` inside `api/analyze.js` to strip markdown formatting, parse JSON defensively, and strictly filter out hallucinated codes.
  - Deterministic fallback inference implemented via `inferReasonCodes()` in `src/lib/scanner.js`.
  - UI component `src/components/scanner/FraudScoreDisplay.jsx` renders reason code chips with color-coded badges and icons.
  - Scanner pages pass `reasonCodes` down to the display.
  - Verified by 6 automated unit tests in `tests/scanner.test.js`.
- **Gaps / Incomplete Areas:**
  - Multi-modal vision results (Gemini/OpenAI) in `api/analyze.js` rely on fallback inference rather than explicit prompt extraction.

---

### Feature 2 — Hardened Offline / Local-Heuristic Fallback
- **State:** **Implemented**
- **Architecture & Implementation:**
  - Added `withTimeout(promise, ms)` in `api/analyze.js` wrapping AI calls with `AI_TIMEOUT_MS` (default 4000ms), falling back immediately to local heuristics on timeout or error.
  - Source tracking implemented across all verdict paths (`source: "groq" | "gemini" | "openai" | "offline-heuristic" | "community-threat-feed" | "public-feed:*"`).
  - UI component `src/components/scanner/SourceBadge.jsx` transparently badges verdict origin.
  - Extended regex patterns in `src/lib/scanner.js` for IP-literal URLs (`/^\d{1,3}(\.\d{1,3}){3}$/`), URL shorteners (`ow.ly`, `tiny.cc`, etc.), and urgent OTP/payment keywords.
  - Verified by 4 automated unit tests in `tests/scanner.test.js`.
- **Gaps / Incomplete Areas:**
  - In `src/lib/api.js`, production network failures throw an error instead of seamlessly evaluating `analyzeMessageContent` locally on the client.

---

### Feature 3 — Public Threat Feed Pre-Check (OpenPhish / URLhaus)
- **State:** **Partially implemented (Code complete, migration unapplied)**
- **Architecture & Implementation:**
  - Schema file `supabase/004-public-blocklist.sql` defines table `public_blocklist` with index on `domain_hash`.
  - Batch ingestion script `scripts/sync-threat-feeds.js` ingests feeds from OpenPhish and URLhaus, normalizes hostnames, hashes via SHA-256, and batch-upserts.
  - Scheduled cron endpoint `api/cron/sync-feeds.js` registered in `vercel.json` (`0 */6 * * *`).
  - Pre-check function `checkPublicBlocklist(domainHash)` wired into link inspection pipeline in `api/analyze.js`.
- **Broken Aspects / Gaps:**
  - **SQL Syntax Error:** `supabase/004-public-blocklist.sql` line 22 and line 24 contain doubled single quotes (`''service_role''` and `''Hashed domain...''`) which fail if executed as a standard PostgreSQL script.
  - `getSupabaseServiceClient()` requires `SUPABASE_SERVICE_ROLE_KEY` even for read-only SELECT queries that anonymous keys are authorized to execute.
  - Migration has not yet been executed on the production Supabase instance.

---

### Feature 4 — Community Threat Intelligence Feed
- **State:** **Partially implemented (Code complete, migration unapplied)**
- **Architecture & Implementation:**
  - Schema file `supabase/005-threat-indicators.sql` defines table `threat_indicators` with indexes on `indicator_hash` and `last_seen`.
  - Automated fire-and-forget upsert `recordThreatIndicator()` records scans with `fraud_score >= 60`.
  - Instant community pre-check `checkCommunityFeed(indicatorHash)` in `api/analyze.js`.
  - Client query `listThreatIndicatorStats()` in `src/lib/data.js` provides 7-day regional threat intelligence.
  - Wired into live total counter in `src/pages/ScamHeatmap.jsx`.
- **Broken Aspects / Gaps:**
  - **SQL Syntax Error:** `supabase/005-threat-indicators.sql` lines 7, 9, 27, 29 contain doubled single quotes (`CHECK (indicator_type IN (''message'', ''link'', ''screenshot''))`, `auth.role() = ''service_role''`), causing syntax errors on raw SQL execution.
  - **PostgREST Upsert Syntax Bug:** `supabaseFetchUpsert()` in `api/analyze.js` does not append `?on_conflict=indicator_hash` to the URL. PostgREST rejects repeat indicator inserts with HTTP 409 Conflict.
  - Migration has not yet been executed on the production Supabase instance.

---

### Feature 5 — QR Code Scanner & Inspector
- **State:** **Implemented**
- **Architecture & Implementation:**
  - Self-contained QR decoder in `src/components/QRScanner.jsx` using dynamic import of `jsqr`.
  - Dedicated full page in `src/pages/QRScannerPage.jsx` featuring 1-click test benchmarks (*Phishing Banking Portal QR*, *Fake UPI Payment QR*, *Legitimate Corporate QR*).
  - Integrated tab inside `src/pages/ScreenshotScanner.jsx`.
  - Navigation links in desktop sidebar, mobile drawer, and home page launchpad (`QuickActions.jsx`).
  - Decoded URLs route to URL intelligence; decoded text routes to smishing analysis.
- **Gaps / Incomplete Areas:**
  - Video stream camera scanning (`navigator.mediaDevices.getUserMedia({ video: true })`) is not wired; decoding is currently image-upload/drop-based.

---

### Feature 6 — Voice & Deepfake Call Scam Detector
- **State:** **Implemented**
- **Architecture & Implementation:**
  - Spectral Flatness Measure (SFM / Wiener entropy) calculation implemented in `src/lib/spectralFeatures.js` using `fft.js` (`finalScore = textRiskScore * 0.75 + acousticSignal * 25`).
  - Voice recording and upload component in `src/components/VoiceScanner.jsx` supporting `MediaRecorder`, audio playback, client-side AudioContext acoustic decoding, and permission-denied error handling.
  - Dedicated page in `src/pages/VoiceScanner.jsx`.
  - Serverless endpoint in `api/analyze-voice.js` utilizing Groq Whisper (`whisper-large-v3`) with offline heuristic fallback.
  - Local development middleware mounted in `vite.config.js`.
  - Verified by 3 automated unit tests in `tests/scanner.test.js`.
- **Gaps / Incomplete Areas:**
  - Vercel Serverless payload limits (4.5 MB body limit on Hobby tier) constrain long audio uploads sent as base64 JSON.

---

### Feature 7 — Real-Time Browser Extension (MV3)
- **State:** **Implemented**
- **Architecture & Implementation:**
  - Clean Manifest V3 extension in `extension/` isolated from the Vite bundler.
  - Background worker `extension/background.js` monitors top-level navigations via `webNavigation.onCommitted`, maintains a session scan cache, and alerts tabs on risk scores >= 70.
  - Content script `extension/content.js` injects an isolated Shadow DOM warning banner at the top of malicious pages.
  - Toolbar popup `extension/popup.html` & `extension/popup.js` allows ad-hoc text or URL scanning.
  - Frontend hub in `src/pages/BrowserShield.jsx` documents setup instructions.
- **Gaps / Incomplete Areas:**
  - Extension icon image files are missing in `extension/icons/`.
  - Unpacked extension must be manually loaded in Developer mode; not bundled as a packaged `.zip` or `.crx`.

---

### Feature 8 — Pre-Click Interceptor
- **State:** **Implemented**
- **Architecture & Implementation:**
  - API endpoint `api/blocklist-lite.js` serves high-confidence malicious domains in plain text format.
  - Dynamic rules configuration in `extension/background.js` translates blocklist domains into Chrome `declarativeNetRequest` redirection rules (capped at 4,500).
  - Warning page `extension/warning.html` intercepts traffic before network transmission with safe exit and bypass options.
  - Interactive Pre-Click Intercept Sandbox simulator built into `src/pages/BrowserShield.jsx`.
- **Gaps / Incomplete Areas:**
  - Pre-click interceptor relies on `public_blocklist` database population from Feature 3.

---

## Existing Regressions

1. **Client-Side Production Fail-Open vs Fail-Safe**:
   - In `src/lib/api.js` (lines 22–25), if `postAnalyze` fails in production (`import.meta.env.PROD`), it throws an uncaught error: `'Analysis service unavailable. Please try again.'`.
   - In development, it falls back to client-side heuristics (`analyzeMessageContent`). An offline user or mobile user experiencing server downtime receives a failure rather than immediate local protection.

2. **Cron Authentication Bypass Risk**:
   - In `api/cron/sync-feeds.js`, if `CRON_SECRET` is not set in environment variables, the auth check is bypassed entirely: `if (cronSecret) { ... }`. Anyone can send a request to trigger an expensive multi-batch synchronization job.

---

## Critical Bugs

1. **PostgREST UPSERT Query Parameter Omission**:
   - In `api/analyze.js` (`supabaseFetchUpsert`): PostgREST requires the `on_conflict` query string parameter when using `resolution=merge-duplicates` on custom unique keys (`indicator_hash`). Without `?on_conflict=indicator_hash`, PostgREST raises a 409 Conflict error on duplicate hashes.
2. **PostgreSQL Migration Escaped Quotes**:
   - In `supabase/004-public-blocklist.sql` and `supabase/005-threat-indicators.sql`, string literals are double-single-quoted (`''service_role''`, `''{}''::text[]`). These will error out if executed via standard Postgres CLI or the Supabase SQL Editor.
3. **Database Read Gate on Service Role Key**:
   - In `api/analyze.js`, `getSupabaseServiceClient()` returns `null` if `SUPABASE_SERVICE_ROLE_KEY` is missing. As a result, read-only pre-checks (`checkPublicBlocklist` and `checkCommunityFeed`) fail to execute, even though the database schema grants public read (`anon`) access via RLS.

---

## Security Issues

1. **Wildcard CORS Headers**:
   - `api/analyze.js`, `api/analyze-voice.js`, and `api/blocklist-lite.js` set `Access-Control-Allow-Origin: *`. While necessary for browser extension access, there is no Origin validation or rate limiting.
2. **Missing Rate Limiting**:
   - None of the serverless endpoints implement rate limiting or throttling. Malicious or abusive traffic can exhaust Groq and Gemini API quotas.
3. **Unchecked Cron Endpoint**:
   - `api/cron/sync-feeds.js` should return `401 Unauthorized` if `CRON_SECRET` is not configured, rather than executing unconditionally.

---

## Missing Environment Variables

| Variable | Location | Impact if Missing |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Server (`.env.local` / Vercel) | Disables automated indicator writes in `analyze.js` and disables threat feed sync |
| `CRON_SECRET` | Server (`.env.local` / Vercel) | Cron endpoint is unprotected |
| `GROQ_API_KEY` | Server | AI falls back to local heuristics; Whisper voice transcription unavailable |
| `GEMINI_API_KEY` | Server | Vision OCR falls back to local heuristic analysis |
| `AI_TIMEOUT_MS` | Server | Defaults to 4000ms (safe) |
| `ENABLE_PRE_CLICK_INTERCEPTOR` | Server | Defaults to false; disables `/api/blocklist-lite` |

---

## Missing Database Changes

1. **`public_blocklist` table**: Not yet applied to live Supabase database.
2. **`threat_indicators` table**: Not yet applied to live Supabase database.
3. **SQL quote syntax fixes**: Double-single quotes (`''`) must be replaced with single quotes (`'`) in both migration files before running.

---

## Missing Tests

1. **`api/analyze.js` End-to-End Tests**:
   - No unit tests for `withTimeout()` failure cases.
   - No unit tests for `safeParseVerdict()` with malformed or hallucinated AI responses.
   - No mock tests for `checkCommunityFeed()` and `checkPublicBlocklist()`.
2. **`api/analyze-voice.js` Tests**:
   - No tests verifying behavior when audio is invalid or when Whisper fails.
3. **`scripts/sync-threat-feeds.js` Tests**:
   - No unit tests for OpenPhish / URLhaus parsing logic and deduplication.
4. **Frontend Component Tests**:
   - No test runner (e.g. Vitest / React Testing Library) configured for testing React components (`QRScanner`, `VoiceScanner`, `FraudScoreDisplay`).

---

## Recommended Repair Order

1. **Database Script Fixes**: Fix SQL syntax in `supabase/004-public-blocklist.sql` and `supabase/005-threat-indicators.sql` so they can be executed cleanly in Supabase.
2. **PostgREST Upsert Fix**: Add `on_conflict` parameter handling to `supabaseFetchUpsert()` in `api/analyze.js`.
3. **Graceful Database Client Fallback**: Update `getSupabaseServiceClient()` in `api/analyze.js` to fall back to `VITE_SUPABASE_ANON_KEY` for read-only queries when `SUPABASE_SERVICE_ROLE_KEY` is not provided.
4. **Client-Side Production Resilience**: Update `src/lib/api.js` to fall back to `scanner.js` local heuristics on network failure even in production mode.
5. **Cron Security Hardening**: In `api/cron/sync-feeds.js`, require `CRON_SECRET` to be set; reject with 401 if missing.
6. **Apply Supabase Migrations**: Run the corrected migrations on the active Supabase project.

---

## Files Requiring Changes

- `supabase/004-public-blocklist.sql` (fix quote syntax)
- `supabase/005-threat-indicators.sql` (fix quote syntax)
- `api/analyze.js` (fix `supabaseFetchUpsert` on_conflict query and allow anon key read fallback)
- `api/cron/sync-feeds.js` (require `CRON_SECRET`)
- `src/lib/api.js` (enable client heuristic fallback on fetch failure in production)
- `tests/scanner.test.js` (add tests for `withTimeout` and `safeParseVerdict`)
- `extension/icons/` (add placeholder icon assets)