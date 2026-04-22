# GhostNet Deployment and Android APK Guide

## 1. Gemini quota and provider behavior

GhostNet already degrades safely when Gemini is rate-limited or quota-limited.

- If Gemini returns a `429 Too Many Requests`, the API falls back to local heuristic analysis.
- To improve reliability in production, you can also add `OPENAI_API_KEY` on Vercel so the API route can try OpenAI when Gemini is unavailable.
- You cannot fully fix Google quota from code alone. You must review the Google AI Studio project, quota, billing, or create a new key/project.

## 2. Local web testing without Vercel login

This project now supports local `/api/*` requests through the Vite dev server.

Run:

```powershell
npm install
npm run dev
```

Then open the local Vite URL and test scans in the browser.

## 3. Deploy to Vercel

Official references:

- Vercel environment variables: https://vercel.com/docs/environment-variables
- Vite on Vercel: https://vercel.com/docs/frameworks/frontend/vite

### Dashboard steps

1. Push this repo to GitHub, GitLab, or Bitbucket.
2. Import the repo into Vercel.
3. Keep the default Vite build settings unless Vercel suggests a better auto-detected option.
4. Add these environment variables in `Settings -> Environment Variables`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
```

Optional:

```env
OPENAI_API_KEY=...
```

5. Apply them to `Production`, `Preview`, and `Development` as needed.
6. Redeploy after adding or changing any environment variable.

### After deploy

Copy your final deployment URL. Example:

```env
https://your-project.vercel.app
```

You will use that URL for Android builds as `VITE_API_BASE_URL`.

## 4. Prepare Android build

Official Capacitor references:

- Capacitor docs: https://capacitorjs.com/docs
- Capacitor getting started / Android platform: https://capacitorjs.com/

This repo now includes Capacitor and an Android project.

### Required local tools

- Node.js
- Android Studio
- Android SDK
- Java 17 or the version Android Studio recommends for your Gradle setup

### Set the backend URL for native builds

Before building the Android app, set this in `.env.local`:

```env
VITE_API_BASE_URL=https://your-project.vercel.app
```

This is required because the native app bundles the frontend locally, but AI analysis still needs your deployed backend.

### Build and sync

```powershell
npm run build:mobile
npm run cap:sync
```

Or:

```powershell
npm run android:prepare
```

## 5. Open Android Studio and generate APK

```powershell
npm run cap:android
```

Then in Android Studio:

1. Wait for Gradle sync to finish.
2. Choose `Build -> Build Bundle(s) / APK(s) -> Build APK(s)` for a debug APK.
3. For a release APK, use `Build -> Generate Signed App Bundle / APK`.
4. Install the APK on a device or emulator.

## 6. Important architecture note

The APK can contain the full frontend, but AI analysis is still server-backed.

That means:

- The app UI, routing, and scan screens are bundled into the APK.
- Supabase is reached directly from the app using the public anon key.
- The AI analysis route is reached through your deployed Vercel backend using `VITE_API_BASE_URL`.

## 7. Recommended production setup

- Add both `GEMINI_API_KEY` and `OPENAI_API_KEY` on Vercel for redundancy.
- Rotate the Gemini key because it was pasted into chat.
- Keep `VITE_API_BASE_URL` set only for native/mobile builds.
- Re-run `npm run android:prepare` whenever frontend files change.
