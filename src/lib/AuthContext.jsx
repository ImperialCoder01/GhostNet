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
          const saved = localStorage.getItem('ghostnet_guest_session')
          if (saved) setUser(JSON.parse(saved))
        } catch {}
      }
      setLoading(false)
    }).catch(() => {
      if (!mounted) return
      try {
        const saved = localStorage.getItem('ghostnet_guest_session')
        if (saved) setUser(JSON.parse(saved))
      } catch {}
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession || null)
      if (nextSession?.user) {
        setUser(nextSession.user)
      } else {
        try {
          const saved = localStorage.getItem('ghostnet_guest_session')
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
      localStorage.setItem('ghostnet_guest_session', JSON.stringify(demoUser))
    } catch {}
  }

  const signOut = async () => {
    try {
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
