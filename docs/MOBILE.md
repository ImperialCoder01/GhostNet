# Mobile Architecture & Capacitor Android Guide

GhostNet AI packages a native Android build using **Capacitor 8**.

---

## 1. Mobile Architecture

* **Framework:** Capacitor 8 bridge wrapping the Vite React single-page application.
* **App ID:** `com.ghostnet.app`
* **App Name:** `GhostNet`
* **Web Dir:** `dist`

---

## 2. Prerequisites for Android Builds

* **Android Studio:** Hedgehog (2023.1.1) or newer with Android SDK Build-Tools 34+.
* **Java Development Kit (JDK):** OpenJDK 17 or 21.

---

## 3. Build & Sync Workflow

1. **Build Production Web Bundle:**
   ```bash
   npm run build
   ```

2. **Sync Web Assets to Android Project:**
   ```bash
   npx cap sync android
   ```

3. **Open Project in Android Studio:**
   ```bash
   npx cap open android
   ```

4. **Generate Signed / Debug APK:**
   * In Android Studio, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
   * The generated `.apk` will be output to `android/app/build/outputs/apk/debug/app-debug.apk`.
