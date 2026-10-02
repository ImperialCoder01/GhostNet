import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.ghostnet.app',
  appName: 'GhostNet',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#07101d',
      showSpinner: false,
      androidSpinnerStyle: 'small',
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#07101d',
      overlaysWebView: false,
    },
    Keyboard: {
      resize: 'body',
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '974100426213-p47s4c59bjgthtutfv2s1gsniq1ottu2.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
}

export default config
