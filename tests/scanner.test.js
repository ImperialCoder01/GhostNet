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
