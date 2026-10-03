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
  created_date: row.created_at || row.created_date || new Date().toISOString(),
})

const mapReport = (row) => ({
  ...row,
  created_date: row.created_at || row.created_date || new Date().toISOString(),
})

const LOCAL_STORAGE_KEY = 'ghostnet_recent_scans'

const DEFAULT_INITIAL_SCANS = [
  {
    id: 'seed-scan-1',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    created_date: new Date(Date.now() - 3600000 * 2).toISOString(),
    scan_type: 'message',
    input_content: 'URGENT: Your SBI account has been suspended due to pending KYC verification. Click http://sbi-kyc-update.com immediately to unblock.',
    fraud_score: 95,
    risk_level: 'scam',
    ai_analysis: 'High-pressure financial scam impersonating State Bank of India with malicious phishing domain.',
    reasons: ['URGENCY_SCARE_TACTICS', 'SUSPICIOUS_DOMAIN', 'IMPERSONATION_BRAND', 'PAYMENT_REDIRECT'],
    source: 'web',
  },
  {
    id: 'seed-scan-2',
    created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    created_date: new Date(Date.now() - 3600000 * 8).toISOString(),
    scan_type: 'link',
    input_content: 'http://habbib-bank-login.secure-portal-auth.xyz',
    fraud_score: 88,
    risk_level: 'scam',
    ai_analysis: 'Typosquatting phishing domain mimicking banking login portal to harvest credentials.',
    reasons: ['SUSPICIOUS_DOMAIN', 'IMPERSONATION_BRAND', 'REQUEST_OTP_PASSWORD'],
    source: 'web',
  },
  {
    id: 'seed-scan-3',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    created_date: new Date(Date.now() - 3600000 * 24).toISOString(),
    scan_type: 'message',
    input_content: 'Your Google verification code is 492015. Do not share this code with anyone.',
    fraud_score: 5,
    risk_level: 'safe',
    ai_analysis: 'Standard legitimate automated 2FA authentication message with no external phishing links.',
    reasons: [],
    source: 'web',
  },
]

function getLocalScanHistory() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_INITIAL_SCANS))
      return DEFAULT_INITIAL_SCANS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : DEFAULT_INITIAL_SCANS
  } catch (err) {
    console.warn('[data] Failed to parse local scan history:', err)
    return DEFAULT_INITIAL_SCANS
  }
}

function saveLocalScanHistory(scan) {
  try {
    const existing = getLocalScanHistory()
    const filtered = existing.filter((item) => item.id !== scan.id && item.created_at !== scan.created_at)
    const updated = [scan, ...filtered].slice(0, 100)
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn('[data] Failed to save local scan history:', err)
  }
}


export async function listScanHistory(limit = 100) {
  let supabaseItems = []
  try {
    const { data, error } = await supabase
      .from('scan_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (!error && data) {
      supabaseItems = data.map(mapScan)
    }
  } catch (err) {
    console.warn('[data] listScanHistory Supabase notice:', err?.message || err)
  }

  const localItems = getLocalScanHistory()
  const combined = [...supabaseItems, ...localItems]

  const seen = new Set()
  const deduplicated = combined.filter((item) => {
    const key = item.id || `${item.created_at || item.created_date}-${item.input_content}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  deduplicated.sort((a, b) => new Date(b.created_at || b.created_date || 0) - new Date(a.created_at || a.created_date || 0))

  return deduplicated.slice(0, limit)
}

export async function createScanHistory(payload) {
  const localScan = mapScan({
    id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    created_at: new Date().toISOString(),
    created_date: new Date().toISOString(),
    scan_type: payload.scan_type || 'message',
    input_content: payload.input_content || '',
    fraud_score: payload.fraud_score || 0,
    risk_level: payload.risk_level || 'safe',
    ai_analysis: payload.ai_analysis || payload.analysis || '',
    reasons: payload.reasons || [],
    source: payload.source || 'web',
    metadata: payload.metadata || {},
  })

  saveLocalScanHistory(localScan)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ghostnet_new_threat', { detail: localScan }))
  }

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

    if (!error && data) {
      const serverScan = mapScan(data)
      saveLocalScanHistory(serverScan)
      return serverScan
    }
  } catch (err) {
    console.warn('[data] createScanHistory Supabase notice:', err?.message || err)
  }

  return localScan
}

const LOCAL_REPORTS_KEY = 'ghostnet_scam_reports'

const DEFAULT_INITIAL_SCAM_REPORTS = [
  {
    id: 'report-seed-1',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    created_date: new Date(Date.now() - 3600000 * 1).toISOString(),
    report_type: 'message',
    scam_content: 'URGENT: Your Electricity power supply will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer 9876543210 immediately.',
    region: 'Bengaluru, KA',
    fraud_score: 94,
    risk_level: 'scam',
    threat_category: 'Electricity Bill Disconnection Trap',
    status: 'verified',
  },
  {
    id: 'report-seed-2',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    created_date: new Date(Date.now() - 3600000 * 4).toISOString(),
    report_type: 'link',
    scam_content: 'http://sbi-yono-kyc-auth.com/login.php',
    region: 'Mumbai, MH',
    fraud_score: 96,
    risk_level: 'scam',
    threat_category: 'Banking Credential Harvester',
    status: 'verified',
  },
  {
    id: 'report-seed-3',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    created_date: new Date(Date.now() - 3600000 * 12).toISOString(),
    report_type: 'phone',
    scam_content: '+91-9123456789 - Impersonating Bank Fraud Department demanding OTP for card cancellation.',
    region: 'Delhi-NCR',
    fraud_score: 91,
    risk_level: 'scam',
    threat_category: 'Vishing Voice Coercion',
    status: 'verified',
  },
  {
    id: 'report-seed-4',
    created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
    created_date: new Date(Date.now() - 3600000 * 20).toISOString(),
    report_type: 'qr',
    scam_content: 'Reverse-charge UPI payment QR code disguised as ₹5,000 cashback reward.',
    region: 'Hyderabad, TS',
    fraud_score: 89,
    risk_level: 'scam',
    threat_category: 'UPI Cashback Reverse Trap',
    status: 'verified',
  },
  {
    id: 'report-seed-5',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    created_date: new Date(Date.now() - 3600000 * 36).toISOString(),
    report_type: 'screenshot',
    scam_content: 'Fake Paytm transaction screenshot claiming ₹12,500 transferred to merchant.',
    region: 'Pune, MH',
    fraud_score: 87,
    risk_level: 'scam',
    threat_category: 'Fake Payment Screenshot Deception',
    status: 'verified',
  },
]

function getLocalScamReports() {
  try {
    const raw = localStorage.getItem(LOCAL_REPORTS_KEY)
    if (!raw) {
      localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(DEFAULT_INITIAL_SCAM_REPORTS))
      return DEFAULT_INITIAL_SCAM_REPORTS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_INITIAL_SCAM_REPORTS
  } catch (err) {
    console.warn('[data] Failed to parse local scam reports:', err)
    return DEFAULT_INITIAL_SCAM_REPORTS
  }
}

function saveLocalScamReport(report) {
  try {
    const existing = getLocalScamReports()
    const filtered = existing.filter((item) => item.id !== report.id)
    const updated = [report, ...filtered].slice(0, 100)
    localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn('[data] Failed to save local scam report:', err)
  }
}

export async function listScamReports(limit = 100) {
  let supabaseItems = []
  try {
    const { data, error } = await supabase
      .from('scam_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (!error && data) {
      supabaseItems = data.map(mapReport)
    }
  } catch (err) {
    console.warn('[data] listScamReports Supabase notice:', err?.message || err)
  }

  const localItems = getLocalScamReports()
  const combined = [...supabaseItems, ...localItems]

  const seen = new Set()
  const deduplicated = combined.filter((item) => {
    const key = item.id || `${item.created_at || item.created_date}-${item.scam_content}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  deduplicated.sort((a, b) => new Date(b.created_at || b.created_date || 0) - new Date(a.created_at || a.created_date || 0))

  return deduplicated.slice(0, limit)
}

export async function createScamReport(payload) {
  const localReport = mapReport({
    id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    created_at: new Date().toISOString(),
    created_date: new Date().toISOString(),
    report_type: payload.report_type || 'message',
    scam_content: payload.scam_content || '',
    phone_number: payload.phone_number || null,
    url: payload.url || null,
    region: payload.region || 'Global',
    fraud_score: payload.fraud_score || 85,
    ai_analysis: payload.ai_analysis || '',
    risk_level: payload.risk_level || 'scam',
    status: payload.status || 'verified',
  })

  saveLocalScamReport(localReport)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ghostnet_new_threat', { detail: localReport }))
  }

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

    if (!error && data) {
      const serverReport = mapReport(data)
      saveLocalScamReport(serverReport)
      return serverReport
    }
  } catch (err) {
    console.warn('[data] createScamReport Supabase notice:', err?.message || err)
  }

  return localReport
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
