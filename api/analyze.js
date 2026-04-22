// @ts-nocheck
import {
  analyzeMessageContent,
  analyzeScamReportContent,
  analyzeScreenshotFallback,
  analyzeUrlContent,
  normalizeModelAnalysis,
  parseModelJson,
} from '../src/lib/scanner.js'

function getFallback(type, payload, reason) {
  if (type === 'message') return analyzeMessageContent(payload?.message || '')
  if (type === 'link') return analyzeUrlContent(payload?.url || '')
  if (type === 'report') return analyzeScamReportContent(payload || {})
  if (type === 'screenshot') return analyzeScreenshotFallback(reason)
  return null
}

function buildPrompt(type, payload) {
  if (type === 'message') {
    return `Analyze the following message for phishing, impersonation, payment fraud, credential harvesting, coercion, urgency, or scam behavior.
Return strict JSON only with keys:
- fraud_score (number 0-100)
- risk_level (safe|suspicious|scam)
- confidence (low|medium|high)
- reasons (array of strings)
- analysis (string)
- summary (string)
- issue_breakdown (array of objects with title, detail, severity)
- next_steps (array of strings)
- supporting_links (array of objects with label, url, description)
- extracted_links (array of objects with label, url)
- detected_entities (array of strings)
- technical_findings (array of objects with label, value, tone)
- detected_text (string)

Message:
"""${payload?.message || ''}"""`
  }

  if (type === 'link') {
    return `Analyze the following URL for phishing, impersonation, malicious redirects, unsafe payment prompts, or social engineering.
Return strict JSON only with keys:
- fraud_score (number 0-100)
- risk_level (safe|suspicious|scam)
- confidence (low|medium|high)
- reasons (array of strings)
- analysis (string)
- summary (string)
- issue_breakdown (array of objects with title, detail, severity)
- next_steps (array of strings)
- supporting_links (array of objects with label, url, description)
- extracted_links (array of objects with label, url)
- detected_entities (array of strings)
- technical_findings (array of objects with label, value, tone)
- detected_text (string)

URL:
"""${payload?.url || ''}"""`
  }

  if (type === 'screenshot') {
    return `Analyze this screenshot for phishing, impersonation, urgency pressure, scam messaging, payment fraud, brand spoofing, or malicious links.
Return strict JSON only with keys:
- fraud_score (number 0-100)
- risk_level (safe|suspicious|scam)
- confidence (low|medium|high)
- reasons (array of strings)
- analysis (string)
- summary (string)
- issue_breakdown (array of objects with title, detail, severity)
- next_steps (array of strings)
- supporting_links (array of objects with label, url, description)
- extracted_links (array of objects with label, url)
- detected_entities (array of strings)
- technical_findings (array of objects with label, value, tone)
- detected_text (string)`
  }

  return ''
}

async function analyzeWithOpenAI(type, payload, fallback) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return { result: null, reason: 'OpenAI API key not configured.' }

  const messages = [
    {
      role: 'system',
      content:
        'You are a scam detection assistant. Output strict JSON only. Be precise, concise, and practical. Do not wrap the JSON in markdown.',
    },
  ]

  if (type === 'screenshot') {
    if (!payload?.screenshot_url) return { result: null, reason: 'Screenshot URL missing for image analysis.' }

    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: buildPrompt(type, payload) },
        { type: 'image_url', image_url: { url: payload.screenshot_url } },
      ],
    })
  } else {
    messages.push({
      role: 'user',
      content: buildPrompt(type, payload),
    })
  }

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
        messages,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      return { result: null, reason: `OpenAI vision request failed (${response.status}). ${text || 'No details returned.'}` }
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    return { result: normalizeModelAnalysis(parseModelJson(content), fallback), reason: null }
  } catch (error) {
    return { result: null, reason: `OpenAI vision request failed. ${error?.message || 'Unknown error.'}` }
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const GEMINI_MODELS = [
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
]

async function callGeminiModel(model, apiKey, parts) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      }),
    }
  )
  return response
}

async function analyzeWithGemini(type, payload, fallback) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return { result: null, reason: 'Gemini API key not configured.' }

  try {
    const parts = [{ text: buildPrompt(type, payload) }]

    if (type === 'screenshot') {
      if (!payload?.screenshot_url) return { result: null, reason: 'Screenshot URL missing for image analysis.' }

      const imageResp = await fetch(payload.screenshot_url)
      if (!imageResp.ok) {
        return { result: null, reason: 'Could not fetch the uploaded screenshot.' }
      }

      const contentType = imageResp.headers.get('content-type') || 'image/png'
      const arrayBuffer = await imageResp.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')

      parts.push({
        inline_data: {
          mime_type: contentType,
          data: base64,
        },
      })
    }

    // Try each model in order; retry once with a delay on 429
    for (const model of GEMINI_MODELS) {
      let response = await callGeminiModel(model, apiKey, parts)

      // On rate limit, wait and retry once with the same model
      if (response.status === 429) {
        console.log(`[GhostNet] ${model} rate-limited, retrying in 12s...`)
        await delay(12000)
        response = await callGeminiModel(model, apiKey, parts)
      }

      // Still failing? try the next model
      if (response.status === 429) {
        console.log(`[GhostNet] ${model} still rate-limited, trying next model...`)
        continue
      }

      if (!response.ok) {
        console.log(`[GhostNet] ${model} returned ${response.status}, trying next model...`)
        continue
      }

      const data = await response.json()
      const text = data?.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join(' ') || ''
      const parsed = parseModelJson(text)

      if (parsed) {
        return { result: normalizeModelAnalysis(parsed, fallback), reason: null }
      }
    }

    // All models exhausted
    return { result: null, reason: 'AI analysis is temporarily unavailable. The scan used local heuristics instead.' }
  } catch (error) {
    console.error('[GhostNet] Gemini error:', error?.message)
    return { result: null, reason: 'AI analysis encountered an error. The scan used local heuristics instead.' }
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
  const fallback = getFallback(type, payload)

  if (!type || !fallback) {
    res.status(400).json({ error: 'Unsupported analysis type' })
    return
  }

  if (type === 'report') {
    res.status(200).json(fallback)
    return
  }

  const gemini = await analyzeWithGemini(type, payload, fallback)
  if (gemini.result) {
    res.status(200).json(gemini.result)
    return
  }

  const openai = await analyzeWithOpenAI(type, payload, fallback)
  if (openai.result) {
    res.status(200).json(openai.result)
    return
  }

  const reason =
    type === 'screenshot'
      ? gemini.reason || openai.reason || 'Vision provider unavailable for screenshot analysis.'
      : null

  res.status(200).json(getFallback(type, payload, reason))
}
