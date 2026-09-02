# System Architecture & Technical Design

## 1. High-Level Architecture Overview

GhostNet AI is engineered as a cross-platform, multi-modal cyber threat detection and digital safety system. It operates on a tiered defense model separating client interaction, edge API gateway evaluation, multi-model AI routing, and encrypted database persistence with Row-Level Security.

```mermaid
flowchart TD
    subgraph Client["Client Tier (Web & Mobile)"]
        UI["React 18 + Vite 6 + Tailwind CSS"]
        Mobile["Capacitor 8 Native Android Shell"]
        State["TanStack React Query + AuthContext"]
        UI --- Mobile
    end

    subgraph Gateway["Edge API Gateway (Vercel Serverless)"]
        Endpoint["/api/analyze Endpoint"]
        Health["/api/health Healthcheck"]
        CORS["CORS & Request Sanitization"]
        Endpoint --- CORS
    end

    subgraph AIRouting["Multi-Modal AI Pipeline"]
        Groq["Groq LPU (gpt-oss-120b, qwen3.8-27b)"]
        Gemini["Google Gemini Vision OCR"]
        OpenAI["OpenAI Vision Fallback"]
        Heuristics["Local Social Engineering & Pattern Engine"]
        
        Groq --> Heuristics
        Gemini --> OpenAI --> Heuristics
    end

    subgraph DataTier["Data & Storage Tier (Supabase)"]
        Auth["Supabase Auth (JWT & OAuth)"]
        Postgres["PostgreSQL DB (RLS Enforced)"]
        Storage["Evidence Bucket (Encrypted Uploads)"]
    end

    Client -->|HTTPS / REST API| Gateway
    Gateway -->|Sub-second NLP & Link Inspection| Groq
    Gateway -->|Image OCR & Screenshot Analysis| Gemini
    Gateway -->|Offline Heuristic Fallback| Heuristics
    Client -->|Auth & Sync| DataTier
```

---

## 2. Component Layers & Responsibilities

### A. Frontend Presentation Layer
* **Stack:** React 18, Vite 6, Tailwind CSS, Lucide React, Framer Motion, Recharts.
* **Responsibilities:**
  * Real-time client-side input validation and payload structuring.
  * Interactive **Threat Reconstruction (Kill-Chain)** visualization.
  * Educational **"What Happens If I Click?" Safe Threat Sandbox**.
  * Dynamic Light and Dark theme switching with persistent local storage.
  * Dedicated **Family & Senior Safety Mode** for non-technical users.

### B. API Gateway Tier (`/api/analyze.js`)
* **Runtime:** Vercel Edge Serverless Function (Node.js runtime).
* **Responsibilities:**
  * Secure server-side isolation of all AI credentials (`GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`).
  * Request payload normalization (message text, link URLs, screenshot URLs, community reports).
  * Enforcing security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`).
  * Coordinating autonomous model fallback upon latency spikes or quota depletion.

### C. Multi-Modal AI Engine Tier
* **Text & Link Intelligence:** Groq LPU processing structured JSON prompts in sub-second inference windows.
* **Screenshot Vision Engine:** Gemini Vision OCR extracting visual text, detecting brand impersonation logos, and analyzing payment QR trap vectors.
* **Local Heuristic Engine:** Offline rule engine evaluating 30+ linguistic urgency tokens, Punycode, typosquatting distance, and credential harvesting patterns.

### D. Data & Storage Tier (Supabase)
* **PostgreSQL:** Stores `scan_history` and `scam_reports` with strict PostgreSQL Row-Level Security (RLS) guaranteeing user data partition.
* **Evidence Storage:** Encrypted `evidence` bucket for screenshot uploads with authenticated access policies.

---

## 3. End-to-End Data Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as Operator / User
    participant Frontend as GhostNet Client
    participant API as /api/analyze Gateway
    participant AI as AI Engine (Groq / Gemini)
    participant DB as Supabase PostgreSQL

    User->>Frontend: Input suspicious text, link, or screenshot
    Frontend->>API: POST /api/analyze { type, payload }
    
    alt Primary Cloud AI Available
        API->>AI: Query Groq LPU / Gemini Vision
        AI-->>API: Structured Threat Evaluation JSON
    else Cloud AI Depleted / Offline
        API->>API: Execute Local Heuristic Engine
    end

    API-->>Frontend: Return Normalized Verdict & Attack Chain
    Frontend->>DB: Record scan log in scan_history (with RLS)
    Frontend->>User: Render Score, Intent, Evidence & Threat Reconstruction
```
