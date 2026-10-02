import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
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
      return typeof window !== 'undefined' && (
        window.location.hash.includes('type=recovery') ||
        window.location.search.includes('type=recovery')
      )
    } catch {
      return false
    }
  })

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data?.session?.user) {
        setSession(data.session)
        setUser(data.session.user)
      } else {
        try {
          const saved = sessionStorage.getItem('ghostnet_guest_session') || localStorage.getItem('ghostnet_guest_session_active')
          if (saved) setUser(JSON.parse(saved))
          else setUser(null)
        } catch {
          setUser(null)
        }
      }
      setLoading(false)
    }).catch(() => {
      if (!mounted) return
      try {
        const saved = sessionStorage.getItem('ghostnet_guest_session') || localStorage.getItem('ghostnet_guest_session_active')
        if (saved) setUser(JSON.parse(saved))
        else setUser(null)
      } catch {
        setUser(null)
      }
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession || null)
      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true)
      }
      if (nextSession?.user) {
        setUser(nextSession.user)
      } else {
        try {
          const saved = sessionStorage.getItem('ghostnet_guest_session') || localStorage.getItem('ghostnet_guest_session_active')
          setUser(saved ? JSON.parse(saved) : null)
        } catch {
          setUser(null)
        }
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
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
      email: 'operator@ghostnet.ai',
      user_metadata: { full_name: 'GhostNet Defense Operator' },
    }
    setUser(demoUser)
    try {
      sessionStorage.setItem('ghostnet_guest_session', JSON.stringify(demoUser))
      localStorage.setItem('ghostnet_guest_session_active', JSON.stringify(demoUser))
    } catch {}
  }

  const requestPasswordReset = async (email) => {
    const origin = window.location.origin
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/#reset-password`,
    })
    if (error) throw error
    return data
  }

  const updateUserPassword = async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword.trim(),
    })
    if (error) throw error
    setIsPasswordRecovery(false)
    try {
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch {}
    return data
  }

  const signOut = async () => {
    try {
      sessionStorage.removeItem('ghostnet_guest_session')
      localStorage.removeItem('ghostnet_guest_session_active')
      localStorage.removeItem('ghostnet_guest_session')
    } catch {}
    setUser(null)
    setSession(null)
    setIsPasswordRecovery(false)
    try {
      await supabase.auth.signOut()
    } catch {}
  }

  const value = useMemo(
    () => ({
      session,
      user,
      loading,
      hasSeenOnboarding,
      completeOnboarding,
      resetOnboarding,
      continueAsGuest,
      signOut,
      isPasswordRecovery,
      setIsPasswordRecovery,
      requestPasswordReset,
      updateUserPassword,
    }),
    [session, user, loading, hasSeenOnboarding, isPasswordRecovery]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
