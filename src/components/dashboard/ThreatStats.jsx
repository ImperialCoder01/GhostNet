import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Eye, ShieldCheck, TrendingUp } from "lucide-react";

export default function ThreatStats({ reports, scans }) {
  const totalScams = reports.filter((report) => report.risk_level === "scam").length;
  const totalSuspicious = reports.filter((report) => report.risk_level === "suspicious").length;
  const totalSafe = scans.filter((scan) => scan.risk_level === "safe").length;

  const stats = [
    { label: "Total Scans", value: scans.length, icon: Eye, color: "var(--ghost-neon)" },
    { label: "Scams Found", value: totalScams, icon: AlertTriangle, color: "var(--ghost-red)" },
    { label: "Suspicious", value: totalSuspicious, icon: TrendingUp, color: "var(--ghost-orange)" },
    { label: "Safe", value: totalSafe, icon: ShieldCheck, color: "var(--ghost-green)" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 }}
            className="ghost-card p-4"
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: `${stat.color}18` }}>
              <Icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-3xl font-extrabold text-white">{stat.value}</p>
            <p className="text-sm font-semibold mt-2" style={{ color: "var(--ghost-text-dim)" }}>
              {stat.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
