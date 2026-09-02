# Privacy & Data Sovereignty Policy

GhostNet AI is designed around data minimization, user sovereignty, and zero deceptive tracking.

---

## 1. What Data We Process

* **Scanned Text & Links:** Processed ephemerally via Vercel Edge Serverless functions and Groq/Gemini APIs to generate risk assessments and attack chains.
* **Uploaded Screenshots:** Uploaded to the authenticated Supabase `evidence` bucket and passed to Gemini Vision for OCR extraction.
* **User Accounts:** Email address and authentication tokens managed via Supabase Auth.
* **Community Reports:** Publicly submitted scam patterns shared with community threat telemetry.

---

## 2. What We NEVER Do

* ❌ We do **NOT** sell, broker, or monetize user data to third-party ad networks.
* ❌ We do **NOT** track users across external websites.
* ❌ We do **NOT** store plaintext passwords or banking PINs.

---

## 3. Data Sovereignty & User Deletion

Users maintain complete control over their inspection logs:

* **1-Click Scan History Purge:** Available directly inside the app at **Privacy Sovereignty Center** (`/PrivacyCenter`).
* Triggering a purge permanently removes all user records from `scan_history` in Supabase PostgreSQL via cryptographic `auth.uid()` matching.
