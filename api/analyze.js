import {
  analyzeMessageContent,
  analyzeUrlContent,
  analyzeScamReportContent,
  analyzeScreenshotFallback,
  extractAttackSignals,
  reconstructAttackChain,
  inferAttackerIntent,
  findSimilarScams,
  scoreToRisk,
  normalize,
} from '../src/lib/scanner.js'

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
  const score = Math.max(0, Math.min(100, Number(parsed.fraud_score || 0)))
  const risk = ['safe', 'suspicious', 'scam'].includes(parsed.risk_level) ? parsed.risk_level : scoreToRisk(score)
  
  return {
    fraud_score: score,
    risk_level: risk,
    confidence: parsed.confidence || (score > 70 ? 'high' : 'medium'),
    reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map((r) => String(r)) : [],
    analysis: String(parsed.analysis || parsed.ai_analysis || ''),
    ai_analysis: String(parsed.ai_analysis || parsed.analysis || ''),
    detected_text: String(parsed.detected_text || ''),
    attack_intent: parsed.attack_intent || inferAttackerIntent(parsed.detected_text || '', '', risk),
    threat_reconstruction: reconstructAttackChain(parsed.detected_text || 'Screenshot image analysis', '', risk)
  }
}

const GROQ_MODELS = ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b']

async function analyzeWithGroq(type, payload) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  let prompt = ''
  if (type === 'message') {
    prompt = `You are GhostNet AI, an elite cybersecurity fraud and phishing detection engine.
Analyze this message for social engineering, phishing, urgency, financial fraud, impersonation, credential harvesting, or coercion.

Message:
"""${payload?.message || ''}"""

Return STRICT JSON only with keys:
- fraud_score (number 0-100)
- risk_level ("safe" | "suspicious" | "scam")
- confidence ("low" | "medium" | "high")
- reasons (array of specific evidence strings)
- analysis (clear, professional explanation of why this is or isn't a scam)
- attack_intent (plain-English summary of what the attacker is attempting to accomplish)
- signals (object with keys: urgency, financial, credential, impersonation, coercion - short string or null for each)`
  } else if (type === 'link') {
    prompt = `You are GhostNet AI, an elite cybersecurity URL and domain inspection engine.
Analyze this URL for phishing, typosquatting, lookalike domains, credential harvesting, or deceptive redirects.

URL:
"""${payload?.url || ''}"""

Return STRICT JSON only with keys:
- fraud_score (number 0-100)
- risk_level ("safe" | "suspicious" | "scam")
- confidence ("low" | "medium" | "high")
- reasons (array of specific evidence strings)
- analysis (clear, professional explanation of the domain threat)
- attack_intent (plain-English summary of what the attacker wants)
- impersonated_brand (string of brand being mimicked, or null)`
  } else if (type === 'report') {
    prompt = `Analyze this community scam report for threat validation:
Content: "${payload?.scam_content || ''}"
Type: "${payload?.report_type || ''}"
URL: "${payload?.url || ''}"
Phone: "${payload?.phone_number || ''}"

Return STRICT JSON only with keys:
- fraud_score (number 0-100)
- risk_level ("safe" | "suspicious" | "scam")
- ai_analysis (summary explanation of threat pattern)`
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
              content: 'You are GhostNet AI. Always respond in strict, valid JSON format only.',
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
        const risk = ['safe', 'suspicious', 'scam'].includes(parsed.risk_level) ? parsed.risk_level : scoreToRisk(score)
        const contentStr = type === 'message' ? payload.message : (payload.url || '')
        
        return {
          fraud_score: score,
          risk_level: risk,
          confidence: parsed.confidence || (score > 70 ? 'high' : 'medium'),
          reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map((r) => String(r)) : [],
          analysis: String(parsed.analysis || parsed.ai_analysis || ''),
          ai_analysis: String(parsed.ai_analysis || parsed.analysis || ''),
          attack_intent: String(parsed.attack_intent || inferAttackerIntent(contentStr, '', risk)),
          signals: parsed.signals || extractAttackSignals(contentStr),
          threat_reconstruction: reconstructAttackChain(contentStr, type === 'link' ? payload.url : '', risk),
          similar_patterns: findSimilarScams(contentStr),
          emergency_actions: {
            stop: 'Do NOT click any links, enter PINs, or share verification codes.',
            verify: 'Call the organization using their known official hotline.',
            report: 'Record this threat in the GhostNet community database.',
            secure: 'Freeze affected cards or rotate credentials immediately if compromised.'
          }
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

    const prompt = `Analyze this screenshot for cyber scam, phishing, brand impersonation, urgency manipulation, payment fraud, QR code traps, or social engineering.
Return strict JSON only with keys:
- fraud_score (number 0-100)
- risk_level (safe|suspicious|scam)
- confidence (low|medium|high)
- reasons (array of specific visual and textual evidence strings)
- analysis (professional summary of the visual threat)
- detected_text (all OCR extracted text from the image)
- attack_intent (what the fraudster is attempting to achieve)`

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
            content: 'You are GhostNet AI vision detector. Output strict JSON with keys fraud_score, risk_level, reasons, analysis, detected_text, attack_intent.',
          },
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this screenshot for phishing, fraud, fake branding, or urgency.' },
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

  try {
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
      const base = analyzeUrlContent(payload?.url || '')
      if (groq) {
        res.status(200).json({
          ...base,
          ...groq,
          trust_profile: base.trust_profile,
          simulation_steps: base.simulation_steps,
        })
        return
      }
      res.status(200).json(base)
      return
    }

    if (type === 'report') {
      const groq = await analyzeWithGroq(type, payload)
      if (groq) {
        res.status(200).json(groq)
        return
      }
      res.status(200).json(analyzeScamReportContent(payload || {}))
      return
    }

    if (type === 'screenshot') {
      const ai =
        (await analyzeScreenshotWithGemini(payload?.screenshot_url)) ||
        (await analyzeScreenshotWithOpenAI(payload?.screenshot_url))
      res.status(200).json(ai || analyzeScreenshotFallback())
      return
    }

    res.status(400).json({ error: 'Unsupported analysis type' })
  } catch (error) {
    console.error('[GhostNet API Error]', error)
    res.status(500).json({
      error: 'Analysis could not be completed at this time.',
      fallback: analyzeMessageContent(payload?.message || '')
    })
  }
}
