# GhostNet AI — Hackathon Pitch & Judge Dossier

## 1. Problem Statement

Cyber fraud and social-engineering scams cause over **$10 Billion in annual consumer losses globally**. Fraudsters increasingly leverage AI to generate hyper-realistic banking SMS, reverse UPI payment requests, and deceptive lookalike portals. 

Current consumer security tools fail because:
1. **They are black boxes:** Showing a simple percentage without explaining *why* something is dangerous.
2. **They are too technical:** Jargon like *Punycode, DNS spoofs, and SSL certificates* confuses non-technical users and elderly family members.
3. **They don't explain the attack:** Users click links out of curiosity because they don't understand the underlying trap.

---

## 2. The Solution: GhostNet AI

**GhostNet AI** is a cross-platform multi-modal cybersecurity and scam prevention suite designed to detect, explain, and contain digital threats in real-time.

```text
Detect ➔ Explain ➔ Reconstruct ➔ Contain
```

---

## 3. Key Differentiators for Judges

1. **Threat Reconstruction™ (Attack Kill-Chain):**
   Decomposes extracted digital evidence into an interactive 5-stage attack sequence (*Ingress* ➔ *Panic Urgency* ➔ *Phishing Gateway* ➔ *Credential Harvesting* ➔ *Financial Loss*).

2. **"What Happens If I Click?" Safe Simulator:**
   A zero-execution educational sandbox allowing users to learn how phishing traps work without risking device compromise.

3. **Sub-Second Multi-Modal AI Engine:**
   * **Groq LPU** (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`) delivering 250ms text and URL analysis.
   * **Google Gemini Vision OCR** for screenshot, fake logo, and QR code inspection.
   * **Local Heuristic Fallback Engine** guaranteeing 100% uptime during cloud outages.

4. **Family & Senior Safety Mode:**
   One-tap accessibility transformation providing enlarged touch targets, high-contrast badges, and plain-English safety guidance for vulnerable family members.

5. **Data Sovereignty & Security:**
   Stateless ephemeral serverless execution on Vercel Edge with PostgreSQL Row-Level Security (RLS) on Supabase and 1-click personal data wipe controls.

---

## 4. Technical Architecture Summary

* **Frontend:** React 18, Vite 6, Tailwind CSS, Framer Motion, Recharts.
* **Backend:** Vercel Edge Serverless Functions (`/api/analyze`).
* **Database & Auth:** Supabase PostgreSQL with RLS & Encrypted Storage.
* **Mobile Shell:** Capacitor 8 Native Android.
* **AI Providers:** Groq LPU, Google Gemini Vision, OpenAI Vision fallback.
