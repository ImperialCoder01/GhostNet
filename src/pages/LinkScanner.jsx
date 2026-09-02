import React, { useState, useEffect } from "react";
import { Link2, Globe, Lock, Clock, Users, Eye, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ScannerHeader from "../components/scanner/ScannerHeader";
import ScanningAnimation from "../components/scanner/ScanningAnimation";
import FraudScoreDisplay from "../components/scanner/FraudScoreDisplay";
import ClickSimulationModal from "../components/scanner/ClickSimulationModal";
import { useNotify } from "../components/useNotify";
import { motion } from "framer-motion";
import { createScanHistory } from "@/lib/data";
import { analyzeLink } from "@/lib/api";
import { SAMPLE_THREATS } from "@/lib/threatLibrary";
import { useLocation } from "react-router-dom";

export default function LinkScanner() {
  const location = useLocation();
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [showSimModal, setShowSimModal] = useState(false);
  const notify = useNotify();

  useEffect(() => {
    if (location.state?.demoInput) {
      setUrl(location.state.demoInput);
    }
  }, [location.state]);

  const handleScan = async (urlToScan = url) => {
    const targetUrl = (typeof urlToScan === 'string' ? urlToScan : url).trim();
    if (!targetUrl) return;

    setScanning(true);
    setResult(null);

    try {
      const res = await analyzeLink(targetUrl);
      setResult(res);
      notify(res.risk_level, "link");

      await createScanHistory({
        scan_type: "link",
        input_content: targetUrl.substring(0, 240),
        fraud_score: res.fraud_score,
        risk_level: res.risk_level,
        ai_analysis: res.analysis || res.ai_analysis,
        reasons: res.reasons,
      });
    } catch (err) {
      console.error("Link scan error:", err);
    } finally {
      setScanning(false);
    }
  };

  const sampleLinks = [
    { name: "PayPal Phishing Clone", url: "https://paypal-security-verification.com/webscr/login?cmd=_login_run" },
    { name: "SBI KYC Phishing Portal", url: "https://sbi-kyc-update-portal.online/auth" },
    { name: "Obfuscated Shortener", url: "https://bit.ly/3xFakeRewardClaim" }
  ];

  return (
    <div className="space-y-6">
      <ScannerHeader
        icon={Link2}
        title="Link & Domain Trust Inspector"
        description="Analyze suspicious URLs, typosquatting domains, brand mimicry, and deceptive redirect chains"
        color="#a78bfa"
      />

      {/* Input Card */}
      <div className="ghost-card p-5 space-y-4">
        
        {/* Sample Pills */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Benchmark Phishing URLs
          </span>
          <div className="flex flex-wrap gap-2">
            {sampleLinks.map((s, idx) => (
              <button
                key={idx}
                onClick={() => { setUrl(s.url); handleScan(s.url); }}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-purple-400/50 hover:bg-slate-900 text-slate-300 hover:text-white transition-all">
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="rounded-xl bg-slate-950/60 border border-slate-800 focus-within:border-purple-500/50 transition-colors p-1 flex items-center">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://suspicious-domain.com/login"
            className="h-12 bg-transparent border-0 text-sm font-medium focus-visible:ring-0 placeholder:text-slate-500 text-slate-100"
          />
        </div>

        <Button
          onClick={() => handleScan()}
          disabled={scanning || !url.trim()}
          className="w-full h-12 rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(167,139,250,0.25)]"
          style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}>
          {scanning ? "Inspecting Domain Infrastructure..." : "Inspect Link Safety"}
        </Button>
      </div>

      {scanning && <ScanningAnimation label="Decomposing URL, SSL certificates, and typosquatting signals..." />}

      {result && !scanning && (
        <div className="space-y-4">
          
          {/* Domain Trust Profile & Telemetry Grid */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="ghost-card p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Domain Age</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-base font-bold text-white">
                {result.domain_age_days ? `${result.domain_age_days} days` : "Unknown"}
              </p>
              <span className="text-[10px] text-slate-400">
                {result.domain_age_days < 30 ? "⚠️ Newly Created" : "Established"}
              </span>
            </div>

            <div className="ghost-card p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">SSL Certificate</span>
                <Lock className="w-4 h-4" style={{ color: result.ssl_status?.includes('Valid') ? 'var(--ghost-green)' : 'var(--ghost-red)' }} />
              </div>
              <p className="text-base font-bold text-white truncate">
                {result.ssl_status || "Standard"}
              </p>
              <span className="text-[10px] text-slate-400">
                Transport Layer
              </span>
            </div>

            <div className="ghost-card p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Brand Mimicry</span>
                <Globe className="w-4 h-4" style={{ color: result.is_known_brand_impersonation ? 'var(--ghost-red)' : 'var(--ghost-green)' }} />
              </div>
              <p className="text-base font-bold text-white truncate">
                {result.is_known_brand_impersonation ? "Detected" : "Clean"}
              </p>
              <span className="text-[10px] text-slate-400 truncate">
                {result.impersonated_brand || "No impersonation"}
              </span>
            </div>

            <div className="ghost-card p-3.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Threat Reports</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-base font-bold text-white">
                {result.community_reports || 0}
              </p>
              <span className="text-[10px] text-slate-400">
                Community Flags
              </span>
            </div>

          </motion.div>

          {/* Safe Educational Sandbox Prompt */}
          <div className="ghost-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-amber-500/30 bg-gradient-to-r from-slate-900 to-amber-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Safe Threat Simulation Sandbox
                </h4>
                <p className="text-xs text-slate-300">
                  Curious what would happen if you opened this link? Walk through a safe educational simulation.
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowSimModal(true)}
              className="text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shrink-0 h-9 px-4 rounded-lg">
              Launch Simulation
            </Button>
          </div>

          {/* Score & Threat Reconstruction */}
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
              scan_type: "link",
              input_content: url,
              fraud_score: result.fraud_score,
              analysis: result.analysis || result.ai_analysis,
              reasons: result.reasons,
              impersonated_brand: result.impersonated_brand
            }}
          />

          {/* Simulation Modal */}
          <ClickSimulationModal
            isOpen={showSimModal}
            onClose={() => setShowSimModal(false)}
            url={url}
            steps={result.simulation_steps}
          />

        </div>
      )}
    </div>
  );
}
