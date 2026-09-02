# Architecture Decision Log (ADR)

This log records major architectural decisions, evaluated alternatives, and engineering tradeoffs made during the development of GhostNet AI.

---

## ADR 001: Selection of Groq LPU for Primary NLP & Link Evaluation
* **Context:** Cybersecurity scan interfaces require sub-second response times to prevent user impatience and preemptive malicious link clicks.
* **Options Considered:** OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, Groq LPU (`openai/gpt-oss-120b`).
* **Decision:** Selected Groq LPU for primary text and link evaluation.
* **Rationale:** Groq achieves 200–400ms inference latency, providing near-instant scam verdicts while maintaining complex reasoning capabilities.
* **Tradeoffs:** Requires secondary fallbacks for multi-modal vision tasks.

---

## ADR 002: Multi-Model Vision Pipeline (Gemini Vision + OpenAI + Local OCR)
* **Context:** Screenshot scam detection requires high-accuracy visual OCR (fake logos, payment QR codes, banking UI replicas).
* **Options Considered:** Custom Tesseract OCR on edge vs Google Gemini Flash Vision API vs Cloud Vision.
* **Decision:** Implemented Google Gemini Flash Vision as primary vision model with OpenAI `gpt-4.1-mini` and local heuristics as fallbacks.
* **Rationale:** Gemini Flash Vision provides exceptional multimodal OCR and visual semantic understanding with low latency and favorable free-tier allowances.
* **Tradeoffs:** Dependent on external cloud vision availability, necessitating local fallback when offline.

---

## ADR 003: Supabase for PostgreSQL & Row-Level Security
* **Context:** User scan logs and evidence files require strict data privacy and access partitioning.
* **Options Considered:** Firebase Firestore vs Self-hosted MongoDB vs Supabase PostgreSQL.
* **Decision:** Selected Supabase (PostgreSQL with RLS).
* **Rationale:** PostgreSQL Row-Level Security (RLS) guarantees cryptographic data isolation directly at the database layer, preventing unauthorized cross-user access (IDOR).
* **Tradeoffs:** Relies on Supabase platform availability.

---

## ADR 004: Capacitor 8 for Cross-Platform Native Mobile Delivery
* **Context:** The digital safety platform needed to target both Web and Android mobile users from a single codebase.
* **Options Considered:** Full React Native rewrite vs Flutter vs Capacitor 8 on top of Vite React.
* **Decision:** Selected Capacitor 8.
* **Rationale:** Preserves 100% of our responsive UI, Tailwind styling, and React component state while generating a native Android APK with zero duplicate code.
* **Tradeoffs:** Slightly larger APK size compared to raw native Kotlin.
