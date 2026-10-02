import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithCredential,
  getRedirectResult,
  User,
  AuthError,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { updateSupabaseAuthToken } from '@/lib/supabase'
import { Capacitor } from '@capacitor/core'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'

let googleAuthInitialized = false
function ensureGoogleAuthInitialized() {
  if (Capacitor.isNativePlatform() && !googleAuthInitialized) {
    try {
      GoogleAuth.initialize({
        clientId: '974100426213-p47s4c59bjgthtutfv2s1gsniq1ottu2.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      })
      googleAuthInitialized = true
    } catch (err) {
      console.warn('[FirebaseAuth] Native GoogleAuth initialize notice:', err)
    }
  }
}

export async function signUpWithEmail(email: string, password: string, fullName?: string): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim())
  const user = userCredential.user

  if (fullName && fullName.trim()) {
    await updateProfile(user, { displayName: fullName.trim() })
  }

  try {
    await sendEmailVerification(user)
  } catch (err) {
    console.warn('[FirebaseAuth] Email verification send warning:', err)
  }

  return user
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim())
  return userCredential.user
}

export async function signInWithGoogle(): Promise<User> {
  const provider = new GoogleAuthProvider()
  provider.setCustomParameters({ prompt: 'select_account' })

  if (Capacitor.isNativePlatform()) {
    ensureGoogleAuthInitialized()
    try {
      const googleUser = await GoogleAuth.signIn()
      const idToken = googleUser?.authentication?.idToken || (googleUser as Record<string, any>)?.idToken
      if (idToken) {
        const credential = GoogleAuthProvider.credential(idToken)
        const result = await signInWithCredential(auth, credential)
        return result.user
      }
    } catch (nativeErr: unknown) {
      console.warn('[FirebaseAuth] Native Google Sign-In notice:', nativeErr)
      const errStr = String((nativeErr as any)?.message || (nativeErr as any)?.code || nativeErr || '').toLowerCase()
      if (errStr.includes('cancel') || errStr.includes('12501') || errStr.includes('closed_by_user')) {
        throw new Error('Google Sign-In was cancelled.')
      }
      // If native plugin fails for SHA-1 / configuration reasons, fall through to web provider popup
    }
  }

  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (err: unknown) {
    const authErr = err as AuthError
    console.warn('[FirebaseAuth] Popup auth status:', authErr)

    if (authErr.code === 'auth/cancelled-popup-request' || authErr.code === 'auth/popup-closed-by-user') {
      throw new Error('Google Sign-In was cancelled.')
    }

    if (
      authErr.code === 'auth/popup-blocked' ||
      authErr.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      if (Capacitor.isNativePlatform()) {
        throw new Error('Google Sign-In failed on Android. Please ensure the SHA-1 fingerprint is added to Firebase Console.')
      }

      try {
        await signInWithRedirect(auth, provider)
        throw new Error('Redirecting to Google Sign-In...')
      } catch (redirectErr: unknown) {
        if ((redirectErr as any)?.message === 'Redirecting to Google Sign-In...') {
          throw redirectErr
        }
        throw new Error((redirectErr as any)?.message || 'Google Sign-In failed. Please try again.')
      }
    }

    throw new Error(authErr.message || 'Google Sign-In failed. Please try again.')
  }
}

export async function handleGoogleRedirectResult(): Promise<User | null> {
  try {
    const result = await getRedirectResult(auth)
    return result ? result.user : null
  } catch {
    return null
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email.trim())
}

export async function sendEmailVerificationLink(): Promise<void> {
  if (!auth.currentUser) throw new Error('No user currently signed in.')
  await sendEmailVerification(auth.currentUser)
}

export async function signOutUser(): Promise<void> {
  await signOut(auth)
  await updateSupabaseAuthToken(null)
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}

export async function getFirebaseIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth.currentUser) return null
  return auth.currentUser.getIdToken(forceRefresh)
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken()
        await updateSupabaseAuthToken(token)
      } catch (err) {
        console.warn('[FirebaseAuth] Failed to update Supabase session token:', err)
      }
    } else {
      await updateSupabaseAuthToken(null)
    }
    callback(user)
  })
}
