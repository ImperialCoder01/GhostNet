import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle as firebaseSignInWithGoogle,
  sendPasswordReset as firebaseSendPasswordReset,
  sendEmailVerificationLink,
  signOutUser,
  subscribeToAuthState,
  handleGoogleRedirectResult,
  getFirebaseIdToken,
} from '@/services/firebaseAuth'
import { auth } from '@/lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    try {
      return localStorage.getItem('ghostnet_has_seen_onboarding') === 'true'
    } catch {
      return false
    }
  })

  const [isPasswordRecovery, setIsPasswordRecovery] = useState(() => {
    try {
      return (
        typeof window !== 'undefined' &&
        (window.location.hash.includes('type=recovery') || window.location.search.includes('type=recovery'))
      )
    } catch {
      return false
    }
  })

  useEffect(() => {
    let unsubscribe = () => {}

    // Safety fallback: Ensure auth loading never blocks UI indefinitely on mobile/offline
    const safetyTimer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    // Process redirect result if returning from mobile/popup redirect flow
    handleGoogleRedirectResult().catch(() => {})

    unsubscribe = subscribeToAuthState((fbUser) => {
      clearTimeout(safetyTimer)
      if (fbUser) {
        setFirebaseUser(fbUser)
        setUser({
          uid: fbUser.uid,
          id: fbUser.uid,
          email: fbUser.email || '',
          displayName: fbUser.displayName || '',
          emailVerified: fbUser.emailVerified || false,
          photoURL: fbUser.photoURL || '',
          user_metadata: {
            full_name: fbUser.displayName || fbUser.email?.split('@')[0] || 'GhostNet User',
            avatar_url: fbUser.photoURL || '',
          },
        })
      } else {
        setFirebaseUser(null)
        try {
          const guest = sessionStorage.getItem('ghostnet_guest_session') || localStorage.getItem('ghostnet_guest_session_active')
          if (guest) setUser(JSON.parse(guest))
          else setUser(null)
        } catch {
          setUser(null)
        }
      }
      setLoading(false)
    })

    return () => {
      clearTimeout(safetyTimer)
      unsubscribe()
    }
  }, [])

  const completeOnboarding = () => {
    setHasSeenOnboarding(true)
    try {
      localStorage.setItem('ghostnet_has_seen_onboarding', 'true')
    } catch {}
  }

  const resetOnboarding = () => {
    setHasSeenOnboarding(false)
    try {
      localStorage.removeItem('ghostnet_has_seen_onboarding')
    } catch {}
  }

  const continueAsGuest = () => {
    const demoUser = {
      id: 'ghostnet-operator-active',
      uid: 'ghostnet-operator-active',
      email: 'operator@ghostnet.ai',
      displayName: 'GhostNet Defense Operator',
      emailVerified: true,
      user_metadata: { full_name: 'GhostNet Defense Operator' },
    }
    setUser(demoUser)
    try {
      sessionStorage.setItem('ghostnet_guest_session', JSON.stringify(demoUser))
      localStorage.setItem('ghostnet_guest_session_active', JSON.stringify(demoUser))
    } catch {}
  }

  const signUp = async (email, password, name) => {
    const fbUser = await signUpWithEmail(email, password, name)
    if (fbUser) {
      const userObj = {
        uid: fbUser.uid,
        id: fbUser.uid,
        email: fbUser.email || email.trim(),
        displayName: fbUser.displayName || name || email.split('@')[0],
        emailVerified: fbUser.emailVerified || false,
        photoURL: fbUser.photoURL || '',
        user_metadata: {
          full_name: fbUser.displayName || name || email.split('@')[0],
          avatar_url: fbUser.photoURL || '',
        },
      }
      setUser(userObj)
    }
    return fbUser
  }

  const signIn = async (email, password) => {
    const fbUser = await signInWithEmail(email, password)
    if (fbUser) {
      const userObj = {
        uid: fbUser.uid,
        id: fbUser.uid,
        email: fbUser.email || email.trim(),
        displayName: fbUser.displayName || email.split('@')[0],
        emailVerified: fbUser.emailVerified || false,
        photoURL: fbUser.photoURL || '',
        user_metadata: {
          full_name: fbUser.displayName || email.split('@')[0],
          avatar_url: fbUser.photoURL || '',
        },
      }
      setUser(userObj)
    }
    return fbUser
  }

  const signInWithGoogle = async () => {
    const fbUser = await firebaseSignInWithGoogle()
    if (fbUser) {
      const userObj = {
        uid: fbUser.uid,
        id: fbUser.uid,
        email: fbUser.email || 'analyst@ghostnet.ai',
        displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'GhostNet User',
        emailVerified: true,
        photoURL: fbUser.photoURL || '',
        user_metadata: {
          full_name: fbUser.displayName || fbUser.email?.split('@')[0] || 'GhostNet User',
          avatar_url: fbUser.photoURL || '',
        },
      }
      setUser(userObj)
    }
    return fbUser
  }

  const requestPasswordReset = async (email) => {
    await firebaseSendPasswordReset(email)
  }

  const sendEmailVerification = async () => {
    await sendEmailVerificationLink()
  }

  const refreshUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload()
      const updated = auth.currentUser
      setFirebaseUser(updated)
      setUser({
        uid: updated.uid,
        id: updated.uid,
        email: updated.email || '',
        displayName: updated.displayName || '',
        emailVerified: updated.emailVerified || false,
        photoURL: updated.photoURL || '',
        user_metadata: {
          full_name: updated.displayName || updated.email?.split('@')[0] || 'GhostNet User',
          avatar_url: updated.photoURL || '',
        },
      })
    }
  }

  const signOut = async () => {
    try {
      sessionStorage.removeItem('ghostnet_guest_session')
      localStorage.removeItem('ghostnet_guest_session_active')
      localStorage.removeItem('ghostnet_guest_session')
    } catch {}
    setUser(null)
    setFirebaseUser(null)
    setIsPasswordRecovery(false)
    await signOutUser()
  }

  const value = useMemo(
    () => ({
      user,
      firebaseUser,
      loading,
      isAuthenticated: Boolean(user),
      isEmailVerified: Boolean(firebaseUser?.emailVerified),
      hasSeenOnboarding,
      completeOnboarding,
      resetOnboarding,
      continueAsGuest,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      isPasswordRecovery,
      setIsPasswordRecovery,
      requestPasswordReset,
      sendEmailVerification,
      refreshUser,
      getIdToken: getFirebaseIdToken,
    }),
    [user, firebaseUser, loading, hasSeenOnboarding, isPasswordRecovery]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
