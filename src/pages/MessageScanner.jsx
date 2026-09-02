import React, { useState, useEffect } from "react";
import { MessageSquareWarning, Sparkles, Trash2, Shield, Upload, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ScannerHeader from "../components/scanner/ScannerHeader";
import ScanningAnimation from "../components/scanner/ScanningAnimation";
import FraudScoreDisplay from "../components/scanner/FraudScoreDisplay";
import { useNotify } from "../components/useNotify";
import { createScanHistory } from "@/lib/data";
import { analyzeMessage } from "@/lib/api";
import { SAMPLE_THREATS } from "@/lib/threatLibrary";
import { useLocation } from "react-router-dom";

export default function MessageScanner() {
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const notify = useNotify();

  useEffect(() => {
    if (location.state?.demoInput) {
      setMessage(location.state.demoInput);
    }
  }, [location.state]);

  const handleScan = async (textToScan = message) => {
    const text = (typeof textToScan === 'string' ? textToScan : message).trim();
    if (!text) return;
    
    setScanning(true);
    setResult(null);

    try {
      const res = await analyzeMessage(text);
      setResult(res);
      notify(res.risk_level, "message");

      await createScanHistory({
        scan_type: "message",
        input_content: text.substring(0, 240),
        fraud_score: res.fraud_score,
        risk_level: res.risk_level,
        ai_analysis: res.analysis || res.ai_analysis,
        reasons: res.reasons,
      });
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setScanning(false);
    }
  };

  const handleSelectSample = (sampleText) => {
    setMessage(sampleText);
    handleScan(sampleText);
  };

  const messageThreats = SAMPLE_THREATS.filter(t => t.type === 'message');

  return (
    <div className="space-y-6">
      <ScannerHeader
        icon={MessageSquareWarning}
        title="Message & Social Engineering Scanner"
        description="Inspect SMS, WhatsApp, Telegram, or email text for urgency manipulation, credential harvesting, and fraudulent payment prompts"
        color="#00e5ff"
      />

      {/* Main Input Card */}
      <div className="ghost-card p-5 space-y-4">
        
        {/* Sample Quick Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: 'var(--ghost-text-dim)' }}>
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Benchmark Test Scenarios
            </span>
            {message && (
              <button
                onClick={() => { setMessage(""); setResult(null); }}
                className="text-xs font-semibold text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Clear Text
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {messageThreats.map((threat) => (
              <button
                key={threat.id}
                onClick={() => handleSelectSample(threat.sampleInput)}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg border hover:border-cyan-400/50 transition-all text-left"
                style={{
                  background: 'var(--ghost-surface-2)',
                  borderColor: 'var(--ghost-border)',
                  color: 'var(--ghost-text)'
                }}>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono mr-1">{threat.category}:</span>
                {threat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Area */}
        <div className="rounded-xl border focus-within:border-cyan-500/50 transition-colors p-2"
          style={{ background: 'var(--ghost-surface-2)', borderColor: 'var(--ghost-border)' }}>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste suspicious message text here... e.g. 'DEAR CUSTOMER, YOUR ACCOUNT IS BLOCKED DUE TO KYC...'"
            className="min-h-[130px] bg-transparent border-0 resize-none text-sm font-medium focus-visible:ring-0 placeholder:text-slate-400"
            style={{ color: 'var(--ghost-text)' }}
          />
        </div>

        {/* Action Button */}
        <Button
          onClick={() => handleScan()}
          disabled={scanning || !message.trim()}
          className="w-full h-12 rounded-xl font-bold transition-all shadow-md bg-cyan-500 hover:bg-cyan-400 text-slate-950">
          {scanning ? "Evaluating Threat Vectors..." : "Inspect & Reconstruct Threat"}
        </Button>
      </div>

      {/* Multi-stage scanning radar */}
      {scanning && <ScanningAnimation label="Running multi-signal linguistic and threat model analysis..." />}
      
      {/* Rich Explainable Results */}
      {result && !scanning && (
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
            scan_type: "message",
            input_content: message,
            fraud_score: result.fraud_score,
            analysis: result.analysis || result.ai_analysis,
            reasons: result.reasons,
          }}
        />
      )}
    </div>
  );
}
