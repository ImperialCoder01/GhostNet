import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

export default function FraudScoreDisplay({ score, riskLevel, reasons, analysis }) {
  const config = {
    safe: { 
      icon: ShieldCheck, 
      label: "Safe", 
      color: "var(--ghost-green)",
      bg: "rgba(0,255,136,0.1)",
      border: "rgba(0,255,136,0.2)",
      scoreClass: "score-safe"
    },
    suspicious: { 
      icon: ShieldAlert, 
      label: "Suspicious", 
      color: "var(--ghost-orange)",
      bg: "rgba(255,159,67,0.1)",
      border: "rgba(255,159,67,0.2)",
      scoreClass: "score-suspicious"
    },
    scam: { 
      icon: ShieldX, 
      label: "⚠ Scam Alert", 
      color: "var(--ghost-red)",
      bg: "rgba(255,59,92,0.1)",
      border: "rgba(255,59,92,0.2)",
      scoreClass: "score-scam"
    },
  };

  const c = config[riskLevel] || config.safe;
  const Icon = c.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl p-6 space-y-5"
      style={{ background: c.bg, border: `2px solid ${c.border}` }}>
      
      {/* Score Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${c.color}20` }}>
            <Icon className="w-6 h-6" style={{ color: c.color }} />
          </div>
          <div>
            <p className="text-lg font-bold" style={{ color: c.color }}>{c.label}</p>
            <p className="text-sm font-medium" style={{ color: 'var(--ghost-text-dim)' }}>Fraud Probability</p>
          </div>
        </div>
        <p className={`text-5xl font-black ${c.scoreClass}`}>{score}%</p>
      </div>

      {/* Score Bar */}
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: c.color }}
        />
      </div>

      {/* Reasons */}
      {reasons && reasons.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--ghost-text-dim)' }}>
            Risk Factors Detected
          </p>
          <div className="space-y-2">
            {reasons.map((reason, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2">
                <span className="text-base font-bold mt-px" style={{ color: c.color }}>›</span>
                <span className="text-sm font-medium leading-relaxed" style={{ color: 'var(--ghost-text)' }}>{reason}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis */}
      {analysis && (
        <div className="rounded-xl p-4" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--ghost-text-dim)' }}>AI Analysis</p>
          <p className="text-sm font-medium leading-relaxed" style={{ color: '#d0e4f8' }}>{analysis}</p>
        </div>
      )}
    </motion.div>
  );
}