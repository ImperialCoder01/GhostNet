# API Keys You Need To Fully Own GhostNet

Use this as your production key checklist.

## Required (already in use)

1) Supabase Project URL
- Key name: `VITE_SUPABASE_URL`
- Where used: frontend client (`src/lib/supabase.js`)

2) Supabase Anon Key
- Key name: `VITE_SUPABASE_ANON_KEY`
- Where used: frontend client (`src/lib/supabase.js`)

## Required for admin operations (never expose in frontend)

3) Supabase Personal Access Token (PAT)
- Key name (scripts): `SUPABASE_PAT`
- Where used: local scripts for schema/policies (`scripts/*.mjs`)
- Keep local/CI only.

4) Supabase Project Ref
- Key name (scripts): `SUPABASE_PROJECT_REF`
- Example: `ysvmcaeyffxzwyjwiyka`

5) Supabase Service Role Key
- Key name (scripts): `SUPABASE_SERVICE_ROLE_KEY`
- Used for destructive reset script only.
- Never put this in Vercel frontend environment variables.

## Recommended for premium screenshot analysis (OCR + Vision)

Choose one provider and add server-side keys in Vercel:

Option A: OpenAI Vision
- `OPENAI_API_KEY`
- Current integration status: supported now in `api/analyze.js` for screenshot scans.

Option B: Google Gemini Vision (free tier friendly)
- `GEMINI_API_KEY`
- Current integration status: supported now in `api/analyze.js` for screenshot scans.

Option B: Google Cloud Vision + Gemini
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` (or secure service account setup)
- `GOOGLE_API_KEY` (if using Gemini endpoints)

Option C: Azure OpenAI Vision
- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_ENDPOINT`

## Recommended for production email auth quality

6) SMTP provider for Supabase Auth emails
- Configure in Supabase dashboard (not app code)
- Suggested providers: Resend, SendGrid, Postmark

## Vercel environment scope

Add frontend-safe vars to:
- Production
- Preview
- Development

Frontend-safe vars:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Server-only vars (future OCR integrations):
- add only to Vercel server runtime
- do not prefix with `VITE_`
