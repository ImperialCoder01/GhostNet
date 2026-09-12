# GhostNet AI — Hackathon Demonstration & Judging Playbook

---

## 1. 30-Second Elevator Pitch

> "Phishing, voice deepfakes, and social engineering scams have evolved far beyond static blocklists and simple spam filters. Users lose billions because current tools only output a generic score without explanation.
> 
> **GhostNet AI** is a multi-modal, explainable cybersecurity copilot. Whether it is an urgent SMS, a typosquatted URL, a malicious QR code, or an AI voice clone, GhostNet reconstructs the attacker's full 5-stage attack chain, explains the attacker's true intent, flags standard reason codes, and cross-references threats against a live cloud intelligence feed of 5,000+ malicious domains—with guaranteed 100% offline fallback resilience."

---

## 2. Recommended 2-Minute Judge Demo Order

| Time | Action | Page | Key Takeaway for Judges |
|---|---|---|---|
| **0:00 - 0:25** | **SMS Social Engineering** | `Message Scanner` | Paste urgent SBI KYC SMS. Show 5-Stage Threat Reconstruction and Attacker Intent. |
| **0:25 - 0:50** | **Domain and Typosquatting** | `Link Inspector` | Test `sbi-kyc-verification-portal.online`. Show brand mimicry detection and Sandbox. |
| **0:50 - 1:15** | **QR Camera and Threat Extraction** | `QR Code Inspector` | Open camera or click 1-Click QR benchmark. Show instant payload decode and risk scoring. |
| **1:15 - 1:40** | **Voice and Deepfake Call Detection** | `Voice & Audio Scam` | Click synthetic voice benchmark. Show acoustic Wiener entropy and linguistic analysis. |
| **1:40 - 2:00** | **Global Radar and Browser Shield** | `Global Threat Intelligence` / `Browser Shield` | Show live Supabase indicator feed, pre-click blocklist interceptor, and 40/40 test suite. |

---

## 3. Exact Demonstration Scenarios & Expected Outputs

### Scenario 1: SMS Banking Phishing & OTP Harvest
- **Input Text**:
  ```text
  URGENT: Your SBI account will be blocked today. Complete KYC immediately at https://example-suspicious-domain.com or your account will be suspended. Share the OTP to complete verification.
  ```
- **Where to Paste**: `Message Scanner` -> Text input area -> Click *"Inspect & Reconstruct Threat"*.
- **Expected Results**:
  - **Verdict**: `HIGH THREAT SCAM DETECTED` (Risk Score: `95-100 / 100`)
  - **Attacker Objective**: *"Harvest banking login credentials and intercept two-factor authentication (OTP) to drain bank funds."*
  - **Standard Reason Codes**: `URGENCY_LANGUAGE`, `IMPERSONATES_BRAND`, `REQUESTS_OTP`
  - **Attack Progression (5 Stages)**:
    1. *Unsolicited Contact* (Spoofed sender reachout)
    2. *Panic & Urgency Manipulation* (Threat of account closure)
    3. *Phishing Gateway* (Deceptive external link)
    4. *Credential Harvesting* (Extraction of confidential credentials)
    5. *Financial Loss* (Unauthorized transaction execution)
  - **Action Plan**: Emergency steps (Stop, Verify via 1930, Report, Secure).

---

### Scenario 2: Typosquatting & Malicious Domain Lookup
- **Input URL**:
  ```text
  https://sbi-kyc-verification-portal.online/login
  ```
- **Where to Paste**: `Link Inspector` -> URL input area -> Click *"Inspect Link Safety"*.
- **Expected Results**:
  - **Verdict**: `HIGH THREAT SCAM DETECTED` (Risk Score: `70-95 / 100`)
  - **Brand Mimicry**: `Detected` -> Impersonated Brand: *State Bank of India (SBI)* (Official: `sbi.co.in`)
  - **Domain Age**: `12 days (Newly Created)`
  - **Standard Reason Codes**: `IMPERSONATES_BRAND`, `LOOKALIKE_DOMAIN`
  - **Interactive Feature**: Click *"Launch Simulation"* to walk through a safe sandbox preview of what happens if a victim clicks.

---

### Scenario 3: QR Code Threat Inspection
- **Action**: Navigate to `QR Code Inspector`.
- **Option A (Real Camera)**: Click *"Live Camera"*, allow browser permissions, point at any QR code on screen or phone.
- **Option B (1-Click Benchmark)**: Click *"Phishing Banking Portal QR"* button.
- **Expected Results**:
  - Raw decoded payload: `https://sbi-kyc-verification-portal.online/login?token=urgent-freeze`
  - Instant recursive routing into domain analyzer with high-threat verdict.

---

### Scenario 4: Voice Deepfake & Social Engineering Call
- **Action**: Navigate to `Voice & Audio Scam`.
- **Option A (Live Recording)**: Click *"Start Recording"*, speak a sentence, click *"Stop Recording"* -> *"Analyze Audio"*.
- **Option B (1-Click Benchmark)**: Click *"Synthetic Bank KYC Scam Call"*.
- **Expected Results**:
  - **Acoustic Indicator**: `Suspicious synthetic-voice indicators detected` (Flatness: `< 0.12`) with harmonic vocoder compression note.
  - **Transcript**: Captured text displayed in monospace card.
  - **Linguistic Analysis**: Combined risk score factoring acoustic anomalies and social engineering triggers.

---

## 4. Offline & Low-Connectivity Backup Plan

If hotel/conference Wi-Fi drops or API quotas are exhausted:
1. **GhostNet is 100% Offline-Resilient**: The client and server include an integrated deterministic heuristic engine (`src/lib/scanner.js`).
2. **Instant Local Execution**: Every scan will instantly return calibrated risk scores, attack chains, and reason codes (`source: offline-heuristic`) in under 5 milliseconds.
3. **No Login Requirement**: Judges can click *"⚡ Explore as Guest / Judge Demo Mode"* on the login screen to bypass any authentication hurdles instantly.

---

## 5. Browser Extension & Pre-Click Interception

### Interactive Demo in App
1. Open `Browser Shield & Ext` page.
2. In the *"Interactive Pre-Click Interception Sandbox"*, type `sbi-kyc-verification-portal.online`.
3. Click *"Trigger Pre-Click Intercept"*: Shows the exact warning interstitial rendered before network requests reach dangerous servers.

### Manual Chrome Extension Installation (Optional)
1. Open `chrome://extensions` in Google Chrome.
2. Toggle **Developer mode** (top right).
3. Click **Load unpacked** and select the `/extension` directory from this repository.
4. The GhostNet shield icon appears in the toolbar with live badge monitoring.

---

## 6. Judge FAQs & Technical Evidence

### Q: "How is this different from a simple ChatGPT prompt wrapper?"
- **Answer**: 
  - Dual-engine architecture: Fast deterministic heuristic regex engine + neural AI pipeline.
  - Threat Reconstruction™: Maps 5-stage attack progressions with severity scoring.
  - Live Supabase Threat Intelligence: Queries 5,000+ synchronized URLhaus and OpenPhish domains before calling any LLM.
  - Audio Wiener Entropy: Fast Fourier Transform (`fft.js`) spectral flatness analysis directly on raw audio waveforms.

### Q: "How do you prevent AI hallucinations?"
- **Answer**:
  - Rigid JSON schema enforcement with `safeParseVerdict()`.
  - Whitelist filter against 10 canonical reason codes (`src/lib/reasonCodes.js`). Any hallucinated reason codes returned by the LLM are discarded.

### Q: "How is user privacy protected?"
- **Answer**:
  - Stateless processing: Message contents are evaluated in ephemeral memory and never sold.
  - Row-Level Security: PostgreSQL RLS partitioned by cryptographic user IDs.

---

## 7. Required Production Configuration Matrix

| Variable | Target Scope | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | Server-Only | Multimodal deep threat inference |
| `SUPABASE_URL` | Server-Only | Database connection for REST endpoints |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Batch threat feed synchronization and upserts |
| `SUPABASE_ANON_KEY` | Server-Only | Least-privilege threat reads |
| `CRON_SECRET` | Server-Only | Authentication for scheduled cron feed sync |
| `VITE_SUPABASE_URL` | Client & Server | Frontend Supabase endpoint |
| `VITE_SUPABASE_ANON_KEY` | Client & Server | Frontend public queries & auth |
| `ENABLE_VOICE_SCANNER` | Server-Only | Toggle voice detection endpoint (`true`/`false`) |
| `ENABLE_PRE_CLICK_INTERCEPTOR` | Server-Only | Toggle blocklist-lite feed (`true`/`false`) |

---

## 8. Quality Assurance Summary

```bash
# Automated Tests (40 / 40 Passing)
$ npm test
ℹ tests 40 | suites 15 | pass 40 | fail 0

# ESLint (0 errors)
$ npm run lint

# TypeScript Typecheck (0 errors)
$ npm run typecheck

# Vite Production Build (Compiled in <5s)
$ npm run build
```