import {
  analyzeMessageContent,
  analyzeScamReportContent,
  analyzeScreenshotFallback,
  analyzeUrlContent,
} from './scanner.js'

async function postAnalyze(type, payload) {
  // 1. Try relative endpoint first (for web deployments)
  const endpoints = ['/api/analyze']
  
  // 2. Add remote production fallback endpoint if running on mobile APK or external client
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
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      continue;
    }
  }

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
