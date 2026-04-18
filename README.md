# GhostNet (Supabase + Vercel)

GhostNet is a local-first scam detection web app built with React + Vite.
It runs only on:
- Supabase (database, auth, storage)
- Vercel (deployment + serverless API route)

## Stack
- Frontend: React + Vite + Tailwind
- Data/Auth/Storage: Supabase
- API: Vercel Serverless Function at `api/analyze.js`

## Prerequisites
- Node.js 18+
- npm
- Supabase project
- Vercel account (for deployment)

## Setup
1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in project root:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Apply full Supabase setup (schema + policies + storage):

```bash
SUPABASE_PAT=your_pat SUPABASE_PROJECT_REF=your_project_ref npm run supabase:setup
```

This applies:
- tables (`scan_history`, `scam_reports`)
- constraints and indexes
- RLS policies
- `evidence` storage bucket + storage policies

Optional full wipe + rebuild:

```bash
SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_service_role_key SUPABASE_PAT=your_pat SUPABASE_PROJECT_REF=your_project_ref npm run supabase:reset
```

Seed demo data:

```bash
SUPABASE_PAT=your_pat SUPABASE_PROJECT_REF=your_project_ref SUPABASE_SQL_FILE=supabase/seed.sql npm run supabase:sql
```

Apply strict production RLS (authenticated owner-only access):

```bash
SUPABASE_PAT=your_pat SUPABASE_PROJECT_REF=your_project_ref SUPABASE_SQL_FILE=supabase/strict-rls.sql npm run supabase:sql
```

Note: strict RLS requires app auth flow and ownership columns (`user_id`, `reporter_user_id`) to be populated.

The app now includes built-in Supabase email/password auth and writes ownership automatically for strict RLS.

Reference SQL (manual mode):

```sql
create table if not exists public.scan_history (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  scan_type text not null check (scan_type in ('message', 'link', 'screenshot', 'voice')),
  input_content text,
  fraud_score numeric,
  risk_level text not null check (risk_level in ('safe', 'suspicious', 'scam')),
  ai_analysis text,
  reasons text[],
  screenshot_url text
);

create table if not exists public.scam_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  report_type text not null check (report_type in ('message', 'link', 'phone', 'screenshot', 'website', 'other')),
  scam_content text not null,
  phone_number text,
  url text,
  screenshot_url text,
  fraud_score numeric,
  ai_analysis text,
  risk_level text check (risk_level in ('safe', 'suspicious', 'scam')),
  region text,
  country text,
  upvotes numeric default 0,
  status text default 'pending' check (status in ('pending', 'verified', 'dismissed'))
);
```

4. Create Supabase storage bucket `evidence` (public) for screenshots.

## Local development

Run frontend only:

```bash
npm run dev
```

Run with Vercel functions (recommended):

```bash
npm run dev:vercel
```

## Deploy to Vercel
1. **Prepare Supabase (production)**
   - Open Supabase project `Authentication` -> `URL Configuration`.
   - Add your Vercel production domain to:
     - `Site URL` (e.g. `https://ghostnet.vercel.app`)
     - `Redirect URLs` (same domain + preview domains if needed)
   - Apply setup SQL if not already done:
     - `SUPABASE_PAT=... SUPABASE_PROJECT_REF=... npm run supabase:setup`
   - Apply strict RLS for production:
     - `SUPABASE_PAT=... SUPABASE_PROJECT_REF=... SUPABASE_SQL_FILE=supabase/strict-rls.sql npm run supabase:sql`

2. **Push code to Git provider**
   - Push this project to GitHub/GitLab/Bitbucket.

3. **Create Vercel project**
   - Vercel dashboard -> `Add New Project`.
   - Import repository.
   - Framework preset: `Vite`.
   - Build command: `npm run build`.
   - Output directory: `dist`.

4. **Configure environment variables in Vercel**
   - Add for **Production**, **Preview**, and **Development**:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Deploy**
   - Trigger first deploy from Vercel.
   - Wait for deployment to complete and open the app URL.

6. **Post-deploy validation checklist**
   - Sign up a new user.
   - Sign in and create scans/reports.
   - Confirm data appears for current user only.
   - Sign in with second user and verify isolation.
   - Upload screenshot and confirm storage write works.
   - Confirm `/api/analyze` responds (no fallback in production).

7. **Production hardening (recommended)**
   - Keep Supabase **service role key out of frontend env vars** (never add it to Vercel client env).
   - Restrict Supabase auth providers to the ones you use.
   - Enable Supabase auth protections (email confirmations or rate limits as needed).
   - Monitor Vercel function logs and Supabase logs for failed auth/permission events.
   - Rotate PAT/service-role credentials if they were shared in chat or scripts.

## Notes
- Scam analysis runs through `api/analyze.js` (Vercel serverless).
- In local non-Vercel dev, analysis falls back to local heuristics.
- In production, analysis endpoint failures now return a hard error instead of fallback behavior.
- Healthcheck endpoint is available at `/api/health`.
- Full production runbook: `DEPLOYMENT.md`.
