import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null)
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

  const continueAsGuest = () => {
    const demoUser = {
      id: 'demo-analyst-guest',
      email: 'analyst@ghostnet.ai',
      user_metadata: { full_name: 'GhostNet Security Analyst (Demo)' },
    }
    setUser(demoUser)
    try {
      sessionStorage.setItem('ghostnet_guest_session', JSON.stringify(demoUser))
      localStorage.setItem('ghostnet_guest_session_active', JSON.stringify(demoUser))
    } catch {}
  }

  const signOut = async () => {
    try {
      sessionStorage.removeItem('ghostnet_guest_session')
      localStorage.removeItem('ghostnet_guest_session_active')
      localStorage.removeItem('ghostnet_guest_session')
    } catch {}
    setUser(null)
    setSession(null)
    try {
      await supabase.auth.signOut()
    } catch {}
  }

  const value = useMemo(
    () => ({ session, user, loading, continueAsGuest, signOut }),
    [session, user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
