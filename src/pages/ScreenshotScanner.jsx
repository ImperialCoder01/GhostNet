import React, { useState, useRef } from "react";
import { Image, Upload, X, FileSearch, Info, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScannerHeader from "../components/scanner/ScannerHeader";
import ScanningAnimation from "../components/scanner/ScanningAnimation";
import FraudScoreDisplay from "../components/scanner/FraudScoreDisplay";
import QRScanner from "../components/QRScanner";
import { useNotify } from "../components/useNotify";
import { createScanHistory, uploadEvidenceFile } from "@/lib/data";
import { analyzeScreenshot, analyzeLink, analyzeMessage } from "@/lib/api";

export default function ScreenshotScanner() {
  // Tab state — "screenshot" | "qr"
  const [activeTab, setActiveTab] = useState("screenshot");

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [scanError, setScanError] = useState("");
  const fileRef = useRef(null);
  const notify = useNotify();

  // QR scanner state
  const [qrResult, setQrResult] = useState(null);
  const [qrError, setQrError] = useState("");
  const [qrScanning, setQrScanning] = useState(false);

  const handleQrDecoded = async (payload) => {
    setQrResult(null);
    setQrError("");
    setQrScanning(true);
    try {
      let res;
      if (/^https?:\/\//i.test(payload)) {
        res = await analyzeLink(payload);
      } else {
        res = await analyzeMessage(payload);
      }
      setQrResult({ ...res, _qrPayload: payload });
      notify(res.risk_level, "qr");
    } catch (err) {
      setQrError(err?.message || "QR analysis failed. Please try again.");
    } finally {
      setQrScanning(false);
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    if (!selected.type.startsWith('image/')) {
      setScanError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setScanError("Image exceeds 10MB limit. Please upload a smaller screenshot.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setScanError("");
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setScanError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleScan = async () => {
    if (!file) return;
    setScanning(true);
    setResult(null);
    setScanError("");

    try {
      const screenshotUrl = await uploadEvidenceFile(file);
      const res = await analyzeScreenshot({ screenshot_url: screenshotUrl });
      setResult(res);
      notify(res.risk_level, "screenshot");

      await createScanHistory({
        scan_type: "screenshot",
        input_content: res.detected_text ? res.detected_text.substring(0, 200) : "Screenshot image inspection",
        fraud_score: res.fraud_score,
        risk_level: res.risk_level,
        ai_analysis: res.analysis || res.ai_analysis,
        reasons: res.reasons,
        screenshot_url: screenshotUrl,
      });
    } catch (e) {
      console.error("Screenshot scan failed:", e);
      setScanError(e?.message || "Screenshot analysis encountered an error. Running local heuristics...");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <ScannerHeader
        icon={Image}
        title="Multi-Modal Vision & Screenshot Scanner"
        description="Upload screenshots of suspicious chats, fake payment receipts, banking portals, or QR codes for deep visual AI inspection"
        color="#f472b6"
      />

      {/* Tab Switcher — Feature 5 */}
      <div className="flex gap-1 p-1 rounded-xl border" style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)' }}>
        <button
          onClick={() => setActiveTab("screenshot")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === "screenshot" ? "bg-pink-500/15 text-pink-500 border border-pink-500/30" : ""}`}
          style={{ color: activeTab === "screenshot" ? undefined : 'var(--ghost-text-dim)' }}
        >
          <Image className="w-3.5 h-3.5" />
          Screenshot Analysis
        </button>
        <button
          onClick={() => setActiveTab("qr")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all ${activeTab === "qr" ? "bg-violet-500/15 text-violet-400 border border-violet-500/30" : ""}`}
          style={{ color: activeTab === "qr" ? undefined : 'var(--ghost-text-dim)' }}
        >
          <QrCode className="w-3.5 h-3.5" />
          QR Code Scanner
        </button>
      </div>

      {/* QR Code Scanner Tab — Feature 5 */}
      {activeTab === "qr" && (
        <div className="space-y-4">
          <QRScanner
            onDecoded={handleQrDecoded}
            onError={(msg) => setQrError(msg)}
          />
          {qrScanning && (
            <div className="ghost-card p-4 flex items-center gap-3">
              <QrCode className="w-4 h-4 text-violet-400 animate-pulse" />
              <span className="text-xs font-medium" style={{ color: 'var(--ghost-text-dim)' }}>Analyzing QR code payload...</span>
            </div>
          )}
          {qrError && !qrScanning && (
            <div className="ghost-card p-4 border-rose-500/30 flex items-start gap-3">
              <Info className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
              <span className="text-xs" style={{ color: 'var(--ghost-text-dim)' }}>{qrError}</span>
            </div>
          )}
          {qrResult && !qrScanning && (
            <div className="space-y-4">
              <div className="ghost-card p-4 space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider block" style={{ color: 'var(--ghost-text-dim)' }}>QR Code Payload</span>
                <p className="text-xs font-mono break-all" style={{ color: 'var(--ghost-text)' }}>{qrResult._qrPayload}</p>
              </div>
              <FraudScoreDisplay
                score={qrResult.fraud_score}
                riskLevel={qrResult.risk_level}
                confidence={qrResult.confidence || "high"}
                reasons={qrResult.reasons}
                analysis={qrResult.analysis || qrResult.ai_analysis}
                attackIntent={qrResult.attack_intent}
                signals={qrResult.signals}
                threatReconstruction={qrResult.threat_reconstruction}
                similarPatterns={qrResult.similar_patterns}
                reasonCodes={qrResult.reasonCodes || []}
                source={qrResult.source}
                rawScanData={{
                  scan_type: "qr",
                  input_content: qrResult._qrPayload,
                  fraud_score: qrResult.fraud_score,
                  analysis: qrResult.analysis || qrResult.ai_analysis,
                  reasons: qrResult.reasons,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Screenshot Analysis Tab */}
      {activeTab === "screenshot" && (
        <>
          <div className="ghost-card p-5 space-y-4">
            {!preview ? (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-52 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:border-pink-500 hover:bg-pink-500/5 group"
                style={{ borderColor: 'var(--ghost-border)', background: 'var(--ghost-surface-2)' }}>
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-pink-500" />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-sm font-bold block" style={{ color: 'var(--ghost-text)' }}>
                    Tap or drag & drop a screenshot here
                  </span>
                  <span className="text-xs block" style={{ color: 'var(--ghost-text-dim)' }}>
                    PNG, JPG, WebP up to 10MB • Auto-OCR & Vision Analysis
                  </span>
                </div>
              </button>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border p-2"
                style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)' }}>
                <img
                  src={preview}
                  alt="Screenshot Preview"
                  className="w-full rounded-xl max-h-72 object-contain bg-black/20 mx-auto"
                />
                <button
                  onClick={clearFile}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-rose-500 text-white flex items-center justify-center transition-colors border border-white/20">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

            <Button
              onClick={handleScan}
              disabled={scanning || !file}
              className="w-full h-12 rounded-xl font-bold text-white transition-all shadow-md bg-pink-600 hover:bg-pink-500">
              {scanning ? "Processing Visual Evidence..." : "Analyze Screenshot with Vision AI"}
            </Button>
          </div>

          {scanning && <ScanningAnimation label="Extracting OCR tokens, logos, and visual social engineering cues..." />}

          {scanError && (
            <div className="ghost-card p-4 border-rose-500/30 flex items-start gap-3">
              <Info className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
              <div className="text-xs" style={{ color: 'var(--ghost-text-dim)' }}>
                <p className="font-bold text-rose-500">{scanError}</p>
                <p className="mt-1">Fallback analysis will evaluate extracted signals automatically.</p>
              </div>
            </div>
          )}

          {result && !scanning && (
            <div className="space-y-4">
              {/* Extracted OCR text box */}
              {result.detected_text && (
                <div className="ghost-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                      style={{ color: 'var(--ghost-text-dim)' }}>
                      <FileSearch className="w-3.5 h-3.5 text-pink-500" /> Extracted OCR Text from Image
                    </span>
                    <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">Gemini Vision OCR</span>
                  </div>
                  <div className="p-3 rounded-xl border text-xs font-mono max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed"
                    style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)', color: 'var(--ghost-text)' }}>
                    {result.detected_text}
                  </div>
                </div>
              )}

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
                  scan_type: "screenshot",
                  input_content: result.detected_text || "Screenshot analysis",
                  fraud_score: result.fraud_score,
                  analysis: result.analysis || result.ai_analysis,
                  reasons: result.reasons,
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
