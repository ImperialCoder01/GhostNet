// @ts-nocheck
import React, { useMemo, useState } from 'react'
import { Shield, Sparkles } from 'lucide-react'
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
        <div className="ghost-card p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-cyan-300 animate-spin" />
          <div>
            <p className="text-sm font-bold text-white">Opening secure workspace</p>
            <p className="text-xs mt-1" style={{ color: 'var(--ghost-text-dim)' }}>
              Restoring your protection session
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return children
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'transparent' }}>
      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
        <div className="ghost-card ghost-panel p-7 md:p-9 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center ghost-glow"
                style={{ background: 'linear-gradient(135deg, #6adfff, #2d87d7 70%, #34eca5)' }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold neon-text">GhostNet</h1>
                <p className="text-sm" style={{ color: 'var(--ghost-text-dim)' }}>
                  Private AI scam intelligence workspace
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="ghost-card-soft p-4">
                <p className="section-label mb-2">Why this app feels different</p>
                <p className="text-base font-semibold" style={{ color: 'var(--ghost-headline)' }}>
                  Scan suspicious messages, links, and screenshots with actionable guidance instead of vague warnings.
                </p>
              </div>

              {[
                'Clear threat summaries with confidence, extracted links, and next steps',
                'Shared web and Android-ready experience from the same codebase',
                'Community reporting and heatmap visibility for recurring scam patterns',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <Sparkles className="w-4 h-4 mt-1 shrink-0" style={{ color: 'var(--ghost-neon)' }} />
                  <p className="text-sm" style={{ color: 'var(--ghost-text-dim)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { label: 'Messages', value: 'AI' },
              { label: 'Links', value: 'Live' },
              { label: 'Screenshots', value: 'Vision' },
            ].map((item) => (
              <div key={item.label} className="ghost-card-soft p-4">
                <p className="text-lg font-extrabold neon-text">{item.value}</p>
                <p className="text-xs font-semibold mt-1" style={{ color: 'var(--ghost-text-dim)' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="ghost-card p-6 md:p-7 space-y-4 self-center">
          <div>
            <p className="section-label mb-2">Secure Access</p>
            <h2 className="text-2xl font-extrabold text-white">{title}</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--ghost-text-dim)' }}>
              {mode === 'signin'
                ? 'Continue into your protected workspace and review scans across web and mobile.'
                : 'Create your account to sync scan history, reports, and safety insights.'}
            </p>
          </div>

          {mode === 'signup' ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="h-12 bg-transparent border rounded-2xl px-4"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--ghost-text)', borderColor: 'rgba(129,162,216,0.14)' }}
            />
          ) : null}

          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="h-12 bg-transparent border rounded-2xl px-4"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--ghost-text)', borderColor: 'rgba(129,162,216,0.14)' }}
          />

          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="h-12 bg-transparent border rounded-2xl px-4"
            style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--ghost-text)', borderColor: 'rgba(129,162,216,0.14)' }}
          />

          {error ? (
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,100,125,0.1)', color: 'var(--ghost-red)' }}>
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : null}

          <Button
            onClick={onSubmit}
            disabled={busy}
            className="w-full h-12 rounded-2xl font-semibold text-slate-950"
            style={{ background: 'linear-gradient(135deg, #83e7ff, #34eca5)' }}
          >
            {busy ? 'Please wait...' : title}
          </Button>

          <button
            type="button"
            onClick={() => setMode((current) => (current === 'signin' ? 'signup' : 'signin'))}
            className="text-sm font-semibold"
            style={{ color: 'var(--ghost-neon)' }}
          >
            {mode === 'signin' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
