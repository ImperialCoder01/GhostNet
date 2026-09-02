# Changelog

All notable changes to GhostNet AI are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0-hackathon] - 2026-09-02

### Added
* **GhostNet Threat Reconstruction™ Engine:** Signature 5-stage interactive attack chain mapper (`Ingress` ➔ `Social Engineering` ➔ `Phishing Gateway` ➔ `Credential Harvesting` ➔ `Financial Loss`).
* **Multi-Modal Vision Inspection:** Google Gemini Vision OCR fallback pipeline with screenshot analysis for fake receipts, spoofed banking UIs, and QR code traps.
* **Sub-Second Groq LPU Integration:** Fast multi-model inference (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`) for real-time NLP and link classification.
* **"What Happens If I Click?" Threat Simulator:** Safe educational sandbox modal simulating phishing exploits without executing hostile code.
* **Benchmark Threat Library & Live Demo Toolbar:** 8 curated real-world test scenarios (Bank KYC, UPI Cashback, Customs Phishing, Electricity Cutoff, etc.) for 1-click presentation testing.
* **Family & Senior Safety Mode:** Dedicated high-contrast, enlarged touch target accessibility mode designed for elderly users.
* **Light & Dark Theme Engine:** Seamless instant theme switching with persistent local storage and CSS custom properties.
* **Operator Profile & Account Modal:** Real-time authenticated session viewer with instant data purge controls.
* **Global Scam Heatmap:** Geographic threat radar clustering scam reports across major urban nodes.
* **Unit Testing Suite:** Native test harness (`node --test`) covering signal extraction, intent inference, kill-chain reconstruction, and domain analysis.

### Changed
* Redesigned visual design system with UI/UX Pro Max standards, deep obsidian surfaces, and high-contrast typography.
* Refactored serverless `/api/analyze` gateway with resilient multi-tier fallback architecture (Groq ➔ Gemini ➔ OpenAI ➔ Heuristics).
* Upgraded PostgreSQL Row-Level Security (RLS) policies and partition rules for `scan_history` and `scam_reports`.

### Security
* Enforced strict server-side API key isolation on Vercel Edge functions.
* Added input size limits and MIME-type validation for evidence uploads to Supabase Storage.
* Implemented client-side and server-side SSRF / Punycode URL sanitization.
