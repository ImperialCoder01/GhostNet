# Testing Strategy & Verification Matrix

GhostNet AI employs a multi-tiered testing strategy spanning unit regression tests, API integration tests, and manual security test cases.

---

## 1. Running Automated Unit Tests

GhostNet uses Node.js's native test runner (`node --test`), providing zero-dependency fast regression verification.

```bash
npm test
```

### Test Suite Coverage (`tests/scanner.test.js`)
* **Social Engineering Signal Extraction:** Verifies extraction of urgency, credential harvesting, financial avenues, and impersonation cues.
* **Attack Chain Synthesis:** Verifies the generation of the 5-stage Threat Reconstruction kill-chain.
* **Attacker Intent Inference:** Tests plain-English objective determination for UPI, banking, and utility scams.
* **Similar Scam Benchmark Matching:** Tests similarity vector calculations against verified threats.
* **Domain & Typosquatting Analysis:** Verifies lookalike brand detection and Punycode decomposition.
* **Legitimate Message Baseline:** Ensures clean conversational text receives `safe` risk classification.
* **Threat Library Schema Verification:** Validates integrity of all 8 benchmark scenarios.

---

## 2. Practical Test Matrix

| Vector | Input Sample | Expected Verdict | Expected Intent / Signals |
| :--- | :--- | :--- | :--- |
| **Bank KYC SMS** | `"URGENT: SBI account blocked due to KYC. Update at http://fake-sbi.top"` | **High Threat Scam** (90+) | Urgency + Credential Harvesting + Brand Impersonation |
| **UPI Cashback** | `"Won Rs 5000 cashback! Enter UPI PIN to claim money."` | **High Threat Scam** (85+) | Reverse Collect / Fund Drain Attempt |
| **Utility Cutoff** | `"Electricity power disconnected tonight due to unpaid bill."` | **High Threat Scam** (85+) | Coercion + Urgent Action Pressure |
| **Phishing Link** | `https://paypal-security-verification.com/login` | **High Threat Scam** (85+) | Typosquatting + Lookalike Portal |
| **Legitimate Text** | `"Hey, are we still meeting for lunch tomorrow at 1 PM?"` | **Safe / Low Risk** (< 20) | Clean conversational context |

---

## 3. Manual QA Checklist

* [x] **Theme Toggle:** Instant switch between Light and Dark themes without visual glitches.
* [x] **Senior Safety Mode:** Enlarged typography and high-contrast badges upon activation.
* [x] **User Account Modal:** Displays operator details and triggers secure sign-out.
* [x] **Safe Click Simulator:** Interactive educational modal advances cleanly through all 4 phases.
* [x] **Heatmap Filtering:** Geographic nodes filter dynamically by severity (Critical / High / All).
