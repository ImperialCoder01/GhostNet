import {
  analyzeMessageContent,
  analyzeScamReportContent,
  analyzeScreenshotFallback,
  analyzeUrlContent,
} from './scanner.js'

async function postAnalyze(type, payload) {
  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    })

    const contentType = res.headers.get('content-type') || '';
    if (!res.ok || !contentType.includes('application/json')) {
      throw new Error('Non-JSON server response');
    }

    const text = await res.text();
    if (text.trim().startsWith('<')) {
      throw new Error('HTML response from server');
    }

    return JSON.parse(text);
  } catch {
    if (type === 'message') return analyzeMessageContent(payload?.message || '')
    if (type === 'link') return analyzeUrlContent(payload?.url || '')
    if (type === 'report') return analyzeScamReportContent(payload || {})
    if (type === 'screenshot') return analyzeScreenshotFallback()
    throw new Error('Analysis request failed')
  }
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
