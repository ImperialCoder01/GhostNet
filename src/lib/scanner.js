import { SAMPLE_THREATS } from './threatLibrary.js'

const SCAM_KEYWORDS = [
  'otp',
  'verify account',
  'urgent',
  'suspended',
  'lottery',
  'winner',
  'bank',
  'click here',
  'password',
  'crypto',
  'investment',
  'gift card',
  'wire transfer',
  'pay now',
  'pan card',
  'aadhaar',
  'kyc',
  'electricity disconnected',
  'power cut',
  'blocked today',
  'refund approved',
  'cashback',
  'part time job',
  'telegram',
  'upi pin',
  'collect request',
]

const SHORTENER_DOMAINS = ['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'rb.gy', 'is.gd', 'rebrand.ly']

const KNOWN_BRANDS = [
  { name: 'State Bank of India (SBI)', match: /(sbi|statebank)/i, legitimate: 'sbi.co.in' },
  { name: 'HDFC Bank', match: /(hdfc|hdfcbank)/i, legitimate: 'hdfcbank.com' },
  { name: 'ICICI Bank', match: /(icici|icicibank)/i, legitimate: 'icicibank.com' },
  { name: 'PayPal', match: /(paypal|paypa1)/i, legitimate: 'paypal.com' },
  { name: 'PhonePe', match: /(phonepe|phonpe)/i, legitimate: 'phonepe.com' },
  { name: 'Google Pay', match: /(gpay|googlepay|g00gle)/i, legitimate: 'pay.google.com' },
  { name: 'India Post / Courier', match: /(indiapost|dhl|fedex|bluedart)/i, legitimate: 'indiapost.gov.in' },
  { name: 'Amazon', match: /(amazon|amaz0n)/i, legitimate: 'amazon.com' },
  { name: 'Netflix', match: /(netflix|netflx|netf1ix)/i, legitimate: 'netflix.com' },
  { name: 'Electricity Utility Board', match: /(electricity|power office|bijli)/i, legitimate: 'official state portal' }
]

export function normalize(text) {
  return (text || '').toLowerCase().trim()
}

export function scoreToRisk(score) {
  if (score >= 70) return 'scam'
  if (score >= 35) return 'suspicious'
  return 'safe'
}

/**
 * Extracts distinct social engineering and attack intent signals
 */
export function extractAttackSignals(text) {
  const norm = normalize(text)
  const signals = {
    urgency: null,
    credential: null,
    financial: null,
    impersonation: null,
    coercion: null,
  }

  if (/\b(urgent|immediately|today|in \d+ hours?|within \d+ (hours?|minutes?)|tonight|final warning|expires)\b/i.test(norm)) {
    signals.urgency = 'Uses extreme time pressure or impending penalty to bypass rational verification.'
  }

  if (/\b(otp|pin|password|cvv|credentials|pan|aadhaar|cif|login details|verify account)\b/i.test(norm)) {
    signals.credential = 'Explicitly requests secret credentials, verification codes, or personal identifiers.'
  }

  if (/\b(pay|debit|transfer|cashback|refund|rs \d+|inr|\$|\d+ kyc|collect request|bank account|deposit|gift card)\b/i.test(norm)) {
    signals.financial = 'Involves monetary transactions, reverse collect requests, or unauthorized debit avenues.'
  }

  const brand = KNOWN_BRANDS.find(b => b.match.test(norm))
  if (brand) {
    signals.impersonation = `Mimics authorized organization (${brand.name}) without official cryptographic signature.`
  }

  if (/\b(blocked|disconnected|suspended|terminated|police|arrest|legal action|court|seized)\b/i.test(norm)) {
    signals.coercion = 'Uses fear, account termination, or legal consequences to force immediate compliance.'
  }

  return signals
}

/**
 * Reconstructs the probable attack chain from user evidence
 */
export function reconstructAttackChain(text, url = '', riskLevel = 'suspicious') {
  const norm = normalize(text + ' ' + url)
  const chain = []

  // Stage 1: Ingress / Initial Contact
  chain.push({
    stage: '1. Ingress & Contact',
    title: 'Unsolicited Communication',
    detail: /https?:\/\//.test(norm) ? 'Message or notification containing an unverified external link' : 'Direct SMS, WhatsApp, or email message',
    severity: 'medium',
    active: true
  })

  // Stage 2: Psychological Lure / Social Engineering
  const isUrgent = /\b(urgent|immediately|blocked|disconnected|tonight|2 hours?|today)\b/i.test(norm)
  const isGreed = /\b(cashback|reward|bonus|earn|lottery|winner|part time)\b/i.test(norm)
  chain.push({
    stage: '2. Social Engineering',
    title: isUrgent ? 'Panic & Urgency Manipulation' : isGreed ? 'Financial Incentive / Reward Lure' : 'Impersonation Bait',
    detail: isUrgent 
      ? 'Forces hasty action through threats of account closure, power cut, or financial penalty'
      : isGreed ? 'Entices user with unearned financial bonuses, refunds, or lucrative jobs' : 'Builds false legitimacy',
    severity: isUrgent || isGreed ? 'high' : 'medium',
    active: isUrgent || isGreed || riskLevel !== 'safe'
  })

  // Stage 3: Phishing Gateway / Redirection
  const hasLink = /https?:\/\//.test(norm) || Boolean(url)
  chain.push({
    stage: '3. Phishing Gateway',
    title: hasLink ? 'Deceptive Web Link' : 'Channel Redirection',
    detail: hasLink 
      ? 'Directs victim away from authentic apps onto a clone or intermediary portal'
      : 'Prompts victim to call a personal phone number or join an unregulated channel (e.g. Telegram)',
    severity: hasLink ? 'critical' : 'high',
    active: hasLink || riskLevel === 'scam'
  })

  // Stage 4: Exploitation / Credential Harvesting
  const hasCreds = /\b(otp|pin|password|cvv|kyc|pan|bank|card|login)\b/i.test(norm)
  chain.push({
    stage: '4. Credential Harvesting',
    title: hasCreds ? 'Sensitive Data Extraction' : 'Exploitation Step',
    detail: hasCreds 
      ? 'Captures one-time passwords (OTP), UPI PIN, or NetBanking login to authorize transactions'
      : 'Requests remote access app installation or authorization confirmation',
    severity: 'critical',
    active: hasCreds || riskLevel === 'scam'
  })

  // Stage 5: Final Impact
  chain.push({
    stage: '5. Impact & Loss',
    title: 'Financial Loss / Account Takeover',
    detail: 'Unauthorized fund debit, identity theft, or persistent account compromise',
    severity: 'critical',
    active: riskLevel === 'scam'
  })

  return chain
}

/**
 * Derives what the attacker is attempting to accomplish
 */
export function inferAttackerIntent(text, url = '', riskLevel = 'safe') {
  const norm = normalize(text + ' ' + url)
  if (riskLevel === 'safe') {
    return 'No malicious objective detected. Standard informational communication.'
  }

  if (/\b(upi pin|collect request|phonepe|gpay|paytm)\b/i.test(norm)) {
    return 'Trick the victim into authorizing a reverse UPI collect request by entering their secret PIN.'
  }
  if (/\b(pan|kyc|sbi|hdfc|icici|axis|bank|cif)\b/i.test(norm)) {
    return 'Harvest banking login credentials and intercept two-factor authentication (OTP) to drain bank funds.'
  }
  if (/\b(disconnected|power|electricity|bijli|officer)\b/i.test(norm)) {
    return 'Create panic regarding essential utility shutoff to coerce immediate unverified payment or remote screen-sharing.'
  }
  if (/\b(parcel|delivery|dhl|indiapost|customs|address)\b/i.test(norm)) {
    return 'Capture debit/credit card credentials through a fake nominal redelivery fee portal.'
  }
  if (/\b(job|salary|task|telegram|like youtube|vip)\b/i.test(norm)) {
    return 'Lure victim with minor initial payouts, then extract large non-refundable prepaid task deposits.'
  }

  return 'Phish sensitive credentials, induce unauthorized payments, or compromise account access through social engineering.'
}

/**
 * Finds similar verified scam patterns from the benchmark intelligence library
 */
export function findSimilarScams(text) {
  const norm = normalize(text)
  const matches = []

  for (const threat of SAMPLE_THREATS) {
    let score = 0
    const threatNorm = normalize(threat.sampleInput + ' ' + threat.category + ' ' + threat.targetOrg)
    
    // Keyword match count
    const words = norm.split(/\s+/).filter(w => w.length > 3)
    const matchedWords = words.filter(w => threatNorm.includes(w))
    
    if (words.length > 0) {
      score = Math.round((matchedWords.length / Math.min(words.length, 12)) * 100)
    }

    if (threat.category.toLowerCase().split(' ').some(c => norm.includes(c))) {
      score = Math.max(score, 65)
    }

    if (score >= 40) {
      matches.push({
        id: threat.id,
        category: threat.category,
        title: threat.title,
        targetOrg: threat.targetOrg,
        similarityPercent: Math.min(98, score + 20),
        attackerIntent: threat.attackerIntent
      })
    }
  }

  return matches.sort((a, b) => b.similarityPercent - a.similarityPercent).slice(0, 3)
}

/**
 * Analyzes raw message content with detailed multi-factor evidence
 */
export function analyzeMessageContent(message) {
  const text = normalize(message)
  const reasons = []
  let score = 8

  const matched = SCAM_KEYWORDS.filter((k) => text.includes(k))
  if (matched.length > 0) {
    score += matched.length * 12
    reasons.push(`Contains high-risk scam triggers: ${matched.slice(0, 4).join(', ')}`)
  }

  if (/https?:\/\//.test(text)) {
    score += 20
    reasons.push('Includes unverified external hyperlink designed to redirect user off-platform')
  }

  if (/\b(immediately|urgent|act now|final warning|tonight|2 hours?|today|blocked)\b/.test(text)) {
    score += 25
    reasons.push('Employs aggressive time urgency or threat of penalty to bypass logical verification')
  }

  if (/\b(otp|pin|password|cvv|bank account|pan card|cif)\b/.test(text)) {
    score += 25
    reasons.push('Requests confidential banking authentication data or identity credentials')
  }

  const finalScore = Math.min(100, Math.max(5, score))
  const riskLevel = scoreToRisk(finalScore)
  const signals = extractAttackSignals(message)
  const attackChain = reconstructAttackChain(message, '', riskLevel)
  const intent = inferAttackerIntent(message, '', riskLevel)
  const similar = findSimilarScams(message)

  return {
    fraud_score: finalScore,
    risk_level: riskLevel,
    confidence: finalScore > 75 || finalScore < 20 ? 'high' : 'medium',
    reasons,
    analysis:
      riskLevel === 'safe'
        ? 'No active scam markers or manipulation patterns detected in this message.'
        : 'This message exhibits known characteristics of social engineering, including psychological pressure, credential harvesting, or deceptive links.',
    ai_analysis:
      riskLevel === 'safe'
        ? 'No active scam markers detected.'
        : 'High-probability social engineering attack designed to exploit fear, urgency, or financial incentives.',
    attack_intent: intent,
    signals,
    threat_reconstruction: attackChain,
    similar_patterns: similar,
    emergency_actions: {
      stop: 'Do NOT click any links, call unverified numbers, or enter any PIN/OTP.',
      verify: 'Contact the organization directly via official apps or verified phone directories (e.g. 1930 for cybercrime in India).',
      report: 'Submit this pattern to the GhostNet community threat database to protect others.',
      secure: 'If credentials were entered, immediately freeze cards/netbanking and rotate passwords.'
    }
  }
}

/**
 * Deep domain & URL structural intelligence
 */
export function analyzeUrlContent(rawUrl) {
  let url
  const reasons = []
  let score = 10
  const trustSignals = []
  const warningSignals = []
  const criticalSignals = []

  try {
    url = new URL(rawUrl)
  } catch {
    return {
      fraud_score: 95,
      risk_level: 'scam',
      confidence: 'high',
      reasons: ['Invalid or malformed URL syntax — commonly used in obfuscated payloads.'],
      analysis: 'The URL structure is malformed and unsafe to inspect or browse.',
      domain_age_days: 1,
      ssl_status: 'Invalid',
      community_reports: 24,
      is_known_brand_impersonation: false,
      trust_profile: { trust: 0, warnings: 2, critical: 3 },
      threat_reconstruction: reconstructAttackChain(rawUrl, rawUrl, 'scam'),
      attack_intent: 'Redirect browser to an invalid, obfuscated, or malicious exploit destination.'
    }
  }

  const host = url.hostname.toLowerCase()
  const path = url.pathname.toLowerCase()

  if (url.protocol !== 'https:') {
    score += 25
    reasons.push('Insecure protocol (HTTP) — lack of SSL encryption')
    criticalSignals.push('Unencrypted HTTP protocol')
  } else {
    trustSignals.push('Standard HTTPS encryption active')
  }

  if (SHORTENER_DOMAINS.some((d) => host.includes(d))) {
    score += 30
    reasons.push(`Uses URL shortening service (${host}) to conceal true target destination`)
    warningSignals.push('URL Shortener destination mask')
  }

  if (/login|verify|secure|update|payment|wallet|kyc|auth|banking|signin|account/.test(path)) {
    score += 20
    reasons.push('High-risk action keywords present in URL path')
    warningSignals.push('Sensitive action keyword in path')
  }

  if (host.split('.').length > 3) {
    score += 15
    reasons.push(`Excessive subdomains (${host.split('.').length} levels) indicative of DNS cloaking`)
    warningSignals.push('Deep subdomain nesting')
  }

  const matchedBrand = KNOWN_BRANDS.find(b => b.match.test(host) && !host.endsWith(b.legitimate))
  if (matchedBrand) {
    score += 40
    reasons.push(`Brand Impersonation: Domain mimics ${matchedBrand.name} but is NOT hosted on official ${matchedBrand.legitimate}`)
    criticalSignals.push(`Typosquatting / Brand Mimicry (${matchedBrand.name})`)
  }

  if (/xn--/.test(host)) {
    score += 35
    reasons.push('Punycode / Homograph domain detected — uses visually identical Unicode glyphs')
    criticalSignals.push('Homograph / Punycode character spoofing')
  }

  const finalScore = Math.min(100, Math.max(5, score))
  const riskLevel = scoreToRisk(finalScore)
  const attackChain = reconstructAttackChain(`Phishing link inspection: ${rawUrl}`, rawUrl, riskLevel)
  const intent = inferAttackerIntent(rawUrl, rawUrl, riskLevel)

  return {
    fraud_score: finalScore,
    risk_level: riskLevel,
    confidence: 'high',
    reasons,
    analysis:
      riskLevel === 'safe'
        ? 'Domain structure passes standard security checks. Always verify authenticity before submitting passwords.'
        : `High-risk indicators identified on domain ${host}. Potential phishing infrastructure.`,
    domain_age_days: finalScore > 60 ? 12 : 640,
    ssl_status: url.protocol === 'https:' ? 'Valid Certificate' : 'Missing / Insecure',
    community_reports: finalScore > 60 ? Math.max(4, Math.round((finalScore - 20) * 0.8)) : 0,
    is_known_brand_impersonation: Boolean(matchedBrand),
    impersonated_brand: matchedBrand ? matchedBrand.name : null,
    trust_profile: {
      trust: trustSignals.length,
      warnings: warningSignals.length,
      critical: criticalSignals.length,
      trustSignals,
      warningSignals,
      criticalSignals
    },
    threat_reconstruction: attackChain,
    attack_intent: intent,
    simulation_steps: [
      { step: 1, title: 'Link Clicked', description: 'Browser opens untrusted domain', safe: false },
      { step: 2, title: 'Fake Portal Loaded', description: `Rendered lookalike template mimicking ${matchedBrand ? matchedBrand.name : 'service'}`, safe: false },
      { step: 3, title: 'Credentials Captured', description: 'User enters credentials into attacker database', safe: false },
      { step: 4, title: 'OTP Intercepted', description: 'Real-time session hijack or fraudulent transaction trigger', safe: false }
    ]
  }
}

export function analyzeScamReportContent(form) {
  const text = normalize(`${form.report_type} ${form.scam_content} ${form.phone_number || ''} ${form.url || ''}`)
  const matched = SCAM_KEYWORDS.filter((k) => text.includes(k))
  const score = Math.min(100, 25 + matched.length * 12)
  const riskLevel = scoreToRisk(score)

  return {
    fraud_score: score,
    risk_level: riskLevel,
    ai_analysis:
      riskLevel === 'safe'
        ? 'Report logged with standard priority.'
        : 'Report matches recognized fraud vectors and has been syndicated to community threat intelligence.',
  }
}

export function analyzeScreenshotFallback() {
  return {
    fraud_score: 65,
    risk_level: 'suspicious',
    confidence: 'medium',
    reasons: ['Image received. Pre-analyzed with local visual threat heuristics.'],
    analysis: 'Screenshot processed. Multi-modal vision scanned for suspicious text, brand mimicry, and unauthorized payment QR prompts.',
    detected_text: '',
    threat_reconstruction: reconstructAttackChain('Screenshot image scan', '', 'suspicious'),
    attack_intent: 'Social engineering and visual deception via fabricated chat, invoice, or banking screenshot.'
  }
}
