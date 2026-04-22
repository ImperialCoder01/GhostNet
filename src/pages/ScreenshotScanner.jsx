// @ts-nocheck
import React, { useRef, useState } from "react";
import { Image, Upload, X } from "lucide-react";
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

  const handleFileSelect = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

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
      if (!screenshotUrl) {
        throw new Error("Could not upload the screenshot to Supabase storage. Check that you are signed in and that the evidence bucket policies are applied.");
      }

      const res = await analyzeScreenshot({ screenshot_url: screenshotUrl });

      setResult(res);
      notify(res.risk_level, "screenshot");

      await createScanHistory({
        scan_type: "screenshot",
        input_content: "Screenshot scan",
        fraud_score: res.fraud_score,
        risk_level: res.risk_level,
        ai_analysis: res.summary || res.analysis,
        reasons: res.reasons,
        screenshot_url: screenshotUrl,
      });
    } catch (error) {
      setScanError(error?.message || "Screenshot analysis failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <ScannerHeader
        icon={Image}
        title="Screenshot Scanner"
        description="Upload a screenshot to detect scams in messages, emails, or websites"
        color="#f472b6"
      />

      <div className="ghost-card p-4 space-y-4">
        {!preview ? (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-colors hover:border-pink-500"
            style={{ borderColor: "var(--ghost-border)", background: "rgba(0,0,0,0.2)" }}
          >
            <Upload className="w-8 h-8" style={{ color: "var(--ghost-text-dim)" }} />
            <span className="text-sm" style={{ color: "var(--ghost-text-dim)" }}>
              Tap to upload a screenshot
            </span>
            <span className="text-xs" style={{ color: "var(--ghost-text-dim)" }}>
              PNG, JPG up to 10MB
            </span>
          </button>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Screenshot"
              className="w-full rounded-xl max-h-64 object-contain"
              style={{ background: "rgba(0,0,0,0.3)" }}
            />
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.7)" }}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

        <Button
          onClick={handleScan}
          disabled={scanning || !file}
          className="w-full h-12 rounded-xl font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #f472b6, #ec4899)" }}
        >
          {scanning ? "Scanning..." : "Analyze Screenshot"}
        </Button>
      </div>

      {scanning && <ScanningAnimation label="Analyzing screenshot content..." />}

      {scanError ? (
        <div className="ghost-card p-4" style={{ borderColor: "rgba(255,95,120,0.5)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--ghost-red)" }}>
            {scanError}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--ghost-text-dim)" }}>
            To enable full screenshot intelligence, add `OPENAI_API_KEY` or `GEMINI_API_KEY` in your deployment environment so the API route can inspect image content.
          </p>
        </div>
      ) : null}

      {result && !scanning && (
        <>
          {result.detected_text ? (
            <div className="ghost-card p-4">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#8fa8c8" }}>
                Detected Text
              </p>
              <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--ghost-text)" }}>
                {result.detected_text}
              </p>
            </div>
          ) : null}

          <FraudScoreDisplay
            score={result.fraud_score}
            riskLevel={result.risk_level}
            reasons={result.reasons}
            analysis={result.analysis}
            summary={result.summary}
            issueBreakdown={result.issue_breakdown}
            nextSteps={result.next_steps}
            supportingLinks={result.supporting_links}
            extractedLinks={result.extracted_links}
            detectedEntities={result.detected_entities}
            technicalFindings={result.technical_findings}
            confidence={result.confidence}
          />
        </>
      )}
    </div>
  );
}
