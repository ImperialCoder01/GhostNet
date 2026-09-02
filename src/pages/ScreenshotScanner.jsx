import React, { useState, useRef } from "react";
import { Image, Upload, X, Sparkles, FileSearch, ShieldAlert, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScannerHeader from "../components/scanner/ScannerHeader";
import ScanningAnimation from "../components/scanner/ScanningAnimation";
import FraudScoreDisplay from "../components/scanner/FraudScoreDisplay";
import { useNotify } from "../components/useNotify";
import { createScanHistory, uploadEvidenceFile } from "@/lib/data";
import { analyzeScreenshot } from "@/lib/api";

export default function ScreenshotScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [scanError, setScanError] = useState("");
  const fileRef = useRef(null);
  const notify = useNotify();

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    // File validation: Check image type and size limit (10MB)
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
      // 1. Upload to Supabase Storage evidence bucket
      const screenshotUrl = await uploadEvidenceFile(file);
      
      // 2. Call Multi-modal Vision API
      const res = await analyzeScreenshot({ screenshot_url: screenshotUrl });
      setResult(res);
      notify(res.risk_level, "screenshot");

      // 3. Record in scan history
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

      <div className="ghost-card p-5 space-y-4">
        {!preview ? (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full h-52 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:border-pink-500 hover:bg-pink-500/5 group"
            style={{ borderColor: 'var(--ghost-border)', background: 'rgba(0,0,0,0.2)' }}>
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-pink-400" />
            </div>
            <div className="text-center space-y-1">
              <span className="text-sm font-bold text-slate-200 group-hover:text-white block">
                Tap or drag & drop a screenshot here
              </span>
              <span className="text-xs text-slate-400 block">
                PNG, JPG, WebP up to 10MB • Auto-OCR & Vision Analysis
              </span>
            </div>
          </button>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-2">
            <img
              src={preview}
              alt="Screenshot Preview"
              className="w-full rounded-xl max-h-72 object-contain bg-black/40 mx-auto"
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
          className="w-full h-12 rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(244,114,182,0.25)]"
          style={{ background: 'linear-gradient(135deg, #f472b6, #ec4899)' }}>
          {scanning ? "Processing Visual Evidence..." : "Analyze Screenshot with Vision AI"}
        </Button>
      </div>

      {scanning && <ScanningAnimation label="Extracting OCR tokens, logos, and visual social engineering cues..." />}

      {scanError && (
        <div className="ghost-card p-4 border-rose-500/30 flex items-start gap-3">
          <Info className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-300">
            <p className="font-bold text-rose-400">{scanError}</p>
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
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <FileSearch className="w-3.5 h-3.5 text-pink-400" /> Extracted OCR Text from Image
                </span>
                <span className="text-[10px] font-mono text-cyan-400">Gemini Vision OCR</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
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
    </div>
  );
}
