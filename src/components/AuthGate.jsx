import React, { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'

export default function AuthGate({ children }) {
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('signin')

  const title = useMemo(() => (mode === 'signin' ? 'Sign In' : 'Create Account'), [mode])

  const onSubmit = async () => {
    setError('')
    setBusy(true)
    try {
      if (!email || !password) {
        setError('Email and password are required.')
        return
      }

      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name || '' },
          },
        })
        if (signUpError) throw signUpError

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
      }
    } catch (e) {
      setError(e?.message || 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return children
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--ghost-bg)' }}>
      <div className="ghost-card w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-extrabold text-white">GhostNet</h1>
        <p className="text-sm" style={{ color: 'var(--ghost-text-dim)' }}>
          {title} to continue using your private scam intelligence workspace.
        </p>

        {mode === 'signup' && (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="h-11 bg-transparent border-0"
            style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-text)' }}
          />
        )}

        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          className="h-11 bg-transparent border-0"
          style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-text)' }}
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="h-11 bg-transparent border-0"
          style={{ background: 'var(--ghost-surface-2)', color: 'var(--ghost-text)' }}
        />

        {error ? (
          <p className="text-sm" style={{ color: 'var(--ghost-red)' }}>
            {error}
          </p>
        ) : null}

        <Button
          onClick={onSubmit}
          disabled={busy}
          className="w-full h-11 rounded-xl font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #0891b2)' }}
        >
          {busy ? 'Please wait...' : title}
        </Button>

        <button
          type="button"
          onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
          className="text-sm font-semibold"
          style={{ color: 'var(--ghost-neon)' }}
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
