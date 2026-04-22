// @ts-nocheck
import React, { useState } from "react";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScannerHeader from "../components/scanner/ScannerHeader";
import ScanningAnimation from "../components/scanner/ScanningAnimation";
import FraudScoreDisplay from "../components/scanner/FraudScoreDisplay";
import { useNotify } from "../components/useNotify";
import { createScanHistory } from "@/lib/data";
import { analyzeLink } from "@/lib/api";

export default function LinkScanner() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [scanError, setScanError] = useState("");
  const notify = useNotify();

  const handleScan = async () => {
    if (!url.trim()) return;
    setScanning(true);
    setResult(null);
    setScanError("");

    try {
      const res = await analyzeLink(url);

      setResult(res);
      notify(res.risk_level, "link");

      await createScanHistory({
        scan_type: "link",
        input_content: url.substring(0, 200),
        fraud_score: res.fraud_score,
        risk_level: res.risk_level,
        ai_analysis: res.summary || res.analysis,
        reasons: res.reasons,
      });
    } catch (error) {
      setScanError(error?.message || "Link analysis failed. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <ScannerHeader
        icon={Link2}
        title="Link Scanner"
        description="Paste any suspicious URL to check if it is a phishing website"
        color="#a78bfa"
      />

      <div className="ghost-card p-4 space-y-4">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://suspicious-link.com/verify"
          className="h-12 bg-transparent border-0 text-sm font-medium focus-visible:ring-0 placeholder:text-slate-500"
          style={{ color: "var(--ghost-text)" }}
        />
        <Button
          onClick={handleScan}
          disabled={scanning || !url.trim()}
          className="w-full h-12 rounded-xl font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)" }}
        >
          {scanning ? "Scanning..." : "Analyze Link"}
        </Button>
      </div>

      {scanning && <ScanningAnimation label="Analyzing URL patterns..." />}

      {scanError ? (
        <div className="ghost-card p-4" style={{ borderColor: "rgba(255,95,120,0.5)" }}>
          <p className="text-sm font-semibold" style={{ color: "var(--ghost-red)" }}>
            {scanError}
          </p>
        </div>
      ) : null}

      {result && !scanning && (
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
      )}
    </div>
  );
}
