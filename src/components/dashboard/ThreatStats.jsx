import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, ShieldCheck, Eye } from "lucide-react";

export default function ThreatStats({ reports, scans }) {
  const totalScams = reports.filter(r => r.risk_level === 'scam').length;
  const totalSuspicious = reports.filter(r => r.risk_level === 'suspicious').length;
  const totalSafe = scans.filter(s => s.risk_level === 'safe').length;

  const stats = [
    { label: "Total Scans", value: scans.length, icon: Eye, color: "var(--ghost-neon)" },
    { label: "Scams Found", value: totalScams, icon: AlertTriangle, color: "var(--ghost-red)" },
    { label: "Suspicious", value: totalSuspicious, icon: TrendingUp, color: "var(--ghost-orange)" },
    { label: "Safe", value: totalSafe, icon: ShieldCheck, color: "var(--ghost-green)" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="ghost-card p-4 text-center">
            <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
            <p className="text-2xl font-extrabold text-white">{stat.value}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--ghost-text-dim)' }}>{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}