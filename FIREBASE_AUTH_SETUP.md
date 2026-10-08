# GhostNet AI — Firebase Authentication Setup Guide

## Overview
GhostNet AI utilizes **Firebase Authentication** as its primary identity provider across Web and Capacitor Android applications.

---

## Configuration Credentials

### Web Configuration (`.env`)
- `VITE_FIREBASE_API_KEY`: `your_firebase_api_key_placeholder`
- `VITE_FIREBASE_AUTH_DOMAIN`: `your-firebase-project.firebaseapp.com`
- `VITE_FIREBASE_PROJECT_ID`: `your-firebase-project`
- `VITE_FIREBASE_STORAGE_BUCKET`: `your-firebase-project.firebasestorage.app`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: `123456789012`
- `VITE_FIREBASE_APP_ID`: `1:123456789012:web:abcdef1234567890`
- `VITE_FIREBASE_MEASUREMENT_ID`: `G-YOURMEASUREMENTID`

### Android Native Configuration (`android/app/google-services.json`)
- **Package Name**: `com.ghostnet.app`
- **File Location**: `android/app/google-services.json`
- **Gradle Plugin**: `com.google.gms.google-services` (applied in `android/app/build.gradle`)

---

## Authentication Features Implemented
1. **Email / Password Sign-Up**: Creates account, updates user profile, and dispatches real Firebase email verification.
2. **Email / Password Sign-In**: Authenticates user against Firebase Identity Provider.
3. **Google Sign-In**: Provides single-click Google Sign-In with fallback redirect support for mobile web and native Android webviews.
4. **Email Verification Gate**: Restricts full access until user verifies email (includes Resend Email and Check Status controls).
5. **Password Reset**: Dispatches official Firebase password reset email via `sendPasswordResetEmail`.
6. **Session Persistence**: Maintains persistent user session via Firebase `onAuthStateChanged`.
7. **Supabase Integration**: Automatically forwards Firebase JWT ID Token (`getIdToken()`) to Supabase REST client for RLS table access.

---

## Verification Commands
```bash
npm test
npm run build
npx cap sync android
cd android && .\gradlew assembleDebug
```
