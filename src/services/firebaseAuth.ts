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
  getRedirectResult,
  User,
  AuthError,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { updateSupabaseAuthToken } from '@/lib/supabase'

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

  try {
    const result = await signInWithPopup(auth, provider)
    return result.user
  } catch (err: unknown) {
    const authErr = err as AuthError
    if (
      authErr.code === 'auth/popup-blocked' ||
      authErr.code === 'auth/popup-closed-by-user' ||
      authErr.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      await signInWithRedirect(auth, provider)
      throw new Error('Redirecting to Google Sign-In...')
    }
    throw authErr
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
