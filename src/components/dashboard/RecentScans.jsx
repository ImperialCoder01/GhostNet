import React from "react";
import { MessageSquareWarning, Link2, Image, Mic, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  message: MessageSquareWarning,
  link: Link2,
  screenshot: Image,
  voice: Mic,
};

const riskColors = {
  safe: { color: 'var(--ghost-green)', bg: 'rgba(0,255,136,0.1)' },
  suspicious: { color: 'var(--ghost-orange)', bg: 'rgba(255,159,67,0.1)' },
  scam: { color: 'var(--ghost-red)', bg: 'rgba(255,59,92,0.1)' },
};

export default function RecentScans({ scans }) {
  if (!scans || scans.length === 0) {
    return (
      <div className="ghost-card p-6 text-center">
        <p className="text-sm font-medium" style={{ color: 'var(--ghost-text-dim)' }}>
          No scans yet. Start by scanning a message or link.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {scans.slice(0, 5).map((scan, i) => {
        const Icon = iconMap[scan.scan_type] || MessageSquareWarning;
        const risk = riskColors[scan.risk_level] || riskColors.safe;
        return (
          <motion.div
            key={scan.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="ghost-card p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: risk.bg }}>
              <Icon className="w-4 h-4" style={{ color: risk.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--ghost-text)' }}>
                {scan.input_content || `${scan.scan_type} scan`}
              </p>
              <p className="text-xs font-medium capitalize mt-0.5" style={{ color: 'var(--ghost-text-dim)' }}>
                {scan.scan_type} · {new Date(scan.created_date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-base font-extrabold" style={{ color: risk.color }}>
                {scan.fraud_score}%
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}