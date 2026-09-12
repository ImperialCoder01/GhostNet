# GhostNet AI — Final Production Demo Lock & Judging Checklist

This document is the authoritative quick-reference checklist for demonstrating GhostNet AI during hackathon judging.

---

## 1. Pre-Demo Setup (1 Minute Before Judging)
- [ ] Open the deployed application URL (or `http://localhost:5173`).
- [ ] If prompted by the security gate, click **"⚡ Explore as Guest / Judge Demo Mode"**.
- [ ] Ensure browser permissions allow Camera and Microphone on the deployed domain.
- [ ] Verify the header displays **"PRO DEFENSE"** and theme is set to Dark Mode (default).

---

## 2. Required Environment Variables

| Variable | Scope | Sensitivity | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | Server-Only | High | Primary Google Gemini deep multimodal analysis |
| `SUPABASE_URL` | Server-Only | Low | Supabase REST URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Critical | Batch threat feed synchronization & upserts |
| `SUPABASE_ANON_KEY` | Server-Only | Low | Read-only threat feed queries |
| `CRON_SECRET` | Server-Only | High | Bearer token for scheduled feed sync |
| `VITE_SUPABASE_URL` | Client Safe | Low | Client Supabase endpoint |
| `VITE_SUPABASE_ANON_KEY` | Client Safe | Low | Client public queries & auth |
| `ENABLE_VOICE_SCANNER` | Server-Only | Low | Voice scanner endpoint toggle (`true`/`false`) |
| `ENABLE_PRE_CLICK_INTERCEPTOR` | Server-Only | Low | Blocklist lite endpoint toggle (`true`/`false`) |

---

## 3. Deployment Verification
- [ ] Verify HTTP 200 on main index: `GET /`
- [ ] Verify `Permissions-Policy` header includes `camera=(self), microphone=(self)`.
- [ ] Verify `X-Content-Type-Options: nosniff` and `X-Frame-Options: SAMEORIGIN`.
- [ ] Verify `/api/blocklist-lite` serves plain-text threat domains when enabled.

---

## 4. Exact SMS Test Input & Procedure
- **Page**: Navigate to `Message Scanner`.
- **Paste this exact text**:
  ```text
  URGENT: Your SBI account will be blocked today. Complete KYC immediately at https://example-suspicious-domain.com or your account will be suspended. Share the OTP to complete verification.
  ```
- **Click**: *"Inspect & Reconstruct Threat"*.
- **Verify**:
  - Score: `100 / 100` (`HIGH THREAT SCAM DETECTED`).
  - Attacker Objective explains banking credential and OTP interception.
  - 5-Stage Attack Chain highlights *Unsolicited Contact* -> *Financial Loss*.
  - Reason Code Chips: `URGENCY_LANGUAGE`, `IMPERSONATES_BRAND`, `REQUESTS_OTP`.

---

## 5. Exact URL Test Input & Procedure
- **Page**: Navigate to `Link Inspector`.
- **Paste this exact URL**:
  ```text
  https://sbi-kyc-verification-portal.online/login
  ```
- **Click**: *"Inspect Link Safety"*.
- **Verify**:
  - Score: `70-95 / 100` (`HIGH THREAT SCAM DETECTED`).
  - Brand Mimicry flags *State Bank of India (SBI)* (official: `sbi.co.in`).
  - Reason Codes: `IMPERSONATES_BRAND`, `LOOKALIKE_DOMAIN`.
  - Click *"Launch Simulation"* to demonstrate the educational sandbox.

---

## 6. QR Test Procedure
- **Page**: Navigate to `QR Code Inspector`.
- **Option A (Physical Camera)**: Click *"Live Camera"*, allow browser permissions, point at any QR code on screen.
- **Option B (1-Click Benchmark)**: Click *"Phishing Banking Portal QR"*.
- **Verify**: Instant payload decode and recursive routing to threat analysis.

---

## 7. Voice Test Procedure
- **Page**: Navigate to `Voice & Audio Scam`.
- **Option A (Physical Mic)**: Click *"Start Recording"*, speak 5 seconds, click *"Stop Recording"* -> *"Analyze Audio"*.
- **Option B (1-Click Benchmark)**: Click *"Synthetic Bank KYC Scam Call"*.
- **Verify**:
  - Acoustic indicator renders *"Suspicious synthetic-voice indicators detected"* with Wiener entropy score.
  - Transcript renders and social engineering signals are scored.

---

## 8. Global Threat Intelligence Verification
- **Page**: Navigate to `Global Threat Intelligence`.
- **Verify**:
  - Total Syndicated Threats count displays live community & synced indicators.
  - Interactive city nodes (Bengaluru, Mumbai, Delhi, London, New York) render with surge velocity.

---

## 9. Browser Shield Verification
- **Page**: Navigate to `Browser Shield & Ext`.
- **Verify**:
  - Pre-Click Interception Sandbox renders.
  - Type `sbi-kyc-verification-portal.online` and click *"Trigger Pre-Click Intercept"* to show the warning interstitial.

---

## 10. Offline Fallback Test
- Disconnect Wi-Fi or turn off network adapter.
- Run a message scan or link scan in the UI.
- **Verify**: The UI immediately displays a full verdict card tagged with `source: offline-heuristic` in `< 5ms`.

---

## 11. Backup Plan: If Internet Fails
- The client-side deterministic heuristic engine is embedded directly in the frontend bundle.
- Continue the demo completely offline. Highlight to judges: *"GhostNet features zero-cloud reliance mode for air-gapped security."*

---

## 12. Backup Plan: If Camera Fails or Permission Denied
- Switch immediately to the **"Upload Image"** tab or click the **1-Click QR Benchmarks** (*"Phishing Banking Portal QR"*).
- Explaining to judges: *"GhostNet provides multi-modal ingest: physical optical sensors, uploaded evidence, and benchmark vectors."*

---

## 13. Backup Plan: If Microphone Fails
- Click the **1-Click Voice Benchmarks** (*"Synthetic Bank KYC Scam Call"* or *"Family Emergency Deepfake Call"*).
- The system will execute the exact same Fourier Transform acoustic analysis and transcript risk scoring.

---

## 14. Backup Plan: If Gemini AI API Throttles / Fails
- GhostNet's `withTimeout(8000)` circuit-breaker automatically routes to the internal heuristic engine without throwing errors.
- The UI never hangs or crashes.

---

## 15. Final Quality Gates Record
- Automated Tests: **40 / 40 passing** (`tests/scanner.test.js` across 15 test suites).
- Linter: **0 errors** (`eslint . --quiet`).
- Typecheck: **0 errors** (`tsc -p ./jsconfig.json`).
- Build: **Clean production build** (`vite build` in `< 5s`).
- Git Diff Check: **0 whitespace or check errors** (`git diff --check`).

---

## 16. Known Limitations
1. **Camera/Mic Permissions**: Controlled by the operating system / browser security model; permission prompts are expected on first use.
2. **First-Load OCR Latency**: Screenshot OCR downloads Tesseract web worker training data (~15MB) on first execution.
3. **Chrome Extension**: Requires manual loading in developer mode (`chrome://extensions`) on desktop browsers; interactive simulation sandbox is provided in-app for convenience.