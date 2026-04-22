import { Capacitor } from '@capacitor/core'
import {
  analyzeMessageContent,
  analyzeScamReportContent,
  analyzeScreenshotFallback,
  analyzeUrlContent,
} from '@/lib/scanner'

function getApiBaseUrl() {
  const configuredBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')
  if (configuredBase) return configuredBase
  if (typeof window !== 'undefined' && !Capacitor.isNativePlatform()) return window.location.origin
  return ''
}

async function postAnalyze(type, payload) {
  const baseUrl = getApiBaseUrl()
  const endpoint = `${baseUrl}/api/analyze`

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, payload }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || 'Analysis request failed')
    }

    return res.json()
  } catch {
    if (import.meta.env.PROD && (baseUrl || !Capacitor.isNativePlatform())) {
      throw new Error('Analysis service unavailable. Please try again.')
    }

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
