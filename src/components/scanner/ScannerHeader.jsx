import React from "react";
import { motion } from "framer-motion";

export default function ScannerHeader({ icon: Icon, title, description, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="ghost-card ghost-panel p-5 md:p-6 flex items-start gap-4 mb-6"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `${color}20`, border: `1px solid ${color}35`, boxShadow: `0 0 28px ${color}20` }}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="section-label mb-2">Threat Scanner</p>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">{title}</h1>
        <p className="text-sm md:text-base mt-2 max-w-2xl" style={{ color: "var(--ghost-text-dim)" }}>
          {description}
        </p>
      </div>
    </motion.div>
  );
}
