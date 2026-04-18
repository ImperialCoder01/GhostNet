# GhostNet Production Deployment Runbook

This runbook is for deploying and operating GhostNet on Vercel + Supabase.

## 1) Pre-Deployment Checklist

- Code builds locally:
  - `npm run build`
- Supabase env vars exist in Vercel:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Supabase auth URLs are configured:
  - Site URL = production domain
  - Redirect URLs include production + preview domains
- Schema and policies are applied:
  - `npm run supabase:setup`
  - `npm run supabase:sql` with `supabase/strict-rls.sql`

## 2) Deployment Steps

1. Push changes to default branch.
2. In Vercel, confirm project settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Trigger deployment.
4. Wait until deployment is `Ready`.

## 3) Post-Deployment Smoke Tests

- API health:
  - `GET https://<your-domain>/api/health` returns `{ "ok": true, ... }`
- Analysis endpoint:
  - Message scan should return a score and render UI result
- Auth:
  - Sign up -> Sign in -> Sign out works
- Data isolation:
  - User A data not visible to User B
- Storage:
  - Screenshot upload works and data row is created

## 4) Monitoring

- Vercel:
  - Functions logs for `/api/analyze`
  - Runtime errors and latency spikes
- Supabase:
  - Auth logs (failed sign-ins)
  - Postgres logs (RLS denials and query errors)
  - Storage logs (upload/read failures)

## 5) Incident Response

If app fails after deploy:

1. Check `/api/health` response.
2. Check Vercel deployment logs for build/runtime errors.
3. Validate env vars are present and correct.
4. Confirm Supabase tables/policies were not altered unexpectedly.
5. Roll back using Vercel `Promote Previous Deployment`.

## 6) Rollback Procedure

1. Open Vercel project -> Deployments.
2. Select last known good deployment.
3. Click `Promote to Production`.
4. Re-run smoke tests.

If DB/policy migration caused issue:

1. Re-apply known safe SQL from versioned files in `supabase/`.
2. Confirm with test account before opening traffic.

## 7) Security Operations

- Never expose Supabase service role key in frontend env vars.
- Rotate keys if leaked.
- Keep strict RLS policy in place.
- Review Vercel and Supabase access logs regularly.
