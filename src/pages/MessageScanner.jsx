import React, { useState } from "react";
import { MessageSquareWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ScannerHeader from "../components/scanner/ScannerHeader";
import ScanningAnimation from "../components/scanner/ScanningAnimation";
import FraudScoreDisplay from "../components/scanner/FraudScoreDisplay";
import { useNotify } from "../components/useNotify";
import { createScanHistory } from "@/lib/data";
import { analyzeMessage } from "@/lib/api";

export default function MessageScanner() {
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const notify = useNotify();

  const handleScan = async () => {
    if (!message.trim()) return;
    setScanning(true);
    setResult(null);

    const res = await analyzeMessage(message);

    setResult(res);
    notify(res.risk_level, "message");

    await createScanHistory({
      scan_type: "message",
      input_content: message.substring(0, 200),
      fraud_score: res.fraud_score,
      risk_level: res.risk_level,
      ai_analysis: res.analysis,
      reasons: res.reasons,
    });

    setScanning(false);
  };

  return (
    <div className="space-y-4">
      <ScannerHeader
        icon={MessageSquareWarning}
        title="Message Scanner"
        description="Paste any suspicious message to analyze it for scam patterns"
        color="#00d4ff"
      />

      <div className="ghost-card p-4 space-y-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Paste a suspicious message here… e.g. 'Your bank account will be blocked. Click here to verify immediately.'"
          className="min-h-[140px] bg-transparent border-0 resize-none text-sm font-medium focus-visible:ring-0 placeholder:text-slate-500"
          style={{ color: 'var(--ghost-text)' }}
        />
        <Button
          onClick={handleScan}
          disabled={scanning || !message.trim()}
          className="w-full h-12 rounded-xl font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #0891b2)' }}>
          {scanning ? "Scanning..." : "Analyze Message"}
        </Button>
      </div>

      {scanning && <ScanningAnimation label="Analyzing message patterns..." />}
      
      {result && !scanning && (
        <FraudScoreDisplay
          score={result.fraud_score}
          riskLevel={result.risk_level}
          reasons={result.reasons}
          analysis={result.analysis}
        />
      )}
    </div>
  );
}
