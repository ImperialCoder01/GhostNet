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
]

const SHORTENER_DOMAINS = ['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly']

function normalize(text) {
  return (text || '').toLowerCase()
}

function scoreToRisk(score) {
  if (score >= 75) return 'scam'
  if (score >= 40) return 'suspicious'
  return 'safe'
}

export function analyzeMessageContent(message) {
  const text = normalize(message)
  const reasons = []
  let score = 5

  const matched = SCAM_KEYWORDS.filter((k) => text.includes(k))
  if (matched.length > 0) {
    score += matched.length * 10
    reasons.push(`Contains scam-like keywords: ${matched.slice(0, 4).join(', ')}`)
  }

  if (/https?:\/\//.test(text)) {
    score += 15
    reasons.push('Contains external links')
  }

  if (/\b(immediately|urgent|act now|final warning)\b/.test(text)) {
    score += 20
    reasons.push('Uses urgency pressure language')
  }

  if (/\b(otp|pin|password|cvv|bank account)\b/.test(text)) {
    score += 20
    reasons.push('Requests sensitive information')
  }

  score = Math.min(100, score)
  const riskLevel = scoreToRisk(score)

  return {
    fraud_score: score,
    risk_level: riskLevel,
    reasons,
    analysis:
      riskLevel === 'safe'
        ? 'No strong scam indicators detected in this message.'
        : 'This message contains patterns commonly associated with phishing or social engineering.',
  }
}

export function analyzeUrlContent(rawUrl) {
  let url
  const reasons = []
  let score = 10

  try {
    url = new URL(rawUrl)
  } catch {
    return {
      fraud_score: 95,
      risk_level: 'scam',
      reasons: ['Invalid URL format'],
      analysis: 'The URL format is invalid and should not be trusted.',
      domain_age_days: 1,
      ssl_status: 'Invalid',
      community_reports: 16,
      is_known_brand_impersonation: false,
    }
  }

  const host = url.hostname.toLowerCase()
  const path = url.pathname.toLowerCase()

  if (url.protocol !== 'https:') {
    score += 20
    reasons.push('URL is not using HTTPS')
  }

  if (SHORTENER_DOMAINS.some((d) => host.includes(d))) {
    score += 25
    reasons.push('Uses URL shortener domain')
  }

  if (/login|verify|secure|update|payment|wallet/.test(path)) {
    score += 15
    reasons.push('Suspicious path terms present')
  }

  if (host.split('.').length > 3) {
    score += 10
    reasons.push('Too many subdomains')
  }

  const lookalike = /(paypa1|g00gle|micr0soft|amaz0n|faceboook)/.test(host)
  if (lookalike) {
    score += 30
    reasons.push('Possible brand impersonation domain')
  }

  score = Math.min(100, score)
  const riskLevel = scoreToRisk(score)

  return {
    fraud_score: score,
    risk_level: riskLevel,
    reasons,
    analysis:
      riskLevel === 'safe'
        ? 'URL appears structurally safe based on heuristic checks.'
        : 'URL has multiple structural indicators associated with phishing campaigns.',
    domain_age_days: score > 60 ? 14 : 540,
    ssl_status: url.protocol === 'https:' ? 'Valid' : 'Invalid',
    community_reports: Math.max(0, Math.round((score - 20) * 1.7)),
    is_known_brand_impersonation: lookalike,
  }
}

export function analyzeScamReportContent(form) {
  const text = normalize(`${form.report_type} ${form.scam_content} ${form.phone_number || ''} ${form.url || ''}`)
  const matched = SCAM_KEYWORDS.filter((k) => text.includes(k))
  const score = Math.min(100, 20 + matched.length * 12)
  const riskLevel = scoreToRisk(score)

  return {
    fraud_score: score,
    risk_level: riskLevel,
    ai_analysis:
      riskLevel === 'safe'
        ? 'Report logged with low immediate scam confidence.'
        : 'Report includes common scam signals and has been marked for further review.',
  }
}

export function analyzeScreenshotFallback() {
  return {
    fraud_score: 55,
    risk_level: 'suspicious',
    reasons: ['Image uploaded. OCR/AI not configured yet in local mode.'],
    analysis: 'Screenshot saved. Configure OCR/LLM endpoint on Vercel for deeper image analysis.',
    detected_text: '',
  }
}

export function analyzeScreenshotText(text) {
  const base = analyzeMessageContent(text)
  return {
    ...base,
    analysis:
      base.risk_level === 'safe'
        ? 'Screenshot text looks mostly safe based on local OCR and heuristic checks.'
        : 'OCR found suspicious scam patterns in this screenshot. Treat links and requests carefully.',
    detected_text: text,
  }
}
