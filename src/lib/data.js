import { supabase } from '@/lib/supabase'

async function requireUserId() {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error && data?.user?.id) return data.user.id
  } catch {}
  try {
    const saved = localStorage.getItem('ghostnet_guest_session')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed?.id) return parsed.id
    }
  } catch {}
  return 'demo-analyst-guest'
}

const mapScan = (row) => ({
  ...row,
  created_date: row.created_at,
})

const mapReport = (row) => ({
  ...row,
  created_date: row.created_at,
})

export async function listScanHistory(limit = 20) {
  try {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data || []).map(mapScan)
  } catch (err) {
    console.warn('[data] listScanHistory fallback:', err?.message || err)
    return []
  }
}

export async function createScanHistory(payload) {
  try {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('scan_history')
      .insert({
        ...payload,
        user_id: userId,
      })
      .select('*')
      .single()

    if (error) throw error
    return mapScan(data)
  } catch (err) {
    console.warn('[data] createScanHistory fallback:', err?.message || err)
    return null
  }
}

export async function listScamReports(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('scam_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data || []).map(mapReport)
  } catch (err) {
    console.warn('[data] listScamReports fallback:', err?.message || err)
    return []
  }
}

export async function createScamReport(payload) {
  try {
    const userId = await requireUserId()
    const { data, error } = await supabase
      .from('scam_reports')
      .insert({
        ...payload,
        reporter_user_id: userId,
      })
      .select('*')
      .single()

    if (error) throw error
    return mapReport(data)
  } catch (err) {
    console.warn('[data] createScamReport fallback:', err?.message || err)
    return null
  }
}

export async function uploadEvidenceFile(file) {
  const userId = await requireUserId()
  if (!file) return ''
  const extension = (file.name.split('.').pop() || 'bin').toLowerCase()
  const fileName = `${userId}/${Date.now()}-${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from('evidence')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.warn('Could not upload evidence file:', error.message)
    return ''
  }

  const { data: signed, error: signErr } = await supabase.storage
    .from('evidence')
    .createSignedUrl(fileName, 60 * 60 * 24 * 30)

  if (signErr) {
    console.warn('Could not create signed URL:', signErr.message)
    return ''
  }

  return signed?.signedUrl || ''
}

/**
 * Feature 4 — Community Threat Intelligence
 * Lists threat indicators from the last 7 days grouped by region.
 * Uses anon key — read-only, matches RLS SELECT policy.
 * Returns [{ region, count }] or [] on any error.
 */
export async function listThreatIndicatorStats() {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const { data, error } = await supabase
      .from('threat_indicators')
      .select('region')
      .gte('last_seen', sevenDaysAgo)
    
    if (error) {
      console.warn('[data] listThreatIndicatorStats failed:', error.message)
      return []
    }
    
    // Group by region client-side
    const counts = {}
    for (const row of (data || [])) {
      const region = row.region || 'Unknown'
      counts[region] = (counts[region] || 0) + 1
    }
    
    return Object.entries(counts).map(([region, count]) => ({ region, count }))
  } catch (err) {
    console.warn('[data] listThreatIndicatorStats error:', err.message)
    return []
  }
}
