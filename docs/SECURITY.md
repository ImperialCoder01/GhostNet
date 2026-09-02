# Security Architecture & Threat Defense

GhostNet AI is built with an enterprise defense-in-depth posture, ensuring that data is processed securely, secrets remain isolated, and users are protected from secondary exploitation.

---

## 1. Core Security Guarantees

### A. Secret Isolation & Zero-Leakage Architecture
* **Serverless Boundary:** All sensitive provider API keys (`GROQ_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are stored strictly in serverless environment variables on Vercel.
* **Frontend Immunity:** No server-side secrets are prefixed with `VITE_` or exposed in client bundles.

### B. PostgreSQL Row-Level Security (RLS)
* User scan histories are strictly partitioned by cryptographic `auth.uid()`.
* No authenticated user can access, query, or enumerate scan logs belonging to another user.

### C. Safe Sandbox Threat Simulation
* The **"What Happens If I Click?"** simulator runs zero hostile JavaScript or remote payloads.
* All threat scenarios are decomposed into static educational steps rendered inside an isolated React modal.

### D. Server-Side Request Forgery (SSRF) & URL Sanitization
* URL link checks perform lexical, DNS, and Punycode decomposition without executing remote scripts or downloading active payloads.

### E. Vision & Media Upload Validation
* Evidence image uploads enforce strict MIME-type checking (`image/png`, `image/jpeg`, `image/webp`) and size limits (10MB) before forwarding to vision OCR APIs.

---

## 2. HTTP Security Headers

The `/api/analyze` gateway enforces defense-in-depth response headers:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: no-referrer
```

---

## 3. Responsible Disclosure

To report security vulnerabilities, email `security@ghostnet.ai` or submit a private GitHub Security Advisory. See [SECURITY.md](../SECURITY.md) for full disclosure SLA.
