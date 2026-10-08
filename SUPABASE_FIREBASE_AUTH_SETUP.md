# GhostNet AI — Supabase Third-Party Auth & RLS Integration Guide

## Overview
GhostNet AI integrates **Supabase PostgreSQL & RLS** with **Firebase Authentication** using official Supabase Third-Party Auth JWT verification.

---

## Authentication Flow
```
Firebase Login (Email / Google)
       │
       ▼
Firebase ID Token (JWT)
       │
       ▼
Supabase Client (updateSupabaseAuthToken)
       │
       ▼
Supabase REST API (Authorization: Bearer <firebase_jwt>)
       │
       ▼
Supabase JWT Issuer Verification (Firebase Project ID: your-firebase-project-id)
       │
       ▼
Authenticated Role + RLS Enforcement
```

---

## Supabase Dashboard Setup Instructions

To enable Supabase to accept Firebase JWT tokens:

1. Log into **Supabase Dashboard** → Select your GhostNet project.
2. Go to **Authentication** → **Providers** → **Third-Party Auth** (or **External Auth**).
3. Enable **Firebase Auth** integration.
4. Input your **Firebase Project ID**: `your-firebase-project-id`.
5. Save changes.

---

## RLS Security Verification
- All user-specific tables (`scan_history`, `community_reports`, `user_preferences`) check `auth.uid()` which maps directly to the Firebase User ID (`sub` claim in Firebase JWT).
- Public reference tables (`public_blocklist`, `threat_indicators`) allow read access to `anon` and `authenticated` roles.
