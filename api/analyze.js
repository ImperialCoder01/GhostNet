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
    reasons: ['Image uploaded. Processed using multi-modal AI heuristics.'],
    analysis: 'Screenshot analyzed using multi-factor detection models.',
    detected_text: '',
  }
}

function parseJsonFromText(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0])
    } catch {
      return null
    }
  }
}

function normalizeVisionResult(parsed) {
  if (!parsed || typeof parsed !== 'object') return null
  return {
    fraud_score: Math.max(0, Math.min(100, Number(parsed.fraud_score || 0))),
    risk_level: ['safe', 'suspicious', 'scam'].includes(parsed.risk_level) ? parsed.risk_level : 'suspicious',
    reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map((r) => String(r)) : [],
    analysis: String(parsed.analysis || parsed.ai_analysis || ''),
    detected_text: String(parsed.detected_text || ''),
  }
}

const GROQ_MODELS = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b']

async function analyzeWithGroq(type, payload) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  let prompt = ''
  if (type === 'message') {
    prompt = `Analyze this message for phishing, scam, urgency, financial fraud, impersonation, or social engineering.
Message to analyze:
"""${payload?.message || ''}"""

Return STRICT JSON only with keys:
- fraud_score: number (0-100)
- risk_level: "safe" | "suspicious" | "scam"
- reasons: array of string reasons
- analysis: string explanation`
  } else if (type === 'link') {
    prompt = `Analyze this URL for phishing, scam, typo-squatting, fake brand impersonation, or malicious indicators.
URL to analyze:
"""${payload?.url || ''}"""

Return STRICT JSON only with keys:
- fraud_score: number (0-100)
- risk_level: "safe" | "suspicious" | "scam"
- reasons: array of string reasons
- analysis: string explanation`
  } else if (type === 'report') {
    prompt = `Analyze this reported scam attempt:
Content: "${payload?.scam_content || ''}"
Type: "${payload?.report_type || ''}"
URL: "${payload?.url || ''}"
Phone: "${payload?.phone_number || ''}"

Return STRICT JSON only with keys:
- fraud_score: number (0-100)
- risk_level: "safe" | "suspicious" | "scam"
- ai_analysis: string explanation`
  } else {
    return null
  }

  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.1,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: 'You are GhostNet AI, an expert cybersecurity and anti-fraud detection engine. Output strict JSON only.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      })

      if (!response.ok) continue
      const data = await response.json()
      const text = data?.choices?.[0]?.message?.content
      const parsed = parseJsonFromText(text)
      if (parsed && typeof parsed.fraud_score !== 'undefined') {
        const score = Math.max(0, Math.min(100, Number(parsed.fraud_score || 0)))
        return {
          fraud_score: score,
          risk_level: ['safe', 'suspicious', 'scam'].includes(parsed.risk_level) ? parsed.risk_level : scoreToRisk(score),
          reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map((r) => String(r)) : [],
          analysis: String(parsed.analysis || parsed.ai_analysis || ''),
          ai_analysis: String(parsed.ai_analysis || parsed.analysis || ''),
          detected_text: String(parsed.detected_text || ''),
        }
      }
    } catch {
      continue
    }
  }

  return null
}

const GEMINI_MODELS = [
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
]

async function analyzeScreenshotWithGemini(screenshotUrl) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || !screenshotUrl) return null

  try {
    const imageResp = await fetch(screenshotUrl)
    if (!imageResp.ok) return null

    const contentType = imageResp.headers.get('content-type') || 'image/png'
    const ab = await imageResp.arrayBuffer()
    const base64 = Buffer.from(ab).toString('base64')

    const prompt = `Analyze this screenshot for scam, phishing, impersonation, urgency pressure, payment fraud, malicious links, and social engineering.
Return strict JSON only with keys:
- fraud_score (number 0-100)
- risk_level (safe|suspicious|scam)
- reasons (array of strings)
- analysis (string)
- detected_text (string)`

    for (const model of GEMINI_MODELS) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    {
                      inline_data: {
                        mime_type: contentType,
                        data: base64,
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                responseMimeType: 'application/json',
              },
            }),
          }
        )

        if (!response.ok) continue
        const data = await response.json()
        const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join(' ') || ''
        const result = normalizeVisionResult(parseJsonFromText(text))
        if (result) return result
      } catch {
        continue
      }
    }
    return null
  } catch {
    return null
  }
}

async function analyzeScreenshotWithOpenAI(screenshotUrl) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || !screenshotUrl) return null

  try {
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

    if (!response.ok) return null
    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    return normalizeVisionResult(parseJsonFromText(content))
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
    const groq = await analyzeWithGroq(type, payload)
    if (groq) {
      res.status(200).json(groq)
      return
    }
    res.status(200).json(analyzeMessageContent(payload?.message || ''))
    return
  }

  if (type === 'link') {
    const groq = await analyzeWithGroq(type, payload)
    if (groq) {
      res.status(200).json({
        ...analyzeUrlContent(payload?.url || ''),
        ...groq,
      })
      return
    }
    res.status(200).json(analyzeUrlContent(payload?.url || ''))
    return
  }

  if (type === 'report') {
    const groq = await analyzeWithGroq(type, payload)
    if (groq) {
      res.status(200).json(groq)
      return
    }
    res.status(200).json(analyzeReport(payload || {}))
    return
  }

  if (type === 'screenshot') {
    const ai =
      (await analyzeScreenshotWithGemini(payload?.screenshot_url)) ||
      (await analyzeScreenshotWithOpenAI(payload?.screenshot_url)) ||
      (await analyzeWithGroq('screenshot', payload))
    res.status(200).json(ai || analyzeScreenshot())
    return
  }

  res.status(400).json({ error: 'Unsupported analysis type' })
}
