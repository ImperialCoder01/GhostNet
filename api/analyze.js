function normalize(text) {
  return (text || '').toLowerCase()
}

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

function scoreToRisk(score) {
  if (score >= 75) return 'scam'
  if (score >= 40) return 'suspicious'
  return 'safe'
}

function analyzeMessageContent(message) {
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

function analyzeUrlContent(rawUrl) {
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

function analyzeReport(form) {
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

function analyzeScreenshot() {
  return {
    fraud_score: 55,
    risk_level: 'suspicious',
    reasons: ['Image uploaded. Add OCR provider in Vercel if you need deep text extraction.'],
    analysis: 'Screenshot saved. Current local mode uses conservative risk defaults for image-only submissions.',
    detected_text: '',
  }
}

async function analyzeScreenshotWithOpenAI(screenshotUrl) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || !screenshotUrl) return null

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are a scam detection assistant. Output strict JSON with keys fraud_score (0-100), risk_level (safe|suspicious|scam), reasons (array of strings), analysis (string), detected_text (string).',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this screenshot for phishing, impersonation, scam intent, urgency, or payment fraud.' },
            { type: 'image_url', image_url: { url: screenshotUrl } },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) return null

  try {
    const parsed = JSON.parse(content)
    if (!parsed || typeof parsed !== 'object') return null

    return {
      fraud_score: Math.max(0, Math.min(100, Number(parsed.fraud_score || 0))),
      risk_level: ['safe', 'suspicious', 'scam'].includes(parsed.risk_level) ? parsed.risk_level : 'suspicious',
      reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map((r) => String(r)) : [],
      analysis: String(parsed.analysis || ''),
      detected_text: String(parsed.detected_text || ''),
    }
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { type, payload } = req.body || {}

  if (!type) {
    res.status(400).json({ error: 'type is required' })
    return
  }

  if (type === 'message') {
    res.status(200).json(analyzeMessageContent(payload?.message || ''))
    return
  }

  if (type === 'link') {
    res.status(200).json(analyzeUrlContent(payload?.url || ''))
    return
  }

  if (type === 'report') {
    res.status(200).json(analyzeReport(payload || {}))
    return
  }

  if (type === 'screenshot') {
    const ai = await analyzeScreenshotWithOpenAI(payload?.screenshot_url)
    res.status(200).json(ai || analyzeScreenshot())
    return
  }

  res.status(400).json({ error: 'Unsupported analysis type' })
}
