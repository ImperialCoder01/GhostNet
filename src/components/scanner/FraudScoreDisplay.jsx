import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX, Activity, AlertTriangle, Sparkles, Key, DollarSign, Clock, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import ThreatReconstruction from "./ThreatReconstruction";
import EmergencyActionCard from "./EmergencyActionCard";

export default function FraudScoreDisplay({
  score = 0,
  riskLevel = "safe",
  confidence = "high",
  reasons = [],
  analysis = "",
  attackIntent = "",
  signals = {},
  threatReconstruction = [],
  similarPatterns = [],
  rawScanData = {}
}) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "evidence" | "chain" | "actions"

  const config = {
    safe: {
      icon: ShieldCheck,
      label: "SAFE / LOW RISK",
      badgeClass: "badge-safe",
      scoreClass: "score-safe",
      color: "var(--ghost-green)",
      accentBorder: "rgba(16, 185, 129, 0.3)",
      description: "No recognized social engineering, malware, or phishing indicators detected."
    },
    suspicious: {
      icon: ShieldAlert,
      label: "SUSPICIOUS / ELEVATED RISK",
      badgeClass: "badge-suspicious",
      scoreClass: "score-suspicious",
      color: "var(--ghost-orange)",
      accentBorder: "rgba(245, 158, 11, 0.3)",
      description: "Potential scam or coercion patterns found. Exercise strict caution before proceeding."
    },
    scam: {
      icon: ShieldX,
      label: "HIGH THREAT SCAM DETECTED",
      badgeClass: "badge-scam",
      scoreClass: "score-scam",
      color: "var(--ghost-red)",
      accentBorder: "rgba(239, 68, 68, 0.4)",
      description: "Strong evidence of malicious deception, credential harvesting, or financial fraud."
    },
  };

  const c = config[riskLevel] || config.safe;
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4">
      
      {/* Main Score Hero Card */}
      <div className="ghost-card p-6 relative overflow-hidden"
        style={{ borderColor: c.accentBorder }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `rgba(${riskLevel === 'safe' ? '16,185,129' : riskLevel === 'suspicious' ? '245,158,11' : '239,68,68'}, 0.15)` }}>
              <Icon className="w-8 h-8" style={{ color: c.color }} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${c.badgeClass}`}>
                  {c.label}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full badge-neutral">
                  AI Confidence: <strong className="text-white capitalize">{confidence}</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Threat Assessment Verdict
              </h2>
              <p className="text-xs font-medium text-slate-300 max-w-md">
                {c.description}
              </p>
            </div>
          </div>

          {/* Calibrated Risk Score Gauge */}
          <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-2xl border border-white/5 self-start md:self-auto">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                Risk Score
              </span>
              <span className="text-xs font-mono text-slate-400">
                0 (Safe) — 100 (Critical)
              </span>
            </div>
            <div className="flex items-baseline">
              <span className={`text-4xl sm:text-5xl font-black font-display ${c.scoreClass}`}>
                {score}
              </span>
              <span className="text-sm font-bold text-slate-500 ml-1">/100</span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-2 rounded-full overflow-hidden mt-6 bg-slate-900">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: c.color }}
          />
        </div>
      </div>

      {/* Threat Reconstruction Component */}
      {threatReconstruction && threatReconstruction.length > 0 && (
        <ThreatReconstruction
          attackChain={threatReconstruction}
          attackerIntent={attackIntent}
        />
      )}

      {/* Specific Signals Matrix (Social Engineering Breakdown) */}
      {signals && Object.values(signals).some(Boolean) && (
        <div className="ghost-card p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Detected Manipulation Signals
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {signals.urgency && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-amber-300 block">Urgency / Time Pressure</span>
                  <p className="text-xs text-slate-300 mt-0.5">{signals.urgency}</p>
                </div>
              </div>
            )}
            {signals.credential && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <Key className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-rose-300 block">Credential Harvesting</span>
                  <p className="text-xs text-slate-300 mt-0.5">{signals.credential}</p>
                </div>
              </div>
            )}
            {signals.financial && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-emerald-300 block">Financial / Payment Trap</span>
                  <p className="text-xs text-slate-300 mt-0.5">{signals.financial}</p>
                </div>
              </div>
            )}
            {signals.impersonation && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-2.5">
                <Users className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-cyan-300 block">Brand Impersonation</span>
                  <p className="text-xs text-slate-300 mt-0.5">{signals.impersonation}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Evidence Points */}
      {reasons && reasons.length > 0 && (
        <div className="ghost-card p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Specific Evidence Findings ({reasons.length})
          </h3>
          <div className="space-y-2">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-950/30 border border-slate-800/60">
                <span className="text-cyan-400 font-bold text-sm">›</span>
                <span className="text-xs font-medium text-slate-200 leading-relaxed">{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Explanation / Reasoning */}
      {analysis && (
        <div className="ghost-card p-5 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Deep Threat Intelligence Summary
          </h3>
          <p className="text-xs font-medium text-slate-300 leading-relaxed">
            {analysis}
          </p>
        </div>
      )}

      {/* Similar Verified Community Scams */}
      {similarPatterns && similarPatterns.length > 0 && (
        <div className="ghost-card p-5 space-y-3 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" /> Similar Community Scam Matches
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Benchmark Intelligence</span>
          </div>

          <div className="space-y-2">
            {similarPatterns.map((pat, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{pat.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full badge-neutral font-semibold">
                      {pat.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{pat.attackerIntent}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-cyan-400">{pat.similarityPercent}% match</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Action Plan */}
      <EmergencyActionCard
        riskLevel={riskLevel}
        scanData={rawScanData}
      />
    </motion.div>
  );
}
