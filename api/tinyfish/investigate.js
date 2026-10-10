import { runTinyFishInvestigation } from '../../src/lib/tinyfish.js'
import { analyzeUrlContent, scoreToRisk } from '../../src/lib/scanner.js'
import { filterValidReasonCodes } from '../../src/lib/reasonCodes.js'

// Simple in-memory rate limiting map for abuse prevention
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW_MS = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10

/**
 * Checks whether an IP address or hostname is a prohibited private or local network target (SSRF Protection).
 * @param {string} hostname
 * @returns {boolean} True if destination is prohibited.
 */
export function isProhibitedTarget(hostname) {
  if (!hostname || typeof hostname !== 'string') return true
  const lower = hostname.trim().toLowerCase()

  // Hostnames & TLDs
  if (
    lower === 'localhost' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    lower.endsWith('.lan') ||
    lower.endsWith('.home') ||
    lower.endsWith('.arpa')
  ) {
    return true
  }

  // Exact IP matches
  if (
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower === '169.254.169.254' // AWS / GCP / Azure metadata endpoint
  ) {
    return true
  }

  // IPv4 Private Ranges
  const ipParts = lower.split('.').map(Number)
  if (ipParts.length === 4 && ipParts.every((p) => !isNaN(p) && p >= 0 && p <= 255)) {
    const [a, b] = ipParts
    if (a === 10) return true // 10.0.0.0/8
    if (a === 127) return true // 127.0.0.0/8
    if (a === 169 && b === 254) return true // 169.254.0.0/16
    if (a === 172 && b >= 16 && b <= 31) return true // 172.16.0.0/12
    if (a === 192 && b === 168) return true // 192.168.0.0/16
    if (a === 0) return true // 0.0.0.0/8
  }

  return false
}

/**
 * Validates target URL for safety, scheme, length, and SSRF rules.
 * @param {string} rawUrl
 * @returns {{ valid: boolean, url?: string, reason?: string }}
 */
export function validateTargetUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, reason: 'URL is required.' }
  }

  const trimmed = rawUrl.trim()
  if (trimmed.length > 2048) {
    return { valid: false, reason: 'URL exceeds maximum length of 2048 characters.' }
  }

  let parsed = null
  try {
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
      parsed = new URL(trimmed)
    } else {
      parsed = new URL(`https://${trimmed}`)
    }
  } catch {
    return { valid: false, reason: 'Invalid or unparseable URL format.' }
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, reason: 'Only http and https protocols are supported.' }
  }

  if (isProhibitedTarget(parsed.hostname)) {
    return { valid: false, reason: 'Requests to localhost, private IP addresses, or internal services are prohibited.' }
  }

  return { valid: true, url: parsed.href }
}

/**
 * Enforces per-IP rate limiting.
 * @param {string} clientIp
 * @returns {boolean} True if within limits, false if rate limited.
 */
function checkRateLimit(clientIp) {
  const now = Date.now()
  const record = rateLimitMap.get(clientIp) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS }

  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + RATE_LIMIT_WINDOW_MS
    rateLimitMap.set(clientIp, record)
    return true
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  record.count += 1
  rateLimitMap.set(clientIp, record)
  return true
}

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ status: 'error', errorCode: 'METHOD_NOT_ALLOWED', message: 'Method not allowed. Use POST.' })
    return
  }

  // Rate Limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1'
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({
      status: 'error',
      errorCode: 'RATE_LIMIT_EXCEEDED',
      message: 'Rate limit exceeded. Maximum 10 investigations per minute.',
    })
    return
  }

  // Input extraction
  const { url: rawTargetUrl } = req.body || {}
  const validation = validateTargetUrl(rawTargetUrl)

  if (!validation.valid) {
    res.status(400).json({
      status: 'error',
      errorCode: 'INVALID_URL',
      message: validation.reason,
    })
    return
  }

  const targetUrl = validation.url

  // Check API Key
  const apiKey = process.env.TINYFISH_API_KEY
  if (!apiKey) {
    res.status(503).json({
      status: 'error',
      errorCode: 'MISSING_TINYFISH_KEY',
      message: 'TinyFish API key (TINYFISH_API_KEY) is not configured on the server.',
      investigation: {
        url: targetUrl,
        status: 'failed',
        errorCode: 'MISSING_TINYFISH_KEY',
        message: 'TinyFish API key not configured on server.',
      },
    })
    return
  }

  try {
    // 1. Run TinyFish browser automation investigation
    const tfResult = await runTinyFishInvestigation(targetUrl, { apiKey })

    // 2. Run GhostNet deterministic domain heuristic analysis
    const ghostnetHeuristic = analyzeUrlContent(targetUrl)

    // 3. Combine evidence into a unified assessment
    let combinedScore = ghostnetHeuristic.fraud_score
    const combinedReasons = [...ghostnetHeuristic.reasons]
    const reasonCodesSet = new Set(ghostnetHeuristic.reasonCodes || [])

    if (tfResult.status === 'completed') {
      if (tfResult.riskIndicators.length > 0) {
        combinedScore = Math.min(100, combinedScore + tfResult.riskIndicators.length * 15)
        for (const risk of tfResult.riskIndicators) {
          combinedReasons.push(`[TinyFish Observation] ${risk}`)
        }
      }

      if (tfResult.riskIndicators.some((r) => /otp|password|credential/i.test(r))) {
        reasonCodesSet.add('REQUEST_OTP_PASSWORD')
      }
      if (tfResult.riskIndicators.some((r) => /urgency|threat/i.test(r))) {
        reasonCodesSet.add('URGENCY_SCARE_TACTICS')
      }
      if (tfResult.riskIndicators.some((r) => /payment|card|fee/i.test(r))) {
        reasonCodesSet.add('PAYMENT_REDIRECT')
      }
    }

    const finalRiskLevel = scoreToRisk(combinedScore)
    const filteredCodes = filterValidReasonCodes(Array.from(reasonCodesSet))

    const unifiedVerdict = {
      fraud_score: combinedScore,
      risk_level: finalRiskLevel,
      confidence: tfResult.status === 'completed' ? 'high' : 'medium',
      reasons: combinedReasons,
      analysis: tfResult.summary || ghostnetHeuristic.analysis,
      attack_intent: ghostnetHeuristic.attack_intent,
      signals: ghostnetHeuristic.signals,
      threat_reconstruction: ghostnetHeuristic.threat_reconstruction,
      reasonCodes: filteredCodes,
      source: 'tinyfish-agent',
      tinyfishInvestigation: tfResult,
    }

    res.status(200).json(unifiedVerdict)
  } catch (err) {
    console.error('[api/tinyfish/investigate error]', err)
    res.status(500).json({
      status: 'error',
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: 'An internal server error occurred during TinyFish website investigation.',
    })
  }
}
