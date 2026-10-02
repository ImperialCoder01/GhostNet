import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyASrAwnNM-tMzJeOwggZWgr8kUBwZJZI70',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ghostnetpro.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ghostnetpro',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ghostnetpro.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '974100426213',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:974100426213:web:8435cc709bea87e030d30c',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-NLK931W60S',
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)

export { app, auth }
