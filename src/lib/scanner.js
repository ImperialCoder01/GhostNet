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

const SENSITIVE_PATTERNS = ['otp', 'pin', 'password', 'cvv', 'bank account', 'gift card', 'wallet']
const URGENCY_PATTERNS = ['urgent', 'immediately', 'act now', 'final warning', 'limited time', 'expires today']
const BRAND_LOOKALIKE_PATTERN = /(paypa1|g00gle|micr0soft|amaz0n|faceboook|appleid|netf1ix)/i
const SHORTENER_DOMAINS = ['bit.ly', 'tinyurl.com', 't.co', 'cutt.ly', 'rb.gy', 'rebrand.ly']

function normalize(text) {
  return (text || '').toLowerCase().trim()
}

function scoreToRisk(score) {
  if (score >= 75) return 'scam'
  if (score >= 40) return 'suspicious'
  return 'safe'
}

function parseJsonSafe(text) {
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

function clampScore(value, fallback = 50) {
  const num = Number(value)
  if (!Number.isFinite(num)) return fallback
  return Math.max(0, Math.min(100, Math.round(num)))
}

function titleCase(value) {
  return String(value || '')
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function extractUrls(text) {
  const matches = String(text || '').match(/https?:\/\/[^\s<>"')]+/gi) || []
  return [...new Set(matches)]
}

function extractEntities(text) {
  const normalized = normalize(text)
  return [...new Set(SCAM_KEYWORDS.filter((keyword) => normalized.includes(keyword)).map(titleCase))].slice(0, 8)
}

function buildResourceLinks(kind, details = {}) {
  const links = []
  const encodedUrl = details.url ? encodeURIComponent(details.url) : ''
  const encodedHost = details.host ? encodeURIComponent(details.host) : ''

  if (encodedUrl) {
    links.push({
      label: 'Google Safe Browsing Report',
      url: `https://transparencyreport.google.com/safe-browsing/search?url=${encodedUrl}`,
      description: 'Check whether Google has already flagged this URL for phishing or malware.',
    })
    links.push({
      label: 'VirusTotal URL Inspection',
      url: `https://www.virustotal.com/gui/search/${encodedUrl}`,
      description: 'Open a multi-engine reputation scan for the exact URL.',
    })
  }

  if (encodedHost) {
    links.push({
      label: 'WHOIS Domain Lookup',
      url: `https://who.is/whois/${encodedHost}`,
      description: 'Review domain registration age and owner details.',
    })
  }

  if (kind !== 'link') {
    links.push({
      label: 'FTC Scam Advice',
      url: 'https://consumer.ftc.gov/scams',
      description: 'Read practical guidance for responding to phishing, impersonation, and payment fraud.',
    })
  }

  if (kind === 'screenshot' || kind === 'message') {
    links.push({
      label: 'Report Phishing to Google',
      url: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
      description: 'Submit malicious pages or scam landing pages for review.',
    })
  }

  return links.slice(0, 4)
}

function buildSharedDetails({
  kind,
  score,
  riskLevel,
  reasons,
  analysis,
  text = '',
  url = '',
  technicalFindings = [],
}) {
  const extractedLinks = extractUrls(text || url).map((item) => ({
    label: item,
    url: item,
  }))
  const entities = extractEntities(text)
  let host = ''

  if (url) {
    try {
      host = new URL(url).hostname.toLowerCase()
    } catch {
      host = ''
    }
  }
  const nextSteps =
    riskLevel === 'safe'
      ? [
          'Verify the sender or website through an official contact channel before sharing anything sensitive.',
          'Keep monitoring for unexpected follow-up requests, password prompts, or payment demands.',
        ]
      : [
          'Do not click, reply, or submit passwords, OTPs, bank details, or payment information.',
          'Verify the request using the official app, official website, or a known phone number.',
          'If you already interacted with it, rotate passwords and contact your bank or provider immediately.',
        ]

  return {
    fraud_score: score,
    risk_level: riskLevel,
    confidence: riskLevel === 'safe' ? 'medium' : 'high',
    reasons,
    analysis,
    summary:
      riskLevel === 'safe'
        ? 'No major fraud signals were detected, but verification is still recommended for any unexpected request.'
        : 'Multiple patterns in this scan match common phishing, impersonation, or social-engineering behavior.',
    issue_breakdown: reasons.map((reason) => ({
      title: riskLevel === 'safe' ? 'Watch Item' : 'Threat Indicator',
      detail: reason,
      severity: riskLevel === 'scam' ? 'high' : riskLevel === 'suspicious' ? 'medium' : 'low',
    })),
    next_steps: nextSteps,
    supporting_links: buildResourceLinks(kind, { url, host }),
    extracted_links: extractedLinks,
    detected_entities: entities,
    technical_findings: technicalFindings,
    detected_text: kind === 'screenshot' ? text : '',
  }
}

function normalizeAiResult(parsed, fallback) {
  if (!parsed || typeof parsed !== 'object') return fallback

  const score = clampScore(parsed.fraud_score, fallback.fraud_score)
  const riskLevel = ['safe', 'suspicious', 'scam'].includes(parsed.risk_level)
    ? parsed.risk_level
    : scoreToRisk(score)
  const reasons = Array.isArray(parsed.reasons) ? parsed.reasons.map((item) => String(item)) : fallback.reasons
  const technicalFindings = Array.isArray(parsed.technical_findings)
    ? parsed.technical_findings.map((item) => ({
        label: String(item?.label || ''),
        value: String(item?.value || ''),
        tone: ['neutral', 'good', 'warning', 'danger'].includes(item?.tone) ? item.tone : 'neutral',
      }))
    : fallback.technical_findings

  return {
    ...fallback,
    fraud_score: score,
    risk_level: riskLevel,
    confidence: ['low', 'medium', 'high'].includes(parsed.confidence) ? parsed.confidence : fallback.confidence,
    reasons,
    analysis: String(parsed.analysis || fallback.analysis),
    summary: String(parsed.summary || fallback.summary),
    issue_breakdown: Array.isArray(parsed.issue_breakdown) && parsed.issue_breakdown.length > 0
      ? parsed.issue_breakdown.map((item) => ({
          title: String(item?.title || 'Threat Indicator'),
          detail: String(item?.detail || ''),
          severity: ['low', 'medium', 'high'].includes(item?.severity) ? item.severity : 'medium',
        }))
      : fallback.issue_breakdown,
    next_steps: Array.isArray(parsed.next_steps) && parsed.next_steps.length > 0
      ? parsed.next_steps.map((item) => String(item))
      : fallback.next_steps,
    supporting_links: Array.isArray(parsed.supporting_links) && parsed.supporting_links.length > 0
      ? parsed.supporting_links
          .map((item) => ({
            label: String(item?.label || ''),
            url: String(item?.url || ''),
            description: String(item?.description || ''),
          }))
          .filter((item) => item.label && item.url)
      : fallback.supporting_links,
    extracted_links: Array.isArray(parsed.extracted_links) && parsed.extracted_links.length > 0
      ? parsed.extracted_links
          .map((item) => ({
            label: String(item?.label || item?.url || ''),
            url: String(item?.url || ''),
          }))
          .filter((item) => item.url)
      : fallback.extracted_links,
    detected_entities: Array.isArray(parsed.detected_entities) && parsed.detected_entities.length > 0
      ? parsed.detected_entities.map((item) => String(item))
      : fallback.detected_entities,
    technical_findings: technicalFindings,
    detected_text: String(parsed.detected_text || fallback.detected_text || ''),
  }
}

export function analyzeMessageContent(message) {
  const text = normalize(message)
  const reasons = []
  let score = 5

  const matched = SCAM_KEYWORDS.filter((keyword) => text.includes(keyword))
  if (matched.length > 0) {
    score += matched.length * 10
    reasons.push(`Contains scam-associated language such as ${matched.slice(0, 4).join(', ')}.`)
  }

  if (/https?:\/\//.test(text)) {
    score += 15
    reasons.push('Includes a link that could redirect the victim away from a trusted channel.')
  }

  if (URGENCY_PATTERNS.some((pattern) => text.includes(pattern))) {
    score += 20
    reasons.push('Uses urgency or deadline pressure to reduce careful verification.')
  }

  if (SENSITIVE_PATTERNS.some((pattern) => text.includes(pattern))) {
    score += 20
    reasons.push('Requests or hints at sensitive credentials, payment details, or verification codes.')
  }

  if (/\b(prize|bonus|refund|reward|cashback)\b/.test(text)) {
    score += 10
    reasons.push('Promises a reward or financial benefit to create trust or excitement.')
  }

  const finalScore = Math.min(100, score)
  const riskLevel = scoreToRisk(finalScore)
  const technicalFindings = [
    { label: 'Links detected', value: String(extractUrls(message).length), tone: extractUrls(message).length > 0 ? 'warning' : 'good' },
    { label: 'Sensitive asks', value: SENSITIVE_PATTERNS.filter((item) => text.includes(item)).length > 0 ? 'Present' : 'None detected', tone: SENSITIVE_PATTERNS.filter((item) => text.includes(item)).length > 0 ? 'danger' : 'good' },
    { label: 'Pressure language', value: URGENCY_PATTERNS.filter((item) => text.includes(item)).length > 0 ? 'Present' : 'None detected', tone: URGENCY_PATTERNS.filter((item) => text.includes(item)).length > 0 ? 'warning' : 'good' },
  ]

  return buildSharedDetails({
    kind: 'message',
    score: finalScore,
    riskLevel,
    reasons,
    analysis:
      riskLevel === 'safe'
        ? 'The message does not show strong scam markers, but any unexpected request for action should still be verified independently.'
        : 'This message matches phishing and social-engineering behavior through pressure, credential harvesting cues, or redirect language.',
    text: message,
    technicalFindings,
  })
}

export function analyzeUrlContent(rawUrl) {
  let url
  const reasons = []
  let score = 10

  try {
    url = new URL(rawUrl)
  } catch {
    return buildSharedDetails({
      kind: 'link',
      score: 95,
      riskLevel: 'scam',
      reasons: ['The submitted link is malformed, which is common in copied phishing payloads or disguised redirects.'],
      analysis: 'The URL format is invalid and should not be trusted or visited.',
      url: rawUrl,
      technicalFindings: [
        { label: 'HTTPS', value: 'Invalid URL', tone: 'danger' },
        { label: 'Domain structure', value: 'Unreadable', tone: 'danger' },
      ],
    })
  }

  const host = url.hostname.toLowerCase()
  const path = url.pathname.toLowerCase()

  if (url.protocol !== 'https:') {
    score += 20
    reasons.push('The page is not using HTTPS, which weakens trust and is unusual for legitimate login or payment flows.')
  }

  if (SHORTENER_DOMAINS.some((domain) => host.includes(domain))) {
    score += 25
    reasons.push('The link uses a shortening service, which can hide the real destination from the victim.')
  }

  if (/login|verify|secure|update|payment|wallet|claim|unlock/.test(path)) {
    score += 15
    reasons.push('The path contains high-risk action words often seen in phishing and fake account recovery pages.')
  }

  if (host.split('.').length > 3) {
    score += 10
    reasons.push('The hostname uses many subdomains, a common tactic for making malicious URLs look official.')
  }

  const lookalike = BRAND_LOOKALIKE_PATTERN.test(host)
  if (lookalike) {
    score += 30
    reasons.push('The domain resembles a known brand name and may be attempting impersonation.')
  }

  if (/[0-9-]{6,}/.test(host)) {
    score += 10
    reasons.push('The hostname contains machine-like numbering patterns that are uncommon in consumer-facing brands.')
  }

  const finalScore = Math.min(100, score)
  const riskLevel = scoreToRisk(finalScore)

  return buildSharedDetails({
    kind: 'link',
    score: finalScore,
    riskLevel,
    reasons,
    analysis:
      riskLevel === 'safe'
        ? 'The URL structure looks relatively normal, but that is not a guarantee of legitimacy without checking the actual site content and sender context.'
        : 'The link includes structural indicators associated with phishing, impersonation, or malicious redirect campaigns.',
    url: rawUrl,
    technicalFindings: [
      { label: 'Domain age estimate', value: finalScore > 60 ? 'Very new or untrusted' : 'Not obviously risky', tone: finalScore > 60 ? 'warning' : 'good' },
      { label: 'HTTPS', value: url.protocol === 'https:' ? 'Enabled' : 'Missing', tone: url.protocol === 'https:' ? 'good' : 'danger' },
      { label: 'Impersonation signal', value: lookalike ? 'Possible brand mimicry' : 'None detected', tone: lookalike ? 'danger' : 'good' },
      { label: 'Subdomain depth', value: `${host.split('.').length} segments`, tone: host.split('.').length > 3 ? 'warning' : 'neutral' },
    ],
  })
}

export function analyzeScamReportContent(form) {
  const combinedText = `${form.report_type} ${form.scam_content} ${form.phone_number || ''} ${form.url || ''}`
  const text = normalize(combinedText)
  const matched = SCAM_KEYWORDS.filter((keyword) => text.includes(keyword))
  const score = Math.min(100, 20 + matched.length * 12 + (form.url ? 10 : 0) + (form.phone_number ? 5 : 0))
  const riskLevel = scoreToRisk(score)

  return {
    fraud_score: score,
    risk_level: riskLevel,
    ai_analysis:
      riskLevel === 'safe'
        ? 'The submitted report has been logged with a lower immediate threat score, but it still adds useful reporting context.'
        : 'The report includes multiple scam markers and should be reviewed as a likely fraud attempt.',
  }
}

export function analyzeScreenshotFallback(reason) {
  const fallbackReason =
    reason ||
    'An image was uploaded, but no vision provider is configured yet for deep text and scene analysis in this environment.'

  return buildSharedDetails({
    kind: 'screenshot',
    score: 55,
    riskLevel: 'suspicious',
    reasons: [fallbackReason],
    analysis:
      reason
        ? 'Screenshot analysis is running in fallback mode because the configured vision provider could not complete the request.'
        : 'Screenshot analysis is running in fallback mode. Connect a vision model to inspect visible text, fake branding, and phishing prompts inside the image.',
    technicalFindings: [
      { label: 'Vision OCR', value: reason ? 'Provider unavailable' : 'Not configured', tone: 'warning' },
      { label: 'Deep image review', value: 'Unavailable in fallback mode', tone: 'warning' },
    ],
  })
}

export function analyzeScreenshotText(text) {
  const base = analyzeMessageContent(text)
  return {
    ...base,
    summary:
      base.risk_level === 'safe'
        ? 'The visible screenshot text does not show strong scam language, though image-only branding tricks may still need manual review.'
        : 'The screenshot text contains suspicious language that fits phishing or payment fraud patterns.',
    analysis:
      base.risk_level === 'safe'
        ? 'OCR text from the screenshot looks mostly safe based on heuristic checks, but visual impersonation cues can still matter.'
        : 'OCR extracted language from the screenshot that matches social-engineering or scam-style prompts.',
    detected_text: text,
  }
}

export function normalizeModelAnalysis(parsed, fallback) {
  return normalizeAiResult(parsed, fallback)
}

export function parseModelJson(text) {
  return parseJsonSafe(text)
}
