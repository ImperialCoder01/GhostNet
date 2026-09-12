import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  extractAttackSignals,
  reconstructAttackChain,
  inferAttackerIntent,
  findSimilarScams,
  analyzeMessageContent,
  analyzeUrlContent,
} from '../src/lib/scanner.js'
import { SAMPLE_THREATS } from '../src/lib/threatLibrary.js'
import { filterValidReasonCodes, VALID_REASON_CODES } from '../src/lib/reasonCodes.js'

describe('GhostNet AI Scanner Engine Tests', () => {
  it('should extract social engineering signals from an urgent KYC SMS', () => {
    const text = 'URGENT: Your SBI bank account will be suspended within 24 hours. Update KYC at http://fake-sbi.top'
    const signals = extractAttackSignals(text)
    
    assert.ok(signals.urgency, 'Expected urgency signal to be detected')
    assert.ok(signals.credential, 'Expected credential harvesting signal to be detected')
    assert.ok(signals.impersonation, 'Expected SBI impersonation to be detected')
  })

  it('should reconstruct a 5-stage attack chain for scam messages', () => {
    const text = 'Dear Customer, your electricity will be disconnected tonight at 9:30 PM due to unpaid bill.'
    const chain = reconstructAttackChain(text, '', 'scam')
    
    assert.strictEqual(chain.length, 5, 'Expected 5-stage kill chain')
    assert.strictEqual(chain[0].stage, '1. Ingress & Contact')
    assert.strictEqual(chain[4].stage, '5. Impact & Loss')
  })

  it('should infer clear plain-English attacker intent for UPI scam', () => {
    const text = 'You won Rs. 5000 cashback! Enter UPI PIN to receive money in your Google Pay account.'
    const intent = inferAttackerIntent(text, '', 'scam')
    
    assert.ok(intent.toLowerCase().includes('upi') || intent.toLowerCase().includes('fund') || intent.toLowerCase().includes('pin'), 'Expected intent to capture UPI PIN deception')
  })

  it('should identify similar scam patterns from the threat benchmark library', () => {
    const text = 'Electricity power cut tonight if bill is not updated immediately call 9876543210'
    const matches = findSimilarScams(text)
    
    assert.ok(Array.isArray(matches), 'Expected matches array')
    assert.ok(matches.length > 0, 'Expected at least one similar match')
  })

  it('should flag lookalike domains and typosquatting in URL analysis', () => {
    const url = 'https://sbi-kyc-verification-portal.online/login'
    const result = analyzeUrlContent(url)
    
    assert.strictEqual(result.risk_level, 'scam', 'Expected scam risk level')
    assert.ok(result.fraud_score >= 70, 'Expected high fraud score')
    assert.ok(result.simulation_steps.length > 0, 'Expected educational simulation steps')
  })

  it('should safely identify clean legitimate messages', () => {
    const text = 'Hey, are we still meeting for lunch tomorrow at 1 PM?'
    const result = analyzeMessageContent(text)
    
    assert.strictEqual(result.risk_level, 'safe', 'Expected safe risk level')
    assert.ok(result.fraud_score < 30, 'Expected low fraud score')
  })

  it('should verify the threat library has valid benchmark scenarios', () => {
    assert.ok(SAMPLE_THREATS.length >= 6, 'Expected at least 6 benchmark threats')
    for (const threat of SAMPLE_THREATS) {
      assert.ok(threat.id, 'Threat must have id')
      assert.ok(threat.title, 'Threat must have title')
      assert.ok(threat.category, 'Threat must have category')
      assert.ok(threat.sampleInput, 'Threat must have sample input')
    }
  })
})

// ============================================================
// Feature 1 — Reason Code Filtering
// ============================================================
describe('Feature 1 — Reason Code Filtering', () => {
  it('should pass all 10 known reason codes through the filter', () => {
    const allCodes = [...VALID_REASON_CODES]
    assert.strictEqual(allCodes.length, 10, 'Expected exactly 10 valid reason codes')
    const filtered = filterValidReasonCodes(allCodes)
    assert.strictEqual(filtered.length, 10, 'All valid codes should pass through')
  })

  it('should filter out unknown / hallucinated reason codes', () => {
    const mixed = ['URGENCY_LANGUAGE', 'FAKE_CODE_XYZ', 'REQUESTS_OTP', 'HALLUCINATED_CODE']
    const filtered = filterValidReasonCodes(mixed)
    assert.strictEqual(filtered.length, 2, 'Only 2 known codes should survive')
    assert.ok(filtered.includes('URGENCY_LANGUAGE'))
    assert.ok(filtered.includes('REQUESTS_OTP'))
    assert.ok(!filtered.includes('FAKE_CODE_XYZ'))
  })

  it('should return empty array for null / undefined / non-array input', () => {
    assert.deepStrictEqual(filterValidReasonCodes(null), [])
    assert.deepStrictEqual(filterValidReasonCodes(undefined), [])
    assert.deepStrictEqual(filterValidReasonCodes('not-array'), [])
    assert.deepStrictEqual(filterValidReasonCodes(42), [])
  })

  it('should return empty array for empty array input', () => {
    assert.deepStrictEqual(filterValidReasonCodes([]), [])
  })
})

// ============================================================
// Feature 2 — Extended Heuristic Patterns
// ============================================================
describe('Feature 2 — Extended Heuristic Patterns', () => {
  it('should flag IP-literal URLs as high risk', () => {
    const result = analyzeUrlContent('http://192.168.1.1/login')
    assert.ok(result.fraud_score >= 60, `Expected high fraud score for IP URL, got ${result.fraud_score}`)
  })

  it('should detect "verification code" as OTP-related keyword', () => {
    const result = analyzeMessageContent('Your verification code is 123456. Do not share it with anyone.')
    assert.ok(result.fraud_score >= 20, `Expected elevated score for OTP keyword, got ${result.fraud_score}`)
  })

  it('should detect "outstanding dues" as payment-related keyword', () => {
    const result = analyzeMessageContent('Your outstanding dues of Rs. 5000 must be cleared immediately.')
    assert.ok(result.fraud_score >= 20, `Expected elevated score for payment keyword, got ${result.fraud_score}`)
  })

  it('should flag additional URL shortener domains (ow.ly)', () => {
    const result = analyzeUrlContent('https://ow.ly/suspicious-redirect')
    assert.ok(result.fraud_score >= 40, `Expected elevated score for URL shortener, got ${result.fraud_score}`)
    assert.ok(result.reasons.some(r => r.toLowerCase().includes('shortening') || r.toLowerCase().includes('shortener')), 'Expected shortener warning in reasons')
  })
})

// ============================================================
// Feature 6 — Voice & Deepfake Spectral Features
// ============================================================
import { computeSpectralFlatness, combineVoiceThreatScore } from '../src/lib/spectralFeatures.js'

describe('Feature 6 — Voice Acoustic & Spectral Scoring', () => {
  it('should compute spectral flatness within valid bounds (0 to 1)', () => {
    // Generate 2048 samples of simulated tone (sine wave)
    const samples = new Float32Array(2048)
    for (let i = 0; i < samples.length; i++) {
      samples[i] = Math.sin((2 * Math.PI * 440 * i) / 44100)
    }
    const flatness = computeSpectralFlatness(samples)
    assert.ok(flatness >= 0 && flatness <= 1, `Flatness must be between 0 and 1, got ${flatness}`)
  })

  it('should return default baseline for empty / short audio', () => {
    assert.strictEqual(computeSpectralFlatness(null), 0.5)
    assert.strictEqual(computeSpectralFlatness(new Float32Array(100)), 0.5)
  })

  it('should combine text risk score with acoustic anomaly signal', () => {
    // High text risk with robotic compression (flatness = 0.05)
    const score = combineVoiceThreatScore(80, 0.05)
    assert.ok(score >= 70, `Expected high risk combined score, got ${score}`)

    // Low text risk with normal conversational audio (flatness = 0.35)
    const safeScore = combineVoiceThreatScore(10, 0.35)
    assert.ok(safeScore <= 30, `Expected low risk score for normal conversation, got ${safeScore}`)
  })
})

