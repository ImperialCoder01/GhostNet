import {
  analyzeMessageContent,
  analyzeScamReportContent,
  analyzeScreenshotFallback,
  analyzeUrlContent,
  scoreToRisk,
  inferAttackerIntent,
  extractAttackSignals,
  reconstructAttackChain,
  findSimilarScams,
  inferReasonCodes,
} from './scanner.js'
import { filterValidReasonCodes } from './reasonCodes.js'

function getGroqKey() {
  try {
    return localStorage.getItem('ghostnet_groq_api_key') || import.meta.env?.VITE_GROQ_API_KEY || ''
  } catch {
    return import.meta.env?.VITE_GROQ_API_KEY || ''
  }
}

function getGeminiKey() {
  try {
    return localStorage.getItem('ghostnet_gemini_api_key') || import.meta.env?.VITE_GEMINI_API_KEY || ''
  } catch {
    return import.meta.env?.VITE_GEMINI_API_KEY || ''
  }
}

async function analyzeWithClientGroq(type, payload) {
  const apiKey = getGroqKey()
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
- reasonCodes (array of string codes: URGENCY_LANGUAGE, IMPERSONATES_BRAND, REQUESTS_OTP, LOOKALIKE_DOMAIN, REQUESTS_PAYMENT)`
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
- reasonCodes (array of string codes: URGENCY_LANGUAGE, IMPERSONATES_BRAND, REQUESTS_OTP, LOOKALIKE_DOMAIN, REQUESTS_PAYMENT)`
  } else {
    return null
  }

  const models = ['llama-3.3-70b-versatile', 'llama3-70b-8192', 'mixtral-8x7b-32768']
  for (const model of models) {
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
            { role: 'system', content: 'You are GhostNet AI. Respond in strict JSON only.' },
            { role: 'user', content: prompt },
          ],
        }),
      })

      if (!response.ok) continue
      const data = await response.json()
      const text = data?.choices?.[0]?.message?.content
      if (!text) continue
      const parsed = JSON.parse(text)
      if (parsed && typeof parsed.fraud_score !== 'undefined') {
        const score = Math.max(0, Math.min(100, Number(parsed.fraud_score || 0)))
        const risk = ['safe', 'suspicious', 'scam'].includes(parsed.risk_level) ? parsed.risk_level : scoreToRisk(score)
        const contentStr = type === 'message' ? payload.message : (payload.url || '')

        return {
          fraud_score: score,
          risk_level: risk,
          confidence: parsed.confidence || (score > 70 ? 'high' : 'medium'),
          reasons: Array.isArray(parsed.reasons) ? parsed.reasons.map((r) => String(r)) : [],
          analysis: String(parsed.analysis || ''),
          ai_analysis: String(parsed.analysis || ''),
          attack_intent: String(parsed.attack_intent || inferAttackerIntent(contentStr, '', risk)),
          signals: extractAttackSignals(contentStr),
          threat_reconstruction: reconstructAttackChain(contentStr, type === 'link' ? payload.url : '', risk),
          similar_patterns: findSimilarScams(contentStr),
          reasonCodes: filterValidReasonCodes(parsed.reasonCodes || inferReasonCodes(contentStr, type === 'link' ? payload.url : '', {}, risk)),
          source: 'groq',
          emergency_actions: {
            stop: 'Do NOT click any links, enter PINs, or share verification codes.',
            verify: 'Call the organization using their official verified hotline.',
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

async function postAnalyze(type, payload) {
  // 1. Try server endpoints first (for web deployments with serverless backend)
  const endpoints = ['/api/analyze']
  if (typeof window !== 'undefined') {
    const customUrl = import.meta.env?.VITE_API_URL
    if (customUrl) endpoints.push(customUrl)
    endpoints.push('https://ghostnet-app.vercel.app/api/analyze')
  }

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload }),
      })

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        continue;
      }

      const text = await res.text();
      if (text.trim().startsWith('<')) {
        continue;
      }

      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object' && parsed.source && parsed.source !== 'offline-heuristic') {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  // 2. Try direct client-side Groq LPU AI model request if API key is present
  try {
    const groqResult = await analyzeWithClientGroq(type, payload)
    if (groqResult) return groqResult
  } catch {}

  // 3. Fallback to instant local deterministic heuristic engine
  if (type === 'message') return analyzeMessageContent(payload?.message || '')
  if (type === 'link') return analyzeUrlContent(payload?.url || '')
  if (type === 'report') return analyzeScamReportContent(payload || {})
  if (type === 'screenshot') return analyzeScreenshotFallback()
  throw new Error('Analysis request failed')
}

export function analyzeMessage(message) {
  return postAnalyze('message', { message })
}

export function analyzeLink(url) {
  return postAnalyze('link', { url })
}

export function analyzeReport(payload) {
  return postAnalyze('report', payload)
}

export function analyzeScreenshot(payload = {}) {
  return postAnalyze('screenshot', payload)
}
