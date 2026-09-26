# Changelog

All notable changes to GhostNet AI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0-prod] - 2026-09-26 (Brave Shield & Legal Compliance Lock)

### Added
* **Unauthenticated Access to Public Policy Suite:** Updated `AuthGate.jsx` to allow visitors to view all legal and governance policy pages (`PrivacyPolicy`, `Terms`, `CookiePolicy`, `RefundPolicy`, `PrivacyCenter`, `BusinessModel`) directly before signing in.
* **India DPDP Act 2023 & Legal Suite:** Added comprehensive, legally binding policy pages: `PrivacyPolicy.jsx` (Data Fiduciary notice), `Terms.jsx` (Probabilistic AI threat rating disclaimers), `CookiePolicy.jsx` (Zero third-party tracking guarantee), and `RefundPolicy.jsx` (14-day enterprise money-back guarantee).
* **Accessible Cookie Consent Banner:** Added floating `CookieConsentBanner.jsx` with keyboard-accessible controls and explicit opt-in checkboxes on Sign Up (`AuthGate.jsx`) and Threat Reporting (`ReportScam.jsx`).
* **Native HTML5 2D Canvas `ConstellationField`:** Replaced `@designcodeio/threeui` WebGL iframe renderer with a pure 2D Canvas engine (`src/shaders/constellation-field/ConstellationField.jsx`), resolving Brave Shields blank white screen crashes and script blocking.

### Changed
* **Right-Side Hero Auth Box:** Redesigned `AuthGate.jsx` landing page with a 2-column hero layout placing the `Access GhostNet Workspace` login card prominently at the top right of the page.
* **Strict Login Credential Validation:** Enforced non-empty credential requirement (`email` + `password`), blocking empty submissions with clear warnings while maintaining 1-click **⚡ Judge Demo Mode**.
* **High-Contrast Theme Tokens:** Updated card backgrounds, feature badges, and button text across `BusinessModel.jsx`, `AuthGate.jsx`, and global inputs to use high-contrast CSS variable tokens (`var(--ghost-surface)`, `var(--ghost-text)`, `var(--ghost-text-dim)`).
* **Sidebar Scrollbar Clean Up:** Added `.no-scrollbar` utility to `<aside>` in `Layout.jsx` hiding thick visual scrollbar borders.

---

## [1.1.0-prod] - 2026-09-12 (Production Demo Lock)

### Added
* **Feature 1 — Explainable Risk Scoring:** 10 standardized reason codes (`URGENCY_SCARE_TACTICS`, `REQUEST_OTP_PASSWORD`, `PAYMENT_REDIRECT`, `SUSPICIOUS_DOMAIN`, `IMPERSONATION_BRAND`, `MALICIOUS_ATTACHMENT`, `UNSOLICITED_CONTACT`, `POOR_GRAMMAR_FORMAT`, `REWARD_BAIT`, `THREAT_BLACKMAIL`) with strict code-defense filtering against LLM hallucinations.
* **Feature 2 — Hardened Deterministic Heuristic Engine:** Offline regex and NLP scoring engine with `withTimeout(promise, 9000)` fail-safe protection for 100% offline uptime.
* **Feature 3 — Public Threat Feed Integration:** Automated sync script (`scripts/sync-threat-feeds.js`) and endpoint (`/api/cron/sync-feeds`) ingesting OpenPhish and URLhaus with SHA-256 domain hashing.
* **Feature 4 — Community Threat Intelligence Telemetry:** Real-time PostgreSQL database telemetry in `threat_indicators` with PostgREST atomic upserts (`on_conflict=indicator_hash`).
* **Feature 5 — Live QR Code Camera Scanner:** Real-time camera viewfinder using HTML5 `<video>` and `jsQR` canvas decoding with permission error handling and manual upload fallback.
* **Feature 6 — Voice & Deepfake Call Detector:** In-memory Fast Fourier Transform (`fft.js`) spectral flatness (Wiener entropy) paired with Groq Whisper-large-v3 transcription and HTTP 413 (>6MB) payload guards.
* **Feature 7 — Real-Time Chromium Browser Extension (MV3):** Manifest V3 extension featuring background tab monitoring, automated hash checks, and warning overlays.
* **Feature 8 — Pre-Click Interceptor & Sandbox:** Low-latency `/api/blocklist-lite` streaming API and zero-execution educational link sandbox.
* **Guest / Judge Demo Mode:** 1-click `⚡ Explore as Guest / Judge Demo Mode` button bypassing Supabase authentication for immediate hackathon evaluation.
* **40/40 Automated Quality Gates:** Comprehensive test suite in `tests/scanner.test.js` covering all 15 security and failover suites in <400ms.

### Changed
* Rebranded **Global Scam Heatmap** to **Global Threat Intelligence & Radar** across all pages, navigation drawers, quick action cards, and documentation.
* Optimized Vite production bundle splitting (`radix`, `icons`, `motion`, `data`, `charts`, `vendor`) keeping all chunks under 460kB.
* Configured Vercel cron schedule to once daily (`0 0 * * *`) for 100% compatibility with Vercel Hobby plan constraints.
* Updated edge security headers in `vercel.json` with `Permissions-Policy: camera=(self), microphone=(self), geolocation=()`.
* Separated Supabase read and write keys: read operations default safely to the public anonymous key, while threat ingestion requires `SUPABASE_SERVICE_ROLE_KEY`.

---

## [1.0.0-hackathon] - 2026-09-02

### Added
* **GhostNet Threat Reconstruction™ Engine:** Signature 5-stage interactive attack chain mapper (`Ingress` ➔ `Social Engineering` ➔ `Phishing Gateway` ➔ `Credential Harvesting` ➔ `Financial Loss`).
* **Multi-Modal Vision Inspection:** Google Gemini Vision OCR fallback pipeline with screenshot analysis for fake receipts, spoofed banking UIs, and QR code traps.
* **Sub-Second Groq LPU Integration:** Fast multi-model inference (`llama-3.3-70b-versatile`, `llama-3.1-8b-instant`) for real-time NLP and link classification.
* **"What Happens If I Click?" Threat Simulator:** Safe educational sandbox modal simulating phishing exploits without executing hostile code.
* **Benchmark Threat Library & Live Demo Toolbar:** Curated real-world test scenarios (Bank KYC, UPI Cashback, Customs Phishing, Electricity Cutoff, etc.) for 1-click presentation testing.
* **Family & Senior Safety Mode:** Dedicated high-contrast, enlarged touch target accessibility mode designed for elderly users.
* **Light & Dark Theme Engine:** Seamless instant theme switching with persistent local storage and CSS custom properties.
* **Operator Profile & Account Modal:** Real-time authenticated session viewer with instant data purge controls.
* **Cross-Platform Android Mobile:** Packaged via Capacitor 8.5 for native Android deployment.
