import React, { useState } from "react";
import { Link2, Globe, Lock, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScannerHeader from "../components/scanner/ScannerHeader";
import ScanningAnimation from "../components/scanner/ScanningAnimation";
import FraudScoreDisplay from "../components/scanner/FraudScoreDisplay";
import { useNotify } from "../components/useNotify";
import { motion } from "framer-motion";
import { createScanHistory } from "@/lib/data";
import { analyzeLink } from "@/lib/api";

export default function LinkScanner() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const notify = useNotify();

  const handleScan = async () => {
    if (!url.trim()) return;
    setScanning(true);
    setResult(null);

    const res = await analyzeLink(url);

    setResult(res);
    notify(res.risk_level, "link");

    await createScanHistory({
      scan_type: "link",
      input_content: url.substring(0, 200),
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
        icon={Link2}
        title="Link Scanner"
        description="Paste any suspicious URL to check if it's a phishing website"
        color="#a78bfa"
      />

      <div className="ghost-card p-4 space-y-4">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://suspicious-link.com/verify"
          className="h-12 bg-transparent border-0 text-sm font-medium focus-visible:ring-0 placeholder:text-slate-500"
          style={{ color: 'var(--ghost-text)' }}
        />
        <Button
          onClick={handleScan}
          disabled={scanning || !url.trim()}
          className="w-full h-12 rounded-xl font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}>
          {scanning ? "Scanning..." : "Analyze Link"}
        </Button>
      </div>

      {scanning && <ScanningAnimation label="Analyzing URL patterns..." />}

      {result && !scanning && (
        <>
          {/* Technical Details */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-2">
            <div className="ghost-card p-3 flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: 'var(--ghost-neon)' }} />
              <div>
                <p className="text-xs font-bold" style={{ color: '#8fa8c8' }}>Domain Age</p>
                <p className="text-sm font-bold text-white">{result.domain_age_days} days</p>
              </div>
            </div>
            <div className="ghost-card p-3 flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: result.ssl_status === 'Valid' ? 'var(--ghost-green)' : 'var(--ghost-red)' }} />
              <div>
                <p className="text-xs font-bold" style={{ color: '#8fa8c8' }}>SSL Certificate</p>
                <p className="text-sm font-bold text-white">{result.ssl_status}</p>
              </div>
            </div>
            <div className="ghost-card p-3 flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: 'var(--ghost-orange)' }} />
              <div>
                <p className="text-xs font-bold" style={{ color: '#8fa8c8' }}>Reports</p>
                <p className="text-sm font-bold text-white">{result.community_reports}</p>
              </div>
            </div>
            <div className="ghost-card p-3 flex items-center gap-2">
              <Globe className="w-4 h-4" style={{ color: result.is_known_brand_impersonation ? 'var(--ghost-red)' : 'var(--ghost-green)' }} />
              <div>
                <p className="text-xs font-bold" style={{ color: '#8fa8c8' }}>Impersonation</p>
                <p className="text-sm font-bold text-white">{result.is_known_brand_impersonation ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </motion.div>

          <FraudScoreDisplay
            score={result.fraud_score}
            riskLevel={result.risk_level}
            reasons={result.reasons}
            analysis={result.analysis}
          />
        </>
      )}
    </div>
  );
}
