import React, { useState } from "react";
import { QrCode, Sparkles, AlertCircle } from "lucide-react";
import ScannerHeader from "../components/scanner/ScannerHeader";
import QRScanner from "../components/QRScanner";
import FraudScoreDisplay from "../components/scanner/FraudScoreDisplay";
import { useNotify } from "../components/useNotify";
import { analyzeLink, analyzeMessage } from "@/lib/api";
import { createScanHistory } from "@/lib/data";

const DEMO_QRS = [
  {
    label: "Phishing Banking Portal QR",
    type: "link",
    payload: "https://sbi-kyc-verification-portal.online/login?token=urgent-freeze",
  },
  {
    label: "Fake UPI Payment QR",
    type: "message",
    payload: "upi://pay?pa=scam-merchant@upi&pn=Electricity%20Department&am=4999&cu=INR",
  },
  {
    label: "Legitimate Corporate QR",
    type: "link",
    payload: "https://www.sbi.co.in/portal/web/home",
  },
];

export default function QRScannerPage() {
  const [result, setResult] = useState(null);
  const [qrPayload, setQrPayload] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const notify = useNotify();

  const handleDecoded = async (payload) => {
    setQrPayload(payload);
    setResult(null);
    setScanError("");
    setScanning(true);

    try {
      const isUrl = /^https?:\/\//i.test(payload.trim());
      const res = isUrl ? await analyzeLink(payload) : await analyzeMessage(payload);

      setResult(res);
      notify(res.risk_level, "qr");

      createScanHistory({
        scan_type: "qr",
        input_content: payload.substring(0, 200),
        fraud_score: res.fraud_score,
        risk_level: res.risk_level,
        ai_analysis: res.analysis || res.ai_analysis,
        reasons: res.reasons,
      }).catch(() => {});
    } catch (err) {
      console.error("QR analysis failed:", err);
      setScanError(err.message || "Failed to analyze decoded QR payload.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <ScannerHeader
        icon={QrCode}
        title="QR Code Threat Inspector"
        description="Decode and inspect physical or digital QR codes for concealed phishing URLs, reverse-charge UPI traps, and deceptive redirection chains"
        color="#8b5cf6"
      />

      {/* Demo QR Presets */}
      <div className="ghost-card p-4 space-y-2 border-violet-500/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 1-Click QR Benchmarks
          </span>
          <span className="text-[11px]" style={{ color: "var(--ghost-text-dim)" }}>
            Instant test vectors without needing an image file
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_QRS.map((demo, idx) => (
            <button
              key={idx}
              onClick={() => handleDecoded(demo.payload)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border transition-all hover:border-violet-400/60"
              style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)", color: "var(--ghost-text)" }}
            >
              {demo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload / Decoder */}
      <div className="ghost-card p-5">
        <QRScanner onDecoded={handleDecoded} onError={(msg) => setScanError(msg)} />
      </div>

      {scanning && (
        <div className="ghost-card p-4 flex items-center gap-3">
          <QrCode className="w-5 h-5 text-violet-400 animate-pulse" />
          <span className="text-xs font-medium" style={{ color: "var(--ghost-text-dim)" }}>
            Analyzing decoded QR destination with neural threat pipeline...
          </span>
        </div>
      )}

      {scanError && !scanning && (
        <div className="ghost-card p-4 border-rose-500/30 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
          <span className="text-xs font-medium" style={{ color: "var(--ghost-text-dim)" }}>
            {scanError}
          </span>
        </div>
      )}

      {result && !scanning && (
        <div className="space-y-4">
          <div className="ghost-card p-4 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: "var(--ghost-text-dim)" }}>
              Decoded Raw QR Content
            </span>
            <p className="text-xs font-mono break-all p-2.5 rounded-lg border leading-relaxed"
              style={{ background: "var(--ghost-surface-2)", borderColor: "var(--ghost-border)", color: "var(--ghost-text)" }}>
              {qrPayload}
            </p>
          </div>

          <FraudScoreDisplay
            score={result.fraud_score}
            riskLevel={result.risk_level}
            confidence={result.confidence || "high"}
            reasons={result.reasons}
            analysis={result.analysis || result.ai_analysis}
            attackIntent={result.attack_intent}
            signals={result.signals}
            threatReconstruction={result.threat_reconstruction}
            similarPatterns={result.similar_patterns}
            reasonCodes={result.reasonCodes || []}
            source={result.source}
            rawScanData={{
              scan_type: "qr",
              input_content: qrPayload,
              fraud_score: result.fraud_score,
              analysis: result.analysis || result.ai_analysis,
              reasons: result.reasons,
            }}
          />
        </div>
      )}
    </div>
  );
}
