import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing: VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY')
}

if (supabaseUrl && typeof window !== 'undefined') {
  const currentOrigin = window.location.origin
  if (!supabaseUrl.startsWith('https://') || supabaseUrl.includes('localhost')) {
    console.warn('Supabase URL should point to a hosted project URL in production.')
  }
  if (import.meta.env.PROD && currentOrigin.startsWith('http://')) {
    console.warn('Production app should be served over HTTPS.')
  }
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
