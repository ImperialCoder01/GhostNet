# API Reference Specification

GhostNet AI provides a unified serverless REST API endpoint for processing multi-modal scam investigations.

---

## Endpoint: `POST /api/analyze`

Evaluates a text message, URL, screenshot, or community scam report.

### Headers
```http
Content-Type: application/json
```

---

### Request Types

#### 1. Message Scan Request
```json
{
  "type": "message",
  "payload": {
    "message": "URGENT: Your SBI bank account is blocked due to KYC. Update details immediately at https://sbi-kyc.top"
  }
}
```

#### 2. Link / URL Inspection Request
```json
{
  "type": "link",
  "payload": {
    "url": "https://paypal-security-verification.com/login"
  }
}
```

#### 3. Screenshot Vision Request
```json
{
  "type": "screenshot",
  "payload": {
    "screenshot_url": "https://ysvmcaeyffxzwyjwiyka.supabase.co/storage/v1/object/public/evidence/sample-evidence.png"
  }
}
```

#### 4. Community Scam Report Request
```json
{
  "type": "report",
  "payload": {
    "report_type": "message",
    "scam_content": "Caller claimed electricity bill unpaid and asked to download QuickSupport APK",
    "phone_number": "+919876543210",
    "url": "https://fake-bill-pay.in",
    "region": "India"
  }
}
```

---

### Standard Response Schema

```json
{
  "fraud_score": 92,
  "risk_level": "scam",
  "confidence": "high",
  "reasons": [
    "Uses extreme time pressure or impending penalty to bypass rational verification.",
    "Explicitly requests secret credentials, verification codes, or personal identifiers.",
    "Mimics authorized organization (State Bank of India) without official cryptographic signature."
  ],
  "analysis": "This message is a high-confidence smishing attempt impersonating State Bank of India to harvest NetBanking credentials.",
  "attack_intent": "Attacker is attempting to harvest banking credentials and OTPs to conduct unauthorized wire transfers.",
  "signals": {
    "urgency": "Uses extreme time pressure to bypass rational verification.",
    "credential": "Explicitly requests secret credentials, PINs, or KYC details.",
    "financial": "Involves unauthorized debit avenues.",
    "impersonation": "Mimics authorized bank branding.",
    "coercion": "Uses account suspension fear to force compliance."
  },
  "threat_reconstruction": [
    {
      "stage": "1. Ingress & Contact",
      "title": "Unsolicited Electronic Ingress",
      "severity": "medium",
      "detail": "Victim receives an unexpected SMS or message claiming urgent account action."
    },
    {
      "stage": "2. Social Engineering",
      "title": "Panic & Urgency Manipulation",
      "severity": "critical",
      "detail": "Fear of financial loss or account freeze induces victim into immediate compliance."
    },
    {
      "stage": "3. Phishing Gateway",
      "title": "Hostile External Hyperlink",
      "severity": "critical",
      "detail": "Victim is directed to a lookalike domain outside official banking channels."
    },
    {
      "stage": "4. Credential Harvesting",
      "title": "Credential & OTP Interception",
      "severity": "critical",
      "detail": "Phishing portal captures username, password, and active 2FA OTP codes."
    },
    {
      "stage": "5. Impact & Loss",
      "title": "Financial Drain / Takeover",
      "severity": "critical",
      "detail": "Attacker initiates immediate unauthorized fund transfers or account takeover."
    }
  ],
  "emergency_actions": {
    "stop": "Do NOT click any links, enter PINs, or share verification codes.",
    "verify": "Call the organization using their known official hotline.",
    "report": "Record this threat in the GhostNet community database.",
    "secure": "Freeze affected cards or rotate credentials immediately if compromised."
  }
}
```

---

## Endpoint: `GET /api/health`

Returns service status and active backend provider telemetry.

### Response
```json
{
  "status": "healthy",
  "timestamp": "2026-09-02T12:00:00.000Z",
  "engines": {
    "groq": "connected",
    "gemini": "connected",
    "heuristics": "ready"
  }
}
```
